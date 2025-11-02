import React, { useState, useMemo, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';
import toast, { Toaster } from 'react-hot-toast';
import Papa from 'papaparse';
import Sidebar from './Sidebar';

// --- MOCK DATA ---
const initialAppointments = [
    // Upcoming Appointments
    { id: "A-101", donorName: "Aarav Sharma", donorEmail: "aarav.s@example.com", donorPhone: "9820012345", date: "2025-10-15", time: "10:00", bloodType: "A+", donationType: "Whole Blood", status: "Upcoming", notes: "Prefers morning appointments." },
    { id: "A-102", donorName: "Diya Patel", donorEmail: "diya.p@example.com", donorPhone: "9987654321", date: "2025-10-18", time: "11:30", bloodType: "O-", donationType: "Platelets", status: "Upcoming", notes: "" },
    { id: "A-103", donorName: "Rohan Kumar", donorEmail: "rohan.k@example.com", donorPhone: "9321098765", date: "2025-10-20", time: "14:00", bloodType: "B+", donationType: "Whole Blood", status: "Upcoming", notes: "Completed health questionnaire online." },
    // Past Appointments
    { id: "A-104", donorName: "Priya Singh", donorEmail: "priya.s@example.com", donorPhone: "9876512345", date: "2025-10-02", time: "09:00", bloodType: "AB+", donationType: "Power Red", status: "Completed", notes: "" },
    { id: "A-105", donorName: "Arjun Reddy", donorEmail: "arjun.r@example.com", donorPhone: "9123456789", date: "2025-10-05", time: "13:00", bloodType: "O+", donationType: "Whole Blood", status: "Completed", notes: "" },
    { id: "A-106", donorName: "Sneha Reddy", donorEmail: "sneha.r@example.com", donorPhone: "9876543214", date: "2025-10-03", time: "15:00", bloodType: "O-", donationType: "Whole Blood", status: "Cancelled", notes: "Called to cancel due to illness." },
];

// --- ICONS ---
const SearchIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg> );
const ListIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> );
const CalendarIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> );
const DownloadIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>);
const EyeIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>);

const ITEMS_PER_PAGE = 10;

const CheckIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>);
const XIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState(initialAppointments);
    const [appointmentRequests, setAppointmentRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [bloodTypeFilter, setBloodTypeFilter] = useState('All');
    const [view, setView] = useState('list'); // 'list' or 'calendar'
    const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'upcoming', or 'past'
    const [isModalOpen, setModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isDenyModalOpen, setIsDenyModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());
    const [currentPage, setCurrentPage] = useState(1);
    const [approveFormData, setApproveFormData] = useState({ date: '', time: '', donationType: 'whole-blood', locationName: '', locationCity: '', hospitalResponse: '' });
    
    // --- DERIVED STATE & MEMOS ---
    const filteredAppointments = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day for accurate comparison

        return appointments
            .filter(appt => {
                const apptDate = new Date(appt.date);
                const matchesTab = activeTab === 'upcoming'
                    ? apptDate >= today && appt.status === 'Upcoming'
                    : apptDate < today || ['Completed', 'Cancelled'].includes(appt.status);
                
                const matchesSearch = appt.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    appt.id.toLowerCase().includes(searchTerm.toLowerCase());
                
                const matchesBloodType = bloodTypeFilter === 'All' || appt.bloodType === bloodTypeFilter;
                
                return matchesTab && matchesSearch && matchesBloodType;
            })
            .sort((a, b) => activeTab === 'upcoming'
                ? new Date(a.date) - new Date(b.date) // Sort ascending for upcoming
                : new Date(b.date) - new Date(a.date)  // Sort descending for past
            );
    }, [appointments, searchTerm, bloodTypeFilter, activeTab]);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, bloodTypeFilter, activeTab]);

    const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);
    const paginatedAppointments = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAppointments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAppointments, currentPage]);

    const { upcomingCount, pastCount, totalCount } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return appointments.reduce((counts, appt) => {
            const apptDate = new Date(appt.date);
            if (apptDate >= today && appt.status === 'Upcoming') {
                counts.upcomingCount++;
            } else {
                counts.pastCount++;
            }
            counts.totalCount++;
            return counts;
        }, { upcomingCount: 0, pastCount: 0, totalCount: 0 });
    }, [appointments]);

    // Calendar-related memos
    const appointmentsByDate = useMemo(() => {
        const groups = new Map();
        appointments.forEach(appt => {
            const date = format(new Date(appt.date), 'yyyy-MM-dd');
            if (!groups.has(date)) groups.set(date, []);
            groups.get(date).push(appt);
        });
        return groups;
    }, [appointments]);

    const highlightedDays = Array.from(appointmentsByDate.keys()).map(dateStr => new Date(dateStr));
    const appointmentsForSelectedDay = appointmentsByDate.get(format(selectedCalendarDate, 'yyyy-MM-dd')) || [];
    
    // Load appointment requests from backend
    useEffect(() => {
        loadAppointmentRequests();
    }, []);

    const loadAppointmentRequests = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            setLoadingRequests(true);
            const res = await fetch('/api/appointment-requests/hospital/pending', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setAppointmentRequests(data.requests || []);
                }
            }
        } catch (e) {
            console.error('Error loading appointment requests:', e);
            toast.error('Failed to load appointment requests');
        } finally {
            setLoadingRequests(false);
        }
    };

    const handleApproveRequest = async () => {
        const token = localStorage.getItem('token');
        if (!token || !selectedRequest) return;

        try {
            const res = await fetch(`/api/appointment-requests/${selectedRequest._id}/approve`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(approveFormData),
            });

            const data = await res.json();
            if (data.success) {
                toast.success('Appointment request approved!');
                setIsApproveModalOpen(false);
                setSelectedRequest(null);
                setApproveFormData({ date: '', time: '', donationType: 'whole-blood', locationName: '', locationCity: '', hospitalResponse: '' });
                loadAppointmentRequests();
            } else {
                toast.error(data.msg || 'Failed to approve request');
            }
        } catch (e) {
            console.error('Error approving request:', e);
            toast.error('Error approving request');
        }
    };

    const handleDenyRequest = async () => {
        const token = localStorage.getItem('token');
        if (!token || !selectedRequest) return;

        const response = prompt('Please provide a reason for denial (optional):');
        
        try {
            const res = await fetch(`/api/appointment-requests/${selectedRequest._id}/deny`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ hospitalResponse: response || 'Request denied' }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success('Appointment request denied');
                setIsDenyModalOpen(false);
                setSelectedRequest(null);
                loadAppointmentRequests();
            } else {
                toast.error(data.msg || 'Failed to deny request');
            }
        } catch (e) {
            console.error('Error denying request:', e);
            toast.error('Error denying request');
        }
    };

    // --- HANDLERS ---
    const handleViewDetails = (appt) => {
        setSelectedAppointment(appt);
        setModalOpen(true);
    };

    const handleExport = () => {
        const csv = Papa.unparse(filteredAppointments);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `appointments_report_${activeTab}_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Report downloaded successfully!");
      };

    // --- HELPERS ---
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Upcoming': return 'bg-blue-100 text-blue-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Toaster position="top-right" />
            <Sidebar />

            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Manage Appointments</h2>
                    <p className="text-gray-500 mt-1">View and manage donor appointments.</p>
                </header>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="p-4 bg-white rounded-lg shadow-sm border"><p className="text-sm text-gray-500">Total Appointments</p><p className="text-2xl font-bold text-gray-800">{totalCount}</p></div>
                    <div className="p-4 bg-white rounded-lg shadow-sm border"><p className="text-sm text-gray-500">Upcoming Appointments</p><p className="text-2xl font-bold text-gray-800">{upcomingCount}</p></div>
                    <div className="p-4 bg-white rounded-lg shadow-sm border"><p className="text-sm text-gray-500">Past Appointments</p><p className="text-2xl font-bold text-gray-800">{pastCount}</p></div>
                </div>

                {/* Search, Filters, and View Toggles */}
                <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border">
                    <div className="flex justify-between items-center mb-4">
                        <div className="relative flex-grow max-w-sm">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" placeholder="Search by donor name or ID..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none"
                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-4">
                            <select value={bloodTypeFilter} onChange={(e) => setBloodTypeFilter(e.target.value)}
                                className="border border-gray-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none">
                                <option value="All">All Blood Types</option>
                                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border rounded-lg shadow-sm hover:bg-gray-50">
                               <DownloadIcon className="w-4 h-4" /> Export
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center border-t pt-4">
                         {/* Main Tabs */}
                        <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-gray-50">
                            <button onClick={() => setActiveTab('pending')} className={`px-4 py-1.5 rounded-md text-sm font-medium ${activeTab === 'pending' ? 'bg-red-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>
                                Pending Requests {appointmentRequests.length > 0 && <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">{appointmentRequests.length}</span>}
                            </button>
                            <button onClick={() => setActiveTab('upcoming')} className={`px-4 py-1.5 rounded-md text-sm font-medium ${activeTab === 'upcoming' ? 'bg-red-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>Upcoming</button>
                            <button onClick={() => setActiveTab('past')} className={`px-4 py-1.5 rounded-md text-sm font-medium ${activeTab === 'past' ? 'bg-red-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>Past</button>
                        </div>
                        {/* View Toggles */}
                        <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-white">
                            <button onClick={() => setView('list')} className={`px-3 py-1 rounded-md text-sm font-medium ${view === 'list' ? 'bg-gray-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                                <ListIcon className="w-5 h-5 inline-block mr-1" /> List
                            </button>
                            <button onClick={() => setView('calendar')} className={`px-3 py-1 rounded-md text-sm font-medium ${view === 'calendar' ? 'bg-gray-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                                <CalendarIcon className="w-5 h-5 inline-block mr-1" /> Calendar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content: Table or Calendar */}
                {view === 'list' ? (
                    activeTab === 'pending' ? (
                        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="border-b bg-gray-50">
                                        <tr className="[&>th]:p-4 [&>th]:text-sm [&>th]:font-semibold [&>th]:text-gray-600">
                                            <th>Donor Name</th><th>Blood Type</th><th>Donation Type</th><th>Preferred Date</th><th>Preferred Time</th><th>Request Date</th><th className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loadingRequests ? (
                                            <tr>
                                                <td colSpan="7" className="p-8 text-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
                                                    <p className="text-gray-500">Loading requests...</p>
                                                </td>
                                            </tr>
                                        ) : appointmentRequests.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="p-8 text-center text-gray-500">No pending appointment requests</td>
                                            </tr>
                                        ) : (
                                            appointmentRequests.map(req => (
                                                <tr key={req._id} className="border-b hover:bg-gray-50">
                                                    <td className="p-4 font-medium text-gray-800">{req.donorId?.name || 'Unknown'}</td>
                                                    <td className="p-4 font-bold text-red-600">{req.bloodType}</td>
                                                    <td className="p-4 capitalize">{req.donationType?.replace('-', ' ') || 'Whole Blood'}</td>
                                                    <td className="p-4">{req.preferredDate ? format(new Date(req.preferredDate), 'dd-MM-yyyy') : 'Not specified'}</td>
                                                    <td className="p-4">{req.preferredTime || 'Not specified'}</td>
                                                    <td className="p-4">{format(new Date(req.createdAt), 'dd-MM-yyyy')}</td>
                                                    <td className="p-4 text-center space-x-2">
                                                        <button onClick={() => { setSelectedRequest(req); setIsApproveModalOpen(true); }} className="p-1 text-green-600 hover:text-green-800" title="Approve"><CheckIcon /></button>
                                                        <button onClick={() => { setSelectedRequest(req); setIsDenyModalOpen(true); }} className="p-1 text-red-600 hover:text-red-800" title="Deny"><XIcon /></button>
                                                        <button onClick={() => handleViewDetails({ donorName: req.donorId?.name, email: req.donorId?.email, phone: req.donorId?.phone, bloodType: req.bloodType })} className="p-1 text-blue-600 hover:text-blue-800" title="View Details"><EyeIcon /></button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                     <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b bg-gray-50">
                                    <tr className="[&>th]:p-4 [&>th]:text-sm [&>th]:font-semibold [&>th]:text-gray-600">
                                        <th>Donor Name</th><th>Date</th><th>Time</th><th>Blood Type</th><th>Donation Type</th><th>Status</th><th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedAppointments.map(appt => (
                                        <tr key={appt.id} className="border-b hover:bg-gray-50">
                                            <td className="p-4 font-medium text-gray-800">{appt.donorName}</td>
                                            <td className="p-4">{format(new Date(appt.date), 'dd-MM-yyyy')}</td>
                                            <td className="p-4">{appt.time}</td>
                                            <td className="p-4 font-bold text-red-600">{appt.bloodType}</td>
                                            <td className="p-4">{appt.donationType}</td>
                                            <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(appt.status)}`}>{appt.status}</span></td>
                                            <td className="p-4 text-center">
                                                <button onClick={() => handleViewDetails(appt)} className="p-1 text-blue-600 hover:text-blue-800" title="View Details"><EyeIcon /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div className="p-4 flex justify-between items-center text-sm">
                            <p>Showing {paginatedAppointments.length} of {filteredAppointments.length} entries</p>
                            <div className="flex gap-1">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-red-500 text-white' : ''}`}>{i + 1}</button>
                                ))}
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
                            </div>
                        </div>
                    </div>
                    )
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-4">
                            <DayPicker
                                mode="single"
                                selected={selectedCalendarDate}
                                onSelect={setSelectedCalendarDate}
                                modifiers={{ highlighted: highlightedDays }}
                                modifiersClassNames={{ highlighted: 'bg-red-100 text-red-800 rounded-full' }}/>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointments for {format(selectedCalendarDate, 'PPP')}</h3>
                            {appointmentsForSelectedDay.length > 0 ? (
                                <ul className="space-y-3">
                                    {appointmentsForSelectedDay.map(appt => (
                                        <li key={appt.id} className="border-l-4 p-3 rounded-r-md bg-gray-50/50 border-red-400">
                                            <div className="font-medium text-gray-800">{appt.donorName} ({appt.bloodType})</div>
                                            <div className="text-sm text-gray-500">{appt.time} - {appt.donationType}</div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-8">No appointments scheduled.</p>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Approve Request Modal */}
            {isApproveModalOpen && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl">
                        <div className="bg-green-600 text-white p-4 rounded-t-lg">
                            <h3 className="text-xl font-semibold">Approve Appointment Request</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 mb-2">Donor: <span className="font-semibold text-gray-800">{selectedRequest.donorId?.name}</span></p>
                                <p className="text-sm text-gray-600 mb-2">Blood Type: <span className="font-bold text-red-600">{selectedRequest.bloodType}</span></p>
                                <p className="text-sm text-gray-600">Preferred Date: {selectedRequest.preferredDate ? format(new Date(selectedRequest.preferredDate), 'dd-MM-yyyy') : 'Not specified'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                                    <input type="date" value={approveFormData.date} onChange={(e) => setApproveFormData({...approveFormData, date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                                    <input type="time" value={approveFormData.time} onChange={(e) => setApproveFormData({...approveFormData, time: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location Name *</label>
                                    <input type="text" value={approveFormData.locationName} onChange={(e) => setApproveFormData({...approveFormData, locationName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none" placeholder="Hospital name" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                    <input type="text" value={approveFormData.locationCity} onChange={(e) => setApproveFormData({...approveFormData, locationCity: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none" required />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Donation Type</label>
                                    <select value={approveFormData.donationType} onChange={(e) => setApproveFormData({...approveFormData, donationType: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none">
                                        <option value="whole-blood">Whole Blood</option>
                                        <option value="platelets">Platelets</option>
                                        <option value="power-red">Power Red</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Response Message (Optional)</label>
                                    <textarea value={approveFormData.hospitalResponse} onChange={(e) => setApproveFormData({...approveFormData, hospitalResponse: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none" rows="3" placeholder="Optional message to donor"></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 p-4 bg-gray-50 rounded-b-lg border-t">
                            <button onClick={() => { setIsApproveModalOpen(false); setSelectedRequest(null); setApproveFormData({ date: '', time: '', donationType: 'whole-blood', locationName: '', locationCity: '', hospitalResponse: '' }); }} className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-semibold hover:bg-gray-300">Cancel</button>
                            <button onClick={handleApproveRequest} disabled={!approveFormData.date || !approveFormData.time || !approveFormData.locationName || !approveFormData.locationCity} className="px-5 py-2 bg-green-600 text-white rounded-md text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">Approve</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Deny Request Modal */}
            {isDenyModalOpen && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
                        <div className="bg-red-600 text-white p-4 rounded-t-lg">
                            <h3 className="text-xl font-semibold">Deny Appointment Request</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-700 mb-4">Are you sure you want to deny the appointment request from <span className="font-semibold">{selectedRequest.donorId?.name}</span>?</p>
                        </div>
                        <div className="flex justify-end gap-4 p-4 bg-gray-50 rounded-b-lg border-t">
                            <button onClick={() => { setIsDenyModalOpen(false); setSelectedRequest(null); }} className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-semibold hover:bg-gray-300">Cancel</button>
                            <button onClick={handleDenyRequest} className="px-5 py-2 bg-red-600 text-white rounded-md text-sm font-semibold hover:bg-red-700">Deny Request</button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal (ENHANCED) */}
            {isModalOpen && selectedAppointment && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl transform transition-all">
                        {/* Modal Header */}
                        <div className="bg-gray-50 p-4 rounded-t-lg border-b">
                            <h3 className="text-xl font-semibold text-gray-800">Appointment Details</h3>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Donor Name</p>
                                    <p className="text-base font-semibold text-gray-900">{selectedAppointment.donorName}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Appointment ID</p>
                                    <p className="text-base text-gray-900">{selectedAppointment.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="text-base text-gray-900">{selectedAppointment.donorEmail}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                    <p className="text-base text-gray-900">{selectedAppointment.donorPhone}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Date & Time</p>
                                    <p className="text-base text-gray-900">{format(new Date(selectedAppointment.date), 'PPP')} at {selectedAppointment.time}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Status</p>
                                    <p><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedAppointment.status)}`}>{selectedAppointment.status}</span></p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Blood Group</p>
                                    <p className="text-lg font-bold text-red-600">{selectedAppointment.bloodType}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Donation Type</p>
                                    <p className="text-base text-gray-900">{selectedAppointment.donationType}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-sm font-medium text-gray-500">Notes</p>
                                    <p className="text-base text-gray-900 bg-gray-50 p-2 rounded-md mt-1">{selectedAppointment.notes || 'None'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-4 p-4 bg-gray-50 rounded-b-lg border-t">
                            <button 
                                onClick={() => setModalOpen(false)} 
                                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-semibold hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}