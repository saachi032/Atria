import { useState } from 'react';

// --- Helper Components for Icons ---

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

// --- Main Profile Component ---

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);

  // Helper function to format date to dd-mm-yyyy
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  const [userData, setUserData] = useState({
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    phone: '+91 98765 43210',
    dob: '1995-08-15', // Stays in yyyy-mm-dd for input compatibility
    gender: 'Male',
    location: 'Navi Mumbai, IN',
    bloodType: 'O+',
    eligibility: 'Eligible to Donate',
    lastDonation: '2025-07-20', // Stays in yyyy-mm-dd
    nextEligible: '2025-10-20', // Stays in yyyy-mm-dd
    totalDonations: 8,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving data:", userData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleGenerateQr = () => {
    setIsGeneratingQr(true);
    // Simulate API call delay
    setTimeout(() => {
        const qrData = encodeURIComponent(JSON.stringify({
            name: userData.name,
            bloodType: userData.bloodType,
            donorId: `DONOR-${userData.phone}`
        }));
        setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`);
        setIsGeneratingQr(false);
    }, 1500);
  };

  const DetailItem = ({ label, value, name, isEditing }) => (
    <div>
      <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
      {isEditing ? (
        <input
          type={name === 'dob' ? 'date' : 'text'}
          name={name}
          value={value} // Input expects yyyy-mm-dd
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 transition"
        />
      ) : (
        <p className="text-lg font-semibold text-gray-800">
            {/* Display formatted date */}
            {name === 'dob' ? formatDate(value) : value}
        </p>
      )}
    </div>
  );

  const StatItem = ({ label, value }) => (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-bold text-red-600">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center transition-all duration-300 hover:shadow-xl">
              <div className="relative w-28 h-28 mx-auto mb-4">
                 <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                    <UserIcon />
                 </div>
                 <div className="absolute bottom-1 right-1 bg-green-500 h-6 w-6 rounded-full border-2 border-white flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                 </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
              <p className="text-gray-500">{userData.email}</p>
              
              <div className="mt-8 bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200">
                <p className="text-sm font-medium text-red-800 mb-1">Blood Group</p>
                <p className="text-4xl font-extrabold text-red-600 flex items-center justify-center">
                  <span className='mr-2'>🩸</span>
                  {userData.bloodType}
                </p>
              </div>
            </div>

             <div className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Donation Stats</h3>
                <div className="space-y-5">
                    <StatItem label="Last Donation" value={formatDate(userData.lastDonation)} />
                    <StatItem label="Next Eligible" value={formatDate(userData.nextEligible)} />
                    <StatItem label="Total Donations" value={`${userData.totalDonations} times`} />
                </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800">Details</h3>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center py-2 px-4 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        <EditIcon/>
                        Edit Profile
                    </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <DetailItem label="Full Name" value={userData.name} name="name" isEditing={isEditing} />
                <DetailItem label="Date of Birth" value={userData.dob} name="dob" isEditing={isEditing} />
                <DetailItem label="Phone Number" value={userData.phone} name="phone" isEditing={isEditing} />
                <DetailItem label="Gender" value={userData.gender} name="gender" isEditing={isEditing} />
                <div className="md:col-span-2">
                    <DetailItem label="Location" value={userData.location} name="location" isEditing={isEditing} />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Eligibility Status</label>
                    <div className="flex items-center text-green-600 font-semibold p-2 bg-green-50 rounded-lg">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {userData.eligibility}
                    </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-8 flex justify-end space-x-4">
                    <button onClick={() => setIsEditing(false)} className="py-2 px-6 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all">Cancel</button>
                    <button onClick={handleSave} className="py-2 px-6 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all shadow-md">Save Changes</button>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-8 rounded-2xl shadow-2xl shadow-red-500/30">
                <h3 className="text-2xl font-bold mb-3">Your Donor ID</h3>
                <p className="text-red-100 mb-6 max-w-md">Present your unique QR code at the donation center for a faster and smoother check-in process.</p>
                
                {qrCodeUrl ? (
                    <div className="bg-white p-4 rounded-lg w-40 h-40 flex items-center justify-center">
                        <img src={qrCodeUrl} alt="Donor ID QR Code" />
                    </div>
                ) : (
                    <button 
                        onClick={handleGenerateQr}
                        disabled={isGeneratingQr}
                        className="py-3 px-6 rounded-xl text-base font-bold text-red-600 bg-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:cursor-wait"
                    >
                        {isGeneratingQr ? 'Generating...' : 'Generate Donor ID QR'}
                    </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

