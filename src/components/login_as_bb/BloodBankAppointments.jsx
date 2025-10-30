import React from 'react';
import BloodBankSidebar from './BloodBankSidebar';

const apptList = [
  { donor: "Aarav Sharma", date: "15-10-2025", time: "10:00", bloodType: "A+", type: "Whole Blood", status: "Upcoming" },
  { donor: "Diya Patel", date: "18-10-2025", time: "11:30", bloodType: "O-", type: "Platelets", status: "Upcoming" },
  { donor: "Rohan Kumar", date: "20-10-2025", time: "14:00", bloodType: "B+", type: "Whole Blood", status: "Upcoming" }
];

export default function BloodBankAppointments() {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <BloodBankSidebar />
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-2">Manage Appointments</h1>
        <p className="text-gray-500 mb-4">View and manage donor appointments.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow border px-8 py-5">
            <span className="text-sm text-gray-500 mb-1">Total Appointments</span>
            <span className="text-3xl font-bold text-gray-800">6</span>
          </div>
          <div className="bg-white rounded-lg shadow border px-8 py-5">
            <span className="text-sm text-gray-500 mb-1">Upcoming Appointments</span>
            <span className="text-3xl font-bold text-yellow-500">3</span>
          </div>
          <div className="bg-white rounded-lg shadow border px-8 py-5">
            <span className="text-sm text-gray-500 mb-1">Past Appointments</span>
            <span className="text-3xl font-bold text-red-400">3</span>
          </div>
        </div>
        {/* Table */}
        <div className="bg-white rounded-xl shadow border">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-5 py-3 text-sm font-semibold text-gray-600">Donor Name</th>
                <th className="px-5 py-3 text-sm font-semibold text-gray-600">Date</th>
                <th className="px-5 py-3 text-sm font-semibold text-gray-600">Time</th>
                <th className="px-5 py-3 text-sm font-semibold text-gray-600">Blood Type</th>
                <th className="px-5 py-3 text-sm font-semibold text-gray-600">Donation Type</th>
                <th className="px-5 py-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-5 py-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apptList.map((a, idx) => (
                <tr key={idx}>
                  <td className="px-5 py-3">{a.donor}</td>
                  <td className="px-5 py-3">{a.date}</td>
                  <td className="px-5 py-3">{a.time}</td>
                  <td className="px-5 py-3 font-bold text-red-600">{a.bloodType}</td>
                  <td className="px-5 py-3">{a.type}</td>
                  <td className="px-5 py-3"><span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">{a.status}</span></td>
                  <td className="px-5 py-3"><button title="View" className="text-blue-500 hover:underline">👁</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
