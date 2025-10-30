  import React, { useState, useMemo, Fragment } from "react";
  import { useNavigate } from "react-router-dom";
  import { useAuth } from "../../context/AuthContext";
  import Sidebar from "./Sidebar";
  import toast, { Toaster } from 'react-hot-toast';
  import Papa from 'papaparse';


  // --- MOCK DATA ---
  const initialRequests = [
    { id: 1, patientName: "Aditi Sharma", patientAge: 34, bloodGroup: "O+", units: 2, hospital: "City General Hospital", reason: "Emergency Surgery", requestDate: "2025-10-08", status: "Pending", contactPerson: "Dr. Mehta", contactNumber: "9876543210" },
    { id: 2, patientName: "Rohan Verma", patientAge: 45, bloodGroup: "A+", units: 1, hospital: "Apollo Hospital", reason: "Anemia Treatment", requestDate: "2025-10-08", status: "Pending", contactPerson: "Dr. Singh", contactNumber: "9876543211" },
    { id: 3, patientName: "Priya Singh", patientAge: 28, bloodGroup: "B-", units: 3, hospital: "Fortis Healthcare", reason: "Accident Trauma", requestDate: "2025-10-07", status: "Approved", contactPerson: "Dr. Patel", contactNumber: "9876543212" },
    { id: 4, patientName: "Karan Gupta", patientAge: 52, bloodGroup: "AB+", units: 2, hospital: "City General Hospital", reason: "Post-operative Care", requestDate: "2025-10-06", status: "Approved", contactPerson: "Dr. Mehta", contactNumber: "9876543213" },
    { id: 5, patientName: "Sneha Reddy", patientAge: 31, bloodGroup: "O-", units: 4, hospital: "St. John's Medical", reason: "Leukemia Treatment", requestDate: "2025-10-05", status: "Declined", contactPerson: "Dr. Reddy", contactNumber: "9876543214" },
    { id: 6, patientName: "Amit Kumar", patientAge: 60, bloodGroup: "A-", units: 1, hospital: "Apollo Hospital", reason: "Chronic Illness", requestDate: "2025-10-04", status: "Approved", contactPerson: "Dr. Kumar", contactNumber: "9876543215" },
  ];

  // --- ICONS ---
  const DropletIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" /></svg>);
  const ClockIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>);
  const CheckCircleIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
  const XCircleIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
  const DownloadIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>);
  const EyeIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>);
  const CheckIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12" /></svg>);
  const XIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);

  // --- HELPER FUNCTIONS ---
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Declined': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  export default function RequestsPage() {
    const [requests, setRequests] = useState(initialRequests);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ bloodGroup: '', status: '' });
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // --- DERIVED STATES ---
    const filteredRequests = useMemo(() => {
      return requests.filter(req => {
        const searchMatch = req.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || req.hospital.toLowerCase().includes(searchTerm.toLowerCase());
        const bloodGroupMatch = filters.bloodGroup ? req.bloodGroup === filters.bloodGroup : true;
        const statusMatch = filters.status ? req.status === filters.status : true;
        return searchMatch && bloodGroupMatch && statusMatch;
      });
    }, [requests, searchTerm, filters]);
    
    // Pagination
    const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

    // Summary Cards
    const totalCount = requests.length;
    const pendingCount = requests.filter(r => r.status === 'Pending').length;
    const approvedCount = requests.filter(r => r.status === 'Approved').length;
    const declinedCount = requests.filter(r => r.status === 'Declined').length;

    // --- HANDLERS ---
    const handleViewDetails = (item) => {
      setCurrentItem(item);
      setModalOpen(true);
    };

    const handleUpdateStatus = (id, newStatus) => {
      setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
      toast.success(`Request #${id} has been ${newStatus.toLowerCase()}.`);
      if(isModalOpen) setModalOpen(false);
    };
    
    const handleDownload = () => {
      const csv = Papa.unparse(filteredRequests);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `requests_report_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Report downloaded successfully!");
    };

    return (
      <div className="flex h-screen bg-gray-50 font-sans">
        <Toaster position="top-right" />
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <header className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Requests</h2>
            <p className="text-gray-500 mt-1">View and manage all blood requests.</p>
          </header>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="p-4 bg-white rounded-lg shadow-sm border flex items-center gap-4"><DropletIcon className="w-8 h-8 text-red-500" /><div><p className="text-sm text-gray-500">Total Requests</p><p className="text-2xl font-bold text-gray-800">{totalCount}</p></div></div>
              <div className="p-4 bg-white rounded-lg shadow-sm border flex items-center gap-4"><ClockIcon className="w-8 h-8 text-yellow-500" /><div><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold text-gray-800">{pendingCount}</p></div></div>
              <div className="p-4 bg-white rounded-lg shadow-sm border flex items-center gap-4"><CheckCircleIcon className="w-8 h-8 text-green-500" /><div><p className="text-sm text-gray-500">Approved</p><p className="text-2xl font-bold text-gray-800">{approvedCount}</p></div></div>
              <div className="p-4 bg-white rounded-lg shadow-sm border flex items-center gap-4"><XCircleIcon className="w-8 h-8 text-red-700" /><div><p className="text-sm text-gray-500">Declined</p><p className="text-2xl font-bold text-gray-800">{declinedCount}</p></div></div>
          </div>

          {/* Filters & Search */}
          <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <input type="text" placeholder="Search by patient name or hospital..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="text-sm border-gray-300 rounded-md w-72" />
              <select value={filters.bloodGroup} onChange={e => setFilters({...filters, bloodGroup: e.target.value})} className="text-sm border-gray-300 rounded-md">
                  <option value="">All Blood Types</option>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="text-sm border-gray-300 rounded-md">
                  <option value="">All Statuses</option>
                  {['Pending', 'Approved', 'Declined'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border rounded-lg shadow-sm hover:bg-gray-50">
              <DownloadIcon className="w-4 h-4" /> Export
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="p-4 text-sm font-semibold text-gray-600">Patient Name</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Blood Group</th>
                    <th className="p-4 text-sm font-semibold text-gray-600 text-right">Units</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Hospital</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Request Date</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                    <th className="p-4 text-sm font-semibold text-gray-600 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRequests.map((req) => (
                    <tr key={req.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-800">{req.patientName}</td>
                      <td className="p-4 font-bold text-red-600">{req.bloodGroup}</td>
                      <td className="p-4 text-sm text-gray-800 font-mono text-right">{req.units}</td>
                      <td className="p-4 text-sm text-gray-500">{req.hospital}</td>
                      <td className="p-4 text-sm text-gray-500">{req.requestDate}</td>
                      <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(req.status)}`}>{req.status}</span></td>
                      <td className="p-4 text-center space-x-2">
                        {req.status === 'Pending' && (
                            <>
                              <button onClick={() => handleUpdateStatus(req.id, 'Approved')} className="p-1 text-green-600 hover:text-green-800" title="Approve"><CheckIcon /></button>
                              <button onClick={() => handleUpdateStatus(req.id, 'Declined')} className="p-1 text-red-600 hover:text-red-800" title="Decline"><XIcon /></button>
                            </>
                        )}
                        <button onClick={() => handleViewDetails(req)} className="p-1 text-blue-600 hover:text-blue-800" title="View Details"><EyeIcon /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="p-4 flex justify-between items-center text-sm">
                <p>Showing {paginatedRequests.length} of {filteredRequests.length} entries</p>
                <div className="flex gap-1">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-red-500 text-white' : ''}`}>{i + 1}</button>
                    ))}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
                </div>
            </div>
          </div>
        </main>

        {/* View Details Modal */}
        {isModalOpen && currentItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
              <h3 className="text-xl font-bold mb-4 border-b pb-2">Request Details</h3>
              <div className="space-y-3 text-sm">
                  <p><strong>Patient Name:</strong> {currentItem.patientName} ({currentItem.patientAge} years)</p>
                  <p><strong>Blood Group:</strong> <span className="font-bold text-red-600">{currentItem.bloodGroup}</span></p>
                  <p><strong>Units Required:</strong> {currentItem.units}</p>
                  <p><strong>Hospital:</strong> {currentItem.hospital}</p>
                  <p><strong>Contact Person:</strong> {currentItem.contactPerson} ({currentItem.contactNumber})</p>
                  <p><strong>Reason:</strong> {currentItem.reason}</p>
                  <p><strong>Request Date:</strong> {currentItem.requestDate}</p>
                  <p><strong>Status:</strong> <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(currentItem.status)}`}>{currentItem.status}</span></p>
              </div>
              <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-md text-sm font-semibold">Close</button>
                {currentItem.status === 'Pending' && (
                  <>
                    <button onClick={() => handleUpdateStatus(currentItem.id, 'Declined')} className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-semibold">Decline Request</button>
                    <button onClick={() => handleUpdateStatus(currentItem.id, 'Approved')} className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-semibold">Approve Request</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }