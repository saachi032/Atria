import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// --- Modal Component ---
// (No changes to the modal, so it's included for completeness)
const DonationDetailModal = ({ donation, onClose }) => {
  if (!donation) return null;
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md m-4 p-6 md:p-8 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">Donation Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-5 mt-6">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-500">Status</span>
            <span className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
              {donation.status}
            </span>
          </div>
          <div className="border-t border-gray-200"></div>
          <DetailRow label="Location" value={`${donation.locationName}, ${donation.locationCity}`} />
          <DetailRow label="Date & Time" value={`${donation.date} at ${donation.time}`} />
          <DetailRow label="Donation ID" value={donation.donationId} isMono={true} />
          <DetailRow label="Donation Type" value={donation.donationType} />
          <DetailRow label="Unit ID" value={donation.unitId} isMono={true} />
        </div>
        
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, isMono = false }) => (
  <div className="flex flex-col">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <span className={`text-lg font-semibold text-gray-800 ${isMono ? 'font-mono' : ''}`}>{value}</span>
  </div>
);


export default function DonationHistory() {
  // --- STATE AND DATA ---
  const [activeTab, setActiveTab] = useState('history'); // 'history' or 'appointments'

  // --- Placeholder Data ---
  const history = [
    // (Previous history data remains unchanged)
    { id: 1, date: 'Oct 15, 2023', time: '10:30 AM', locationName: 'City General Hospital', locationCity: 'New York, NY', donationId: '#ATRIA-84620', status: 'Completed', donationType: 'Whole Blood', unitId: 'UBD-4582A' },
    { id: 2, date: 'Jun 02, 2023', time: '02:15 PM', locationName: 'Community Blood Drive', locationCity: 'San Francisco, CA', donationId: '#ATRIA-79135', status: 'Completed', donationType: 'Platelets', unitId: 'PLT-3912B' },
    { id: 3, date: 'Feb 20, 2023', time: '11:00 AM', locationName: 'Redwood Medical Center', locationCity: 'Los Angeles, CA', donationId: '#ATRIA-71298', status: 'Completed', donationType: 'Whole Blood', unitId: 'UBD-3109C' },
    { id: 4, date: 'Nov 11, 2022', time: '09:45 AM', locationName: 'Downtown Donation Center', locationCity: 'Chicago, IL', donationId: '#ATRIA-65441', status: 'Completed', donationType: 'Power Red', unitId: 'PRD-1154D' },
  ];
  
  // New data for upcoming appointments
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState('');

  // State for pagination, search, and modal
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const itemsPerPage = 4;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAppointmentsError('Please log in to view your appointments.');
      setLoadingAppointments(false);
      return;
    }
    const load = async () => {
      try {
        const res = await fetch('/api/appointments/upcoming', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (res.status === 401) {
            setAppointmentsError('Your session has expired. Please log in again.');
          } else {
            const text = await res.text();
            setAppointmentsError(text || 'Failed to load appointments');
          }
          setUpcomingAppointments([]);
          return;
        }
        const data = await res.json().catch(() => null);
        if (!data || data.success !== true) {
          setAppointmentsError((data && data.msg) || 'Failed to load appointments');
          setUpcomingAppointments([]);
        } else {
          setUpcomingAppointments(data.appointments || []);
          setAppointmentsError('');
        }
      } catch (e) {
        setAppointmentsError('Network error while loading appointments');
        setUpcomingAppointments([]);
      } finally {
        setLoadingAppointments(false);
      }
    };
    load();
  }, []);

  // Search and Filtering Logic
  const filteredHistory = history.filter(donation => {
    const location = `${donation.locationName} ${donation.locationCity}`.toLowerCase();
    return location.includes(searchQuery.toLowerCase());
  });

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Modal Logic
  const handleViewDetails = (donation) => setSelectedDonation(donation);
  const handleCloseModal = () => setSelectedDonation(null);

  // --- SVG Icons ---
  const SearchIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
  const CheckCircleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>);
  const CalendarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>)
  const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>);

  const handleCancelAppointment = async (id) => {
    alert(`Appointment ID: ${id} cancellation request sent.`);
  };


  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-28 pb-16">
        <div className="text-center mb-10 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-gray-800">Your Donations</h1>
        </div>

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* --- TABS --- */}
            <div className="mb-6 border-b border-gray-200">
                <div className="flex space-x-4">
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === 'history' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-red-600'}`}
                    >
                        History
                    </button>
                    <button
                        onClick={() => setActiveTab('appointments')}
                        className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === 'appointments' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-red-600'}`}
                    >
                        Upcoming Appointments
                    </button>
                </div>
            </div>

            {/* --- TAB CONTENT --- */}
            {activeTab === 'history' && (
              <div className="bg-white shadow-md rounded-lg">
                <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">Completed Donations</h2>
                      </div>
                      <div className="relative w-full md:w-72">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></span>
                        <input type="text" placeholder="Search by location..." value={searchQuery} onChange={handleSearchChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"/>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Donation ID</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.length > 0 ? (
                            currentItems.map((donation) => (
                              <tr key={donation.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  <div>{donation.date}</div>
                                  <div className="text-xs text-gray-500">{donation.time}</div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                  <div>{donation.locationName}</div>
                                  <div className="text-xs text-gray-500">{donation.locationCity}</div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{donation.donationId}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <span className="inline-flex items-center px-3 py-1 text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800"><CheckCircleIcon />{donation.status}</span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold">
                                  <button onClick={() => handleViewDetails(donation)} className="text-red-600 hover:text-red-800 transition-colors">View Details</button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">No donations found.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {totalPages > 1 && (
                      <div className="flex justify-between items-center mt-6">
                         {/* Pagination controls */}
                      </div>
                    )}
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="bg-white shadow-md rounded-lg">
                <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Scheduled Appointments</h2>
                  {appointmentsError && <div className="mb-4 bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded">{appointmentsError}</div>}
                  <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date & Time</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Donation Type</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {!loadingAppointments && upcomingAppointments.length > 0 ? (
                            upcomingAppointments.map((appt) => (
                              <tr key={appt._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <div>{appt.date}</div>
                                    <div className="text-xs text-gray-500">{appt.time}</div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div>{appt.locationName}</div>
                                    <div className="text-xs text-gray-500">{appt.locationCity}</div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{appt.donationType}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-3 py-1 text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"><CalendarIcon />{appt.status}</span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold">
                                    <button onClick={() => handleCancelAppointment(appt._id)} className="text-gray-500 hover:text-red-600 transition-colors">Cancel</button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">{loadingAppointments ? 'Loading...' : 'You have no upcoming appointments.'}</td></tr>
                          )}
                        </tbody>
                      </table>
                  </div>
                </div>
              </div>
            )}
        </div>
        
        <div className="text-center mt-12 px-4 sm:px-6 lg:px-8">
          <Link 
            to="/schedule-appointment"
            className="inline-flex items-center justify-center px-8 py-4 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:-translate-y-1"
          >
            <PlusIcon />
            Schedule New Donation
          </Link>
        </div>
      </div>

      <DonationDetailModal donation={selectedDonation} onClose={handleCloseModal} />
    </>
  );
}