import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import BloodBankSidebar from './BloodBankSidebar';

const mockAppointments = [];

export default function BloodBankAppointments() {
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past'

  const [rows, setRows] = useState(mockAppointments);

  useEffect(() => {
    const loadAppointments = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const [upRes, pastRes] = await Promise.all([
          fetch('/api/appointments/bloodbank/upcoming', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/appointments/bloodbank/past', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const upData = upRes.ok ? await upRes.json() : { success: false, appointments: [] };
        const pastData = pastRes.ok ? await pastRes.json() : { success: false, appointments: [] };
        if (upData.success || pastData.success) {
          const normalized = [
            ...(upData.appointments || []).map(a => ({
              id: a._id,
              donor: a.userId?.name || 'Donor',
              donorEmail: a.userId?.email || '',
              donorPhone: a.userId?.phone || '',
              date: a.date,
              time: a.time,
              bloodType: a.userId?.bloodGroup || '',
              type: a.donationType?.replace('-', ' ') || 'Whole Blood',
              status: 'Upcoming',
            })),
            ...(pastData.appointments || []).map(a => ({
              id: a._id,
              donor: a.userId?.name || 'Donor',
              donorEmail: a.userId?.email || '',
              donorPhone: a.userId?.phone || '',
              date: a.date,
              time: a.time,
              bloodType: a.userId?.bloodGroup || '',
              type: a.donationType?.replace('-', ' ') || 'Whole Blood',
              status: a.status === 'Scheduled' ? 'Completed' : a.status,
            })),
          ];
          setRows(normalized);
        }
      } catch (e) {
        console.error('Error loading blood bank appointments:', e);
      }
    };
    loadAppointments();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = useMemo(() => rows.filter(a => new Date(a.date) >= today && a.status === 'Upcoming').sort((a,b) => new Date(a.date) - new Date(b.date)), [rows]);
  const past = useMemo(() => rows.filter(a => new Date(a.date) < today || ['Completed','Cancelled'].includes(a.status)).sort((a,b) => new Date(b.date) - new Date(a.date)), [rows]);
  const tableRows = activeTab === 'upcoming' ? upcoming : past;

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <BloodBankSidebar />
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-2">Manage Appointments</h1>
        <p className="text-gray-500 mb-6">View and manage donor appointments.</p>

        {/* Tabs */}
        <div className="mb-6">
          <div className="inline-flex items-center border border-gray-200 rounded-lg p-1 bg-gray-50">
            <button onClick={() => setActiveTab('upcoming')} className={`px-4 py-1.5 rounded-md text-sm font-medium ${activeTab === 'upcoming' ? 'bg-red-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>Upcoming</button>
            <button onClick={() => setActiveTab('past')} className={`px-4 py-1.5 rounded-md text-sm font-medium ${activeTab === 'past' ? 'bg-red-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>Past</button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-5 py-3 text-sm font-semibold text-gray-600">Donor Name</th>
                <th className="px-5 py-3 text-sm font-semibold text-gray-600">Email</th>
                <th className="px-5 py-3 text-sm font-semibold text-gray-600">Phone</th>
                <th className="px-5 py-3 text-sm font-semibold text-gray-600">Date</th>
                <th className="px-5 py-3 text-sm font-semibold text-gray-600">Time</th>
                <th className="px-5 py-3 text-sm font-semibold text-gray-600">Blood Type</th>
                <th className="px-5 py-3 text-sm font-semibold text-gray-600">Donation Type</th>
                <th className="px-5 py-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-5 py-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-gray-500">No {activeTab} appointments</td>
                </tr>
              ) : (
                tableRows.map((a) => (
                  <tr key={a.id} className="border-b hover:bg-gray-50">
                    <td className="px-5 py-3">{a.donor}</td>
                    <td className="px-5 py-3">{a.donorEmail || '-'}</td>
                    <td className="px-5 py-3">{a.donorPhone || '-'}</td>
                    <td className="px-5 py-3">{format(new Date(a.date), 'dd-MM-yyyy')}</td>
                    <td className="px-5 py-3">{a.time}</td>
                    <td className="px-5 py-3 font-bold text-red-600">{a.bloodType}</td>
                    <td className="px-5 py-3">{a.type}</td>
                    <td className="px-5 py-3"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(a.status)}`}>{a.status}</span></td>
                    <td className="px-5 py-3"><button title="View" className="text-blue-500 hover:underline">👁</button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
