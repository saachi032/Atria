import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  return dateString;
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  return '';
};

const UrgencyBadge = ({ urgency }) => {
  const colors = {
    Critical: 'bg-red-600 text-white',
    High: 'bg-orange-500 text-white',
    Medium: 'bg-yellow-500 text-white',
    Low: 'bg-green-500 text-white',
  };
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${colors[urgency] || colors.Medium}`}>
      {urgency}
    </span>
  );
};

const RequestDetailModal = ({ request, hospitalDetails, bloodBankDetails, notification, onClose, onScheduleDonation }) => {
  if (!request) return null;
  
  const orgDetails = hospitalDetails || bloodBankDetails;
  const orgName = hospitalDetails ? 'Hospital' : 'Blood Bank';
  
  const handleScheduleDonation = () => {
    if (notification && onScheduleDonation) {
      onScheduleDonation(notification);
    }
    onClose();
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 text-white p-6 flex justify-between items-center">
          <h3 className="text-2xl font-bold">Request Details</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Hospital/Blood Bank Name Display */}
          {orgDetails && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-600">
              <h4 className="font-bold text-gray-800 mb-2">{orgName} Name</h4>
              <p className="text-lg font-semibold text-blue-700">{orgDetails.name}</p>
            </div>
          )}

          <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-600">
            <h4 className="font-bold text-gray-800 mb-3">Patient Information</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Patient Name</span>
                <div className="mt-1 text-sm font-semibold text-gray-800">{request.patientName}</div>
              </div>
              {request.patientId && (
                <div>
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Patient ID</span>
                  <div className="mt-1 text-sm font-semibold text-gray-800">{request.patientId}</div>
                </div>
              )}
              <div>
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Blood Type</span>
                <div className="mt-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-600 text-white font-semibold text-sm">
                    {request.bloodType}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Units Needed</span>
                <div className="mt-1 text-sm font-semibold text-gray-800">{request.units} unit(s)</div>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Urgency</span>
                <div className="mt-1"><UrgencyBadge urgency={request.urgency} /></div>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Status</span>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                    request.status === 'Fulfilled' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
              </div>
              {request.reason && (
                <div className="col-span-2">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Reason</span>
                  <div className="mt-1 text-sm font-semibold text-gray-800">{request.reason}</div>
                </div>
              )}
              {request.doctorName && (
                <div>
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Doctor Name</span>
                  <div className="mt-1 text-sm font-semibold text-gray-800">{request.doctorName}</div>
                </div>
              )}
            </div>
          </div>

          {orgDetails && (
            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
              <h4 className="font-bold text-gray-800 mb-3">{orgName} Information</h4>
              <div className="grid grid-cols-2 gap-3">
                {orgDetails.address && (
                  <div className="col-span-2">
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Address</span>
                    <div className="mt-1 text-sm font-semibold text-gray-800">{orgDetails.address}</div>
                  </div>
                )}
                {orgDetails.city && (
                  <div>
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">City</span>
                    <div className="mt-1 text-sm font-semibold text-gray-800">{orgDetails.city}</div>
                  </div>
                )}
                {orgDetails.state && (
                  <div>
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">State</span>
                    <div className="mt-1 text-sm font-semibold text-gray-800">{orgDetails.state}</div>
                  </div>
                )}
                {orgDetails.contactNumber && (
                  <div>
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Contact</span>
                    <div className="mt-1 text-sm font-semibold text-gray-800">{orgDetails.contactNumber}</div>
                  </div>
                )}
                {orgDetails.email && (
                  <div>
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Email</span>
                    <div className="mt-1 text-sm font-semibold text-gray-800">{orgDetails.email}</div>
                  </div>
                )}
                {orgDetails.pocName && (
                  <div>
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Point of Contact</span>
                    <div className="mt-1 text-sm font-semibold text-gray-800">{orgDetails.pocName}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={handleScheduleDonation}
              className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Schedule Donation
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('All');
  const [requestDetails, setRequestDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [organizationDetails, setOrganizationDetails] = useState(null);
  const [loadingOrgDetails, setLoadingOrgDetails] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [selectedUrgency]);

  const loadNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to view notifications.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const url = selectedUrgency === 'All' 
        ? '/api/notifications'
        : `/api/notifications?urgency=${selectedUrgency}`;
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError('Your session has expired. Please log in again.');
        } else {
          setError('Failed to load notifications');
        }
        setNotifications([]);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setError('');
      } else {
        setError(data.msg || 'Failed to load notifications');
        setNotifications([]);
      }
    } catch (e) {
      console.error('Error loading notifications:', e);
      setError('Network error while loading notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setNotifications(prev => prev.map(n => 
          n._id === notificationId ? { ...n, isRead: true } : n
        ));
      }
    } catch (e) {
      console.error('Error marking notification as read:', e);
    }
  };

  const scheduleDonation = (notification) => {
    // Build org context
    const isHospital = !!notification.hospitalId;
    const orgId = notification.hospitalId || notification.bloodBankId || '';
    const orgType = isHospital ? 'hospital' : 'bloodbank';
    const orgName = notification.hospitalName || notification.bloodBankName || '';

    // Redirect to schedule appointment page with notification and org data
    const params = new URLSearchParams({
      // Back-compat fields
      hospitalName: orgName,
      hospitalId: orgId,
      // New explicit fields
      orgType,
      orgId,
      orgName,
      bloodType: notification.bloodType || '',
      notificationId: notification._id || '',
      message: notification.message || '',
      unitsNeeded: notification.unitsNeeded || '',
      urgency: notification.urgency || '',
    });

    navigate(`/schedule-appointment?${params.toString()}`);
  };

  const viewRequest = async (notification) => {
    // Check if it's a donor alert (no requestId) or a request (has requestId)
    const requestId = notification.requestId?._id || notification.requestId;
    
    if (!requestId) {
      // This is a donor alert - create appointment request
      scheduleDonation(notification);
      return;
    }

    // This is a request - load details
    setLoadingDetails(true);
    setSelectedNotification(notification);
    
    const token = localStorage.getItem('token');
    if (!token) {
      setLoadingDetails(false);
      return;
    }

    try {
      const res = await fetch(`/api/notifications/request/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setRequestDetails({
          request: data.request,
          hospitalDetails: data.hospitalDetails,
          bloodBankDetails: data.bloodBankDetails,
        });
      } else {
        alert('Failed to load request details');
      }
    } catch (e) {
      console.error('Error loading request details:', e);
      alert('Error loading request details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setSelectedNotification(null);
    setRequestDetails(null);
    // Mark notification as read when viewing
    if (selectedNotification && !selectedNotification.isRead) {
      markAsRead(selectedNotification._id);
    }
  };

  // Extract unique organizations from notifications
  const getUniqueOrganizations = () => {
    const orgs = new Map();
    
    notifications.forEach(notification => {
      if (notification.hospitalId && notification.hospitalName) {
        const hospitalId = String(notification.hospitalId);
        const key = `hospital-${hospitalId}`;
        if (!orgs.has(key)) {
          orgs.set(key, {
            id: hospitalId,
            name: notification.hospitalName,
            type: 'hospital',
            displayName: `${notification.hospitalName} (Hospital)`
          });
        }
      }
      if (notification.bloodBankId && notification.bloodBankName) {
        const bloodBankId = String(notification.bloodBankId);
        const key = `bloodbank-${bloodBankId}`;
        if (!orgs.has(key)) {
          orgs.set(key, {
            id: bloodBankId,
            name: notification.bloodBankName,
            type: 'bloodbank',
            displayName: `${notification.bloodBankName} (Blood Bank)`
          });
        }
      }
    });
    
    return Array.from(orgs.values());
  };

  const fetchOrganizationDetails = async (orgId, orgType) => {
    if (!orgId || !orgType) {
      setOrganizationDetails(null);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    setLoadingOrgDetails(true);
    try {
      const res = await fetch(`/api/notifications/organization/${orgId}/${orgType}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setOrganizationDetails(data.organization);
      } else {
        setOrganizationDetails(null);
        console.error('Failed to load organization details');
      }
    } catch (e) {
      console.error('Error loading organization details:', e);
      setOrganizationDetails(null);
    } finally {
      setLoadingOrgDetails(false);
    }
  };

  const handleOrganizationChange = (e) => {
    const value = e.target.value;
    setSelectedOrganization(value);
    
    if (value === '') {
      setOrganizationDetails(null);
    } else {
      const [orgType, orgId] = value.split('-');
      fetchOrganizationDetails(orgId, orgType);
    }
  };

  // Filter notifications by selected organization
  const getFilteredNotifications = () => {
    if (!selectedOrganization) {
      return notifications;
    }
    
    const [orgType, orgId] = selectedOrganization.split('-');
    return notifications.filter(notification => {
      if (orgType === 'hospital') {
        return String(notification.hospitalId) === String(orgId);
      } else if (orgType === 'bloodbank') {
        return String(notification.bloodBankId) === String(orgId);
      }
      return true;
    });
  };

  const urgencyOptions = ['All', 'Critical', 'High', 'Medium', 'Low'];
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const uniqueOrganizations = getUniqueOrganizations();
  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-50 pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 mb-3">
            Notifications
          </h1>
          <p className="text-gray-600 text-lg">
            Blood requests and alerts matching your blood type
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 font-semibold text-sm">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-6">
          {/* Urgency Filter */}
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">Filter by Urgency:</span>
              {urgencyOptions.map((urgency) => (
                <button
                  key={urgency}
                  onClick={() => {
                    setSelectedUrgency(urgency);
                    setLoading(true);
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    selectedUrgency === urgency
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {urgency}
                </button>
              ))}
            </div>
          </div>

          {/* Organization Filter Dropdown */}
          {uniqueOrganizations.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <label htmlFor="organization-select" className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                  Filter by Organization:
                </label>
                <select
                  id="organization-select"
                  value={selectedOrganization}
                  onChange={handleOrganizationChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none text-sm font-medium"
                >
                  <option value="">All Organizations</option>
                  {uniqueOrganizations.map((org) => (
                    <option key={`${org.type}-${org.id}`} value={`${org.type}-${org.id}`}>
                      {org.displayName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Organization Details Card */}
          {selectedOrganization && organizationDetails && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {organizationDetails.type} Information
                </h3>
                <button
                  onClick={() => {
                    setSelectedOrganization('');
                    setOrganizationDetails(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {loadingOrgDetails ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading details...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Organization Name</span>
                    <div className="mt-1 text-lg font-semibold text-blue-700">{organizationDetails.name}</div>
                  </div>
                  
                  {organizationDetails.address && (
                    <div className="col-span-2">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Address</span>
                      <div className="mt-1 text-sm font-semibold text-gray-800">{organizationDetails.address}</div>
                    </div>
                  )}
                  
                  {organizationDetails.city && (
                    <div>
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">City</span>
                      <div className="mt-1 text-sm font-semibold text-gray-800">{organizationDetails.city}</div>
                    </div>
                  )}
                  
                  {organizationDetails.state && (
                    <div>
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">State</span>
                      <div className="mt-1 text-sm font-semibold text-gray-800">{organizationDetails.state}</div>
                    </div>
                  )}
                  
                  {organizationDetails.district && (
                    <div>
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">District</span>
                      <div className="mt-1 text-sm font-semibold text-gray-800">{organizationDetails.district}</div>
                    </div>
                  )}
                  
                  {organizationDetails.pincode && (
                    <div>
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Pincode</span>
                      <div className="mt-1 text-sm font-semibold text-gray-800">{organizationDetails.pincode}</div>
                    </div>
                  )}
                  
                  {organizationDetails.contactNumber && (
                    <div>
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Contact Number</span>
                      <div className="mt-1 text-sm font-semibold text-gray-800">{organizationDetails.contactNumber}</div>
                    </div>
                  )}
                  
                  {organizationDetails.email && (
                    <div>
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Email</span>
                      <div className="mt-1 text-sm font-semibold text-gray-800">{organizationDetails.email}</div>
                    </div>
                  )}
                  
                  {organizationDetails.pocName && (
                    <div>
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Point of Contact</span>
                      <div className="mt-1 text-sm font-semibold text-gray-800">{organizationDetails.pocName}</div>
                    </div>
                  )}
                  
                  {organizationDetails.pocDesignation && (
                    <div>
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">POC Designation</span>
                      <div className="mt-1 text-sm font-semibold text-gray-800">{organizationDetails.pocDesignation}</div>
                    </div>
                  )}
                  
                  {organizationDetails.pocMobile && (
                    <div>
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">POC Mobile</span>
                      <div className="mt-1 text-sm font-semibold text-gray-800">{organizationDetails.pocMobile}</div>
                    </div>
                  )}
                  
                  {organizationDetails.pocEmail && (
                    <div>
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">POC Email</span>
                      <div className="mt-1 text-sm font-semibold text-gray-800">{organizationDetails.pocEmail}</div>
                    </div>
                  )}
                  
                  {organizationDetails.hospitalType && (
                    <div>
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Hospital Type</span>
                      <div className="mt-1 text-sm font-semibold text-gray-800">{organizationDetails.hospitalType}</div>
                    </div>
                  )}
                  
                  {organizationDetails.licenseNumber && (
                    <div>
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">License Number</span>
                      <div className="mt-1 text-sm font-semibold text-gray-800">{organizationDetails.licenseNumber}</div>
                    </div>
                  )}
                  
                  {organizationDetails.website && (
                    <div className="col-span-2">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Website</span>
                      <div className="mt-1 text-sm font-semibold text-gray-800">
                        <a href={organizationDetails.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {organizationDetails.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-16 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-16 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p className="text-gray-500 font-medium">No notifications found.</p>
              <p className="text-gray-400 text-sm mt-2">You will receive notifications when hospitals or blood banks create requests or alerts matching your blood type.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => {
                const requestId = notification.requestId?._id || notification.requestId;
                const isRequest = !!requestId;
                const isAlert = !requestId;
                
                return (
                  <div
                    key={notification._id}
                    className={`p-6 hover:bg-gray-50 transition-all ${
                      !notification.isRead 
                        ? notification.urgency === 'Critical' || notification.urgency === 'High'
                          ? 'bg-red-100 border-l-4 border-red-700' 
                          : 'bg-red-50/50 border-l-4 border-red-600'
                        : notification.urgency === 'Critical' || notification.urgency === 'High'
                          ? 'bg-orange-50 border-l-4 border-orange-500'
                          : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-lg font-bold text-gray-800">{notification.title}</h3>
                          <UrgencyBadge urgency={notification.urgency} />
                          {isAlert && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                              Alert
                            </span>
                          )}
                          {isRequest && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                              Request
                            </span>
                          )}
                          {!notification.isRead && (
                            <span className="inline-flex items-center justify-center w-2 h-2 bg-red-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{notification.message}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                          <span className="font-medium">From: <span className="font-normal">{notification.hospitalName || notification.bloodBankName || 'Unknown'}</span></span>
                          <span>•</span>
                          <span className="font-medium">Units needed: <span className="font-normal">{notification.unitsNeeded}</span></span>
                          <span>•</span>
                          <span className="font-medium">Blood Type: <span className="font-bold text-red-600">{notification.bloodType}</span></span>
                          <span>•</span>
                          <span>{formatDateToDDMMYYYY(notification.createdAt)} {formatTime(notification.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => viewRequest(notification)}
                          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-sm whitespace-nowrap"
                        >
                          {loadingDetails ? 'Loading...' : (isRequest ? 'View Request' : 'Schedule Donation')}
                        </button>
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors text-sm whitespace-nowrap"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Request Detail Modal */}
      {requestDetails && (
        <RequestDetailModal
          request={requestDetails.request}
          hospitalDetails={requestDetails.hospitalDetails}
          bloodBankDetails={requestDetails.bloodBankDetails}
          notification={selectedNotification}
          onClose={closeModal}
          onScheduleDonation={scheduleDonation}
        />
      )}
    </div>
  );
}
