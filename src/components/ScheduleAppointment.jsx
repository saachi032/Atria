import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// --- Helper Components ---
const FormInput = ({ id, label, type = "text", placeholder, value, onChange, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 transition disabled:bg-gray-100"
      required
      {...props}
    />
  </div>
);

const FormSelect = ({ id, label, children, value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 transition bg-white disabled:bg-gray-100"
      required
    >
      {children}
    </select>
  </div>
);

// --- Main Component ---
export default function ScheduleAppointment() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    location: '',
    donationType: 'whole-blood',
    date: '',
    time: '',
    fullName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    // Pre-fill from stored user if available
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setFormData(prev => ({
        ...prev,
        fullName: u.name || '',
        email: u.email || '',
        phone: u.phone || '',
      }));
    }

    // Auto-fill from notification data (query params)
    const hospitalName = searchParams.get('hospitalName');
    const location = searchParams.get('location');
    const bloodType = searchParams.get('bloodType');
    // Capture organization context from query params
    const orgType = searchParams.get('orgType');
    const orgId = searchParams.get('orgId') || searchParams.get('hospitalId');

    if (location) {
      setFormData(prev => ({
        ...prev,
        location: location,
      }));
    } else if (hospitalName) {
      // Try to match hospital name with available options
      const hospitalOptions = [
        'City Hospital, Navi Mumbai',
        'Central Blood Bank, Mumbai',
        'Mobile Donation Camp, Vashi',
        'Redwood Medical Center, Panvel',
      ];
      // If hospital name matches any option, use it
      const matchedLocation = hospitalOptions.find(opt => opt.toLowerCase().includes(hospitalName.toLowerCase()));
      if (matchedLocation) {
        setFormData(prev => ({
          ...prev,
          location: matchedLocation,
        }));
      } else {
        // If no match, use the hospital name with a generic city
        setFormData(prev => ({
          ...prev,
          location: `${hospitalName}, City`,
        }));
      }
    }
  }, [searchParams]);

  const [lastDonationInput, setLastDonationInput] = useState('');
  const [eligibility, setEligibility] = useState({
    checked: false,
    isEligible: false,
    message: '',
    minDate: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEligibilityCheck = () => {
    if (!lastDonationInput) {
      alert("Please enter your last donation date.");
      return;
    }
    const lastDonationDate = new Date(lastDonationInput);
    const waitPeriodDays = 56;
    const nextEligibleDate = new Date(lastDonationDate);
    nextEligibleDate.setDate(lastDonationDate.getDate() + waitPeriodDays);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const formattedNextDate = nextEligibleDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const formattedLastDate = lastDonationDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const minDateForInput = nextEligibleDate.toISOString().split('T')[0];
    if (today >= nextEligibleDate) {
      setEligibility({ checked: true, isEligible: true, message: `You are eligible to donate. Your last donation was on ${formattedLastDate}.`, minDate: minDateForInput });
    } else {
      setEligibility({ checked: true, isEligible: false, message: `You are not eligible yet. Your next eligible donation date is after ${formattedNextDate}.`, minDate: minDateForInput });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!eligibility.isEligible) { alert("Please confirm your eligibility before submitting."); return; }
    const preferredDate = new Date(formData.date);
    const eligibleDate = new Date(eligibility.minDate);
    if (preferredDate < eligibleDate) { alert(`Your selected date is before your eligible donation date. Please choose a later date.`); return; }

    // Map location into name/city
    let locationName = '', locationCity = '';
    if (formData.location) {
      const parts = formData.location.split(',');
      locationName = (parts[0] || '').trim();
      locationCity = (parts.slice(1).join(',') || '').trim();
    }

    const token = localStorage.getItem('token');
    if (!token) { setError('You must be logged in.'); return; }

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          locationName,
          locationCity,
          donationType: formData.donationType,
          date: formData.date,
          time: formData.time,
          // Pass through organization linkage for hospital/blood bank dashboards
          hospitalId: (searchParams.get('orgType') === 'hospital' ? (searchParams.get('orgId') || searchParams.get('hospitalId')) : ''),
          bloodBankId: (searchParams.get('orgType') === 'bloodbank' ? (searchParams.get('orgId') || '') : ''),
        })
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.msg || 'Failed to create appointment');
        return;
      }
      setIsSubmitted(true);
    } catch (err) {
      setError('Server error');
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center text-center pt-20 px-4">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-2xl">
          <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h1 className="text-3xl font-bold text-gray-800 mt-6">Appointment Scheduled!</h1>
          <p className="text-gray-600 mt-3">
            Thank you, {formData.fullName}. Your appointment at <span className="font-semibold">{formData.location}</span> on <span className="font-semibold">{formatDateForDisplay(formData.date)}</span> at <span className="font-semibold">{formData.time}</span> has been successfully booked.
          </p>
          <p className="text-sm text-gray-500 mt-4">A confirmation will be sent to your email ({formData.email}) and phone number. We look forward to seeing you.</p>
          <button onClick={() => window.location.reload()} className="mt-8 px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition">Schedule Another Appointment</button>
        </div>
      </div>
    );
  }

  // Get notification data from URL params
  const hospitalName = searchParams.get('hospitalName');
  const bloodType = searchParams.get('bloodType');
  const urgency = searchParams.get('urgency');
  const unitsNeeded = searchParams.get('unitsNeeded');
  const message = searchParams.get('message');
  const notificationId = searchParams.get('notificationId');

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="text-center mb-10 px-4">
        <h1 className="text-4xl font-extrabold text-gray-800">Schedule a Donation</h1>
        <p className="text-gray-500 mt-2 max-w-2xl mx-auto">Your decision to donate can save a life. Please fill out the form below to book your slot.</p>
        {hospitalName && (
          <div className="mt-4 max-w-2xl mx-auto bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg text-left">
            <p className="text-sm font-semibold text-blue-800 mb-2">📋 Donation Request from {hospitalName}</p>
            {bloodType && (
              <p className="text-sm text-blue-700">Blood Type Needed: <span className="font-bold text-red-600">{bloodType}</span></p>
            )}
            {urgency && (
              <p className="text-sm text-blue-700">Urgency: <span className="font-semibold">{urgency}</span></p>
            )}
            {unitsNeeded && (
              <p className="text-sm text-blue-700">Units Needed: <span className="font-semibold">{unitsNeeded}</span></p>
            )}
            {message && (
              <p className="text-sm text-blue-700 mt-2">{message}</p>
            )}
          </div>
        )}
      </div>
      <div className="w-full bg-white shadow-md">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
          {error && <div className="mb-4 bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="md:col-span-2"><h2 className="text-xl font-bold text-gray-700 border-b pb-2 mb-4">Your Information</h2></div>
            <FormInput id="fullName" label="Full Name" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} />
            <FormInput id="email" label="Email Address" type="email" placeholder="Your email address" value={formData.email} onChange={handleChange} />
            <FormInput id="phone" label="Phone Number" placeholder="Your contact number" value={formData.phone} onChange={handleChange} />
            <div className="md:col-span-2 mt-4">
              <h2 className="text-xl font-bold text-gray-700 border-b pb-2 mb-4">Step 1: Check Eligibility</h2>
              <div className="bg-gray-50 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-end gap-4">
                <div className="w-full sm:w-auto flex-grow">
                  <label htmlFor="lastDonation" className="block text-sm font-medium text-gray-700 mb-2">Enter your last donation date</label>
                  <input type="date" id="lastDonation" value={lastDonationInput} onChange={(e) => setLastDonationInput(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 transition"/>
                </div>
                <button type="button" onClick={handleEligibilityCheck} className="flex-shrink-0 w-full sm:w-auto px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">Check Eligibility</button>
              </div>
              {eligibility.checked && (<div className={`mt-4 p-3 rounded-md text-sm font-medium ${eligibility.isEligible ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{eligibility.message}</div>)}
            </div>
            <fieldset disabled={!eligibility.isEligible} className="md:col-span-2 mt-4 contents">
              <div className="md:col-span-2"><h2 className={`text-xl font-bold border-b pb-2 mb-4 ${!eligibility.isEligible ? 'text-gray-400' : 'text-gray-700'}`}>Step 2: Appointment Details</h2></div>
              <FormSelect id="location" label="Donation Center" value={formData.location} onChange={handleChange}>
                <option value="" disabled>Select a location</option>
                <option value="City Hospital, Navi Mumbai">City Hospital, Navi Mumbai</option>
                <option value="Central Blood Bank, Mumbai">Central Blood Bank, Mumbai</option>
                <option value="Mobile Donation Camp, Vashi">Mobile Donation Camp, Vashi</option>
                <option value="Redwood Medical Center, Panvel">Redwood Medical Center, Panvel</option>
              </FormSelect>
              <FormSelect id="donationType" label="Donation Type" value={formData.donationType} onChange={handleChange}>
                <option value="whole-blood">Whole Blood</option>
                <option value="platelets">Platelets</option>
                <option value="power-red">Power Red (Double Red Cell)</option>
              </FormSelect>
              <FormInput id="date" label="Preferred Date" type="date" value={formData.date} onChange={handleChange} min={eligibility.minDate} />
              <FormSelect id="time" label="Available Time Slot" value={formData.time} onChange={handleChange}>
                <option value="" disabled>Select a time</option>
                <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
              </FormSelect>
              <div className="md:col-span-2 text-center mt-6">
                <button type="submit" className="w-full md:w-auto inline-flex items-center justify-center px-12 py-4 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:-translate-y-1 disabled:bg-red-300 disabled:cursor-not-allowed disabled:transform-none">Confirm Appointment</button>
              </div>
            </fieldset>
          </div>
        </form>
      </div>
    </div>
  );
}