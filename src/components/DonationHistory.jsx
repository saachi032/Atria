import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// --- Helper function to format date to dd-mm-yyyy ---
const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString) return '';
  // Handle different date formats
  // If it's already in yyyy-mm-dd format
  if (dateString.includes('-') && dateString.split('-')[0].length === 4) {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  }
  // If it's in format like "Oct 15, 2023"
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  return dateString;
};

// --- Modal Component ---
const DonationDetailModal = ({ donation, onClose }) => {
  if (!donation) return null;
  const formattedDate = formatDateToDDMMYYYY(donation.date);
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
          <DetailRow label="Date & Time" value={`${formattedDate} at ${donation.time}`} />
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

  // --- Placeholder Data (formatted dates) ---
  const history = [
    { id: 1, date: '15-10-2023', time: '10:30 AM', locationName: 'City General Hospital', locationCity: 'New York, NY', donationId: '#ATRIA-84620', status: 'Completed', donationType: 'Whole Blood', unitId: 'UBD-4582A' },
    { id: 2, date: '02-06-2023', time: '02:15 PM', locationName: 'Community Blood Drive', locationCity: 'San Francisco, CA', donationId: '#ATRIA-79135', status: 'Completed', donationType: 'Platelets', unitId: 'PLT-3912B' },
    { id: 3, date: '20-02-2023', time: '11:00 AM', locationName: 'Redwood Medical Center', locationCity: 'Los Angeles, CA', donationId: '#ATRIA-71298', status: 'Completed', donationType: 'Whole Blood', unitId: 'UBD-3109C' },
    { id: 4, date: '11-11-2022', time: '09:45 AM', locationName: 'Downtown Donation Center', locationCity: 'Chicago, IL', donationId: '#ATRIA-65441', status: 'Completed', donationType: 'Power Red', unitId: 'PRD-1154D' },
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
          // Format dates to dd-mm-yyyy
          const formattedAppointments = (data.appointments || []).map(appt => ({
            ...appt,
            date: formatDateToDDMMYYYY(appt.date)
          }));
          setUpcomingAppointments(formattedAppointments);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-50 pt-28 pb-16">
        <div className="text-center mb-10 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 mb-3">Your Donations</h1>
          <p className="text-gray-600 text-lg">Track your donation history and manage upcoming appointments</p>
        </div>

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* --- TABS --- */}
            <div className="mb-8 bg-white rounded-t-xl shadow-lg border-b-2 border-gray-100">
                <div className="flex space-x-1 px-2 pt-2">
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-3 text-sm font-semibold rounded-t-lg transition-all duration-300 ${
                          activeTab === 'history' 
                            ? 'border-b-3 border-red-600 text-red-600 bg-red-50/50 shadow-sm' 
                            : 'text-gray-500 hover:text-red-600 hover:bg-gray-50'
                        }`}
                    >
                        Donation History
                    </button>
                    <button
                        onClick={() => setActiveTab('appointments')}
                        className={`px-6 py-3 text-sm font-semibold rounded-t-lg transition-all duration-300 ${
                          activeTab === 'appointments' 
                            ? 'border-b-3 border-red-600 text-red-600 bg-red-50/50 shadow-sm' 
                            : 'text-gray-500 hover:text-red-600 hover:bg-gray-50'
                        }`}
                    >
                        Upcoming Appointments
                    </button>
                </div>
            </div>

            {/* --- TAB CONTENT --- */}
            {activeTab === 'history' && (
              <div className="bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-8 bg-gradient-to-r from-red-50/50 to-transparent">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Completed Donations</h2>
                        <p className="text-sm text-gray-600">View your past donation records</p>
                      </div>
                      <div className="relative w-full md:w-80">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></span>
                        <input 
                          type="text" 
                          placeholder="Search by location..." 
                          value={searchQuery} 
                          onChange={handleSearchChange} 
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date & Time</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Donation ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {currentItems.length > 0 ? (
                            currentItems.map((donation) => (
                              <tr key={donation.id} className="hover:bg-red-50/30 transition-all duration-200 group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-semibold text-gray-900">{donation.date}</div>
                                  <div className="text-xs text-gray-500 mt-1">{donation.time}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm font-medium text-gray-900">{donation.locationName}</div>
                                  <div className="text-xs text-gray-500">{donation.locationCity}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">{donation.donationId}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full bg-green-100 text-green-800 shadow-sm">
                                    <CheckCircleIcon />{donation.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                                  <button 
                                    onClick={() => handleViewDetails(donation)} 
                                    className="text-red-600 hover:text-red-800 transition-colors font-medium hover:underline"
                                  >
                                    View Details
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="px-6 py-16 text-center">
                                <div className="flex flex-col items-center">
                                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <p className="text-gray-500 font-medium">No donations found.</p>
                                </div>
                              </td>
                            </tr>
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
              <div className="bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-8 bg-gradient-to-r from-blue-50/50 to-transparent">
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Scheduled Appointments</h2>
                    <p className="text-sm text-gray-600">Manage your upcoming donation appointments</p>
                  </div>
                  {appointmentsError && (
                    <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg shadow-sm">
                      <div className="flex">
                        <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{appointmentsError}</span>
                      </div>
                    </div>
                  )}
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-blue-50 to-gray-100">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date & Time</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Donation Type</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {!loadingAppointments && upcomingAppointments.length > 0 ? (
                            upcomingAppointments.map((appt) => (
                              <tr key={appt._id} className="hover:bg-blue-50/30 transition-all duration-200 group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-gray-900">{appt.date}</div>
                                    <div className="text-xs text-gray-500 mt-1">{appt.time}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{appt.locationName}</div>
                                    <div className="text-xs text-gray-500">{appt.locationCity}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm text-gray-700 bg-purple-100 px-3 py-1 rounded-full font-medium">
                                    {appt.donationType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 shadow-sm">
                                      <CalendarIcon />{appt.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                                    <button 
                                      onClick={() => handleCancelAppointment(appt._id)} 
                                      className="text-red-500 hover:text-red-700 transition-colors font-medium hover:underline"
                                    >
                                      Cancel
                                    </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="px-6 py-16 text-center">
                                <div className="flex flex-col items-center">
                                  {loadingAppointments ? (
                                    <>
                                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
                                      <p className="text-gray-500 font-medium">Loading appointments...</p>
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      <p className="text-gray-500 font-medium">You have no upcoming appointments.</p>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
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
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
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