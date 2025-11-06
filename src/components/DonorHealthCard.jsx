import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function DonorHealthCard() {
  const { donorId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [donorData, setDonorData] = useState(null);

  useEffect(() => {
    const loadDonorData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/donor/${donorId}`);
        const data = await res.json();
        if (!data.success) {
          setError(data.msg || 'Failed to load donor information');
        } else {
          setDonorData(data.donor);
        }
      } catch (e) {
        setError('Server error');
      } finally {
        setLoading(false);
      }
    };
    if (donorId) {
      loadDonorData();
    }
  }, [donorId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 font-semibold">Loading donor information...</p>
        </div>
      </div>
    );
  }

  if (error || !donorData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error || 'Donor information not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-100 to-red-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Blood Donor Health Card</h1>
          <p className="text-gray-600">Valid donor identification card</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Top Section with Red Background */}
          <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-8 pb-12">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-red-200 text-sm font-semibold mb-2">DONOR INFORMATION</p>
                <h2 className="text-4xl font-bold mb-2">{donorData.name || 'N/A'}</h2>
                <div className="flex items-center gap-4 text-red-100">
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {donorData.city && donorData.state ? `${donorData.city}, ${donorData.state}` : 'Location not provided'}
                  </span>
                </div>
              </div>
              {/* Blood Group Badge */}
              <div className="bg-white text-red-600 rounded-2xl p-6 text-center min-w-[120px] shadow-xl">
                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase">Blood Type</p>
                <p className="text-5xl font-extrabold">{donorData.bloodGroup || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* White Content Section */}
          <div className="p-8">
            {/* Personal Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-start">
                  <div className="bg-red-100 rounded-lg p-3 mr-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Gender</p>
                    <p className="text-xl font-bold text-gray-800">{donorData.gender || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-start">
                  <div className="bg-red-100 rounded-lg p-3 mr-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Age</p>
                    <p className="text-xl font-bold text-gray-800">{calculateAge(donorData.dob)} years</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-start">
                  <div className="bg-red-100 rounded-lg p-3 mr-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Date of Birth</p>
                    <p className="text-xl font-bold text-gray-800">{formatDate(donorData.dob)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-start">
                  <div className="bg-red-100 rounded-lg p-3 mr-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Email</p>
                    <p className="text-lg font-bold text-gray-800 break-all">{donorData.email || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            {donorData.phone && (
              <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 mb-6">
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-20 rounded-xl p-4 mr-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-red-200 text-sm font-semibold uppercase">Emergency Contact</p>
                    <p className="text-2xl font-bold text-white">{donorData.phone}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Address Section */}
            {(donorData.address || donorData.district || donorData.pincode) && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-start">
                  <div className="bg-red-100 rounded-lg p-3 mr-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase mb-2">Address</p>
                    <div className="text-gray-800">
                      {donorData.address && <p className="font-medium">{donorData.address}</p>}
                      {(donorData.district || donorData.city || donorData.state) && (
                        <p className="text-gray-600">
                          {[donorData.district, donorData.city, donorData.state].filter(Boolean).join(', ')}
                        </p>
                      )}
                      {donorData.pincode && <p className="text-gray-600">PIN: {donorData.pincode}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Note */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500 italic">
                This is an official donor health card. Present this QR code at blood donation centers for quick check-in.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Secured by AtriaApp</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



