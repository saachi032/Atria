import { useEffect, useState } from 'react';

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [qrLoading, setQrLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    district: '',
    pincode: '',
    bloodGroup: '',
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      setError('Not authenticated');
      return;
    }
    const load = async () => {
      try {
        const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (!data.success) {
          setError(data.msg || 'Failed to load profile');
        } else {
          const u = data.user;
          setUserData({
            name: u.name || '',
            email: u.email || '',
            phone: u.phone || '',
            dob: u.dob || '',
            gender: u.gender || '',
            address: u.address || '',
            city: u.city || '',
            state: u.state || '',
            district: u.district || '',
            pincode: u.pincode || '',
            bloodGroup: u.bloodGroup || '',
          });
        }
      } catch (e) {
        setError('Server error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) { setError('Not authenticated'); setSaving(false); return; }
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: userData.name,
          phone: userData.phone,
          dob: userData.dob,
          gender: userData.gender,
          address: userData.address,
          city: userData.city,
          state: userData.state,
          district: userData.district,
          pincode: userData.pincode,
          bloodGroup: userData.bloodGroup,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.msg || 'Failed to update profile');
      } else {
        const u = data.user;
        setUserData(prev => ({
          ...prev,
          name: u.name || '',
          phone: u.phone || '',
          dob: u.dob || '',
          gender: u.gender || '',
          address: u.address || '',
          city: u.city || '',
          state: u.state || '',
          district: u.district || '',
          pincode: u.pincode || '',
          bloodGroup: u.bloodGroup || '',
        }));
        setIsEditing(false);
      }
    } catch (e) {
      setError('Server error');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateQr = async () => {
    setQrLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) { setError('Not authenticated'); setQrLoading(false); return; }
    try {
      const res = await fetch('/api/auth/qr', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!data.success) {
        setError(data.msg || 'Failed to generate QR');
      } else {
        setQrCodeUrl(data.qrUrl);
      }
    } catch (e) {
      setError('Server error');
    } finally {
      setQrLoading(false);
    }
  };

  const DetailItem = ({ label, value, name, isEditing, type = 'text' }) => (
    <div>
      <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
      {isEditing ? (
        <input type={type} name={name} value={value} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 transition" />
      ) : (
        <p className="text-lg font-semibold text-gray-800">{name === 'dob' ? formatDate(value) : value}</p>
      )}
    </div>
  );

  const StatItem = ({ label, value }) => (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-bold text-red-600">{value}</p>
    </div>
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        {error && <div className="mb-4 bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded">{error}</div>}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center transition-all duration-300 hover:shadow-xl">
              <div className="relative w-28 h-28 mx-auto mb-4">
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                  <UserIcon />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
              <p className="text-gray-500">{userData.email}</p>
              <div className="mt-8 bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200">
                <p className="text-sm font-medium text-red-800 mb-1">Blood Group</p>
                <p className="text-4xl font-extrabold text-red-600 flex items-center justify-center"><span className='mr-2'>🩸</span>{userData.bloodGroup}</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Donation Stats</h3>
              <div className="space-y-5">
                <StatItem label="Last Donation" value={formatDate('')} />
                <StatItem label="Next Eligible" value={formatDate('')} />
                <StatItem label="Total Donations" value={`0 times`} />
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800">Details</h3>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="flex items-center py-2 px-4 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"><EditIcon />Edit Profile</button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <DetailItem label="Full Name" value={userData.name} name="name" isEditing={isEditing} />
                <DetailItem label="Email (read-only)" value={userData.email} name="email" isEditing={false} />
                <DetailItem label="Phone Number" value={userData.phone} name="phone" isEditing={isEditing} />
                <DetailItem label="Date of Birth" value={userData.dob} name="dob" isEditing={isEditing} type="date" />
                <DetailItem label="Gender" value={userData.gender} name="gender" isEditing={isEditing} />
                <DetailItem label="Blood Group" value={userData.bloodGroup} name="bloodGroup" isEditing={isEditing} />
                <DetailItem label="Address" value={userData.address} name="address" isEditing={isEditing} />
                <DetailItem label="City" value={userData.city} name="city" isEditing={isEditing} />
                <DetailItem label="State" value={userData.state} name="state" isEditing={isEditing} />
                <DetailItem label="District" value={userData.district} name="district" isEditing={isEditing} />
                <DetailItem label="Pincode" value={userData.pincode} name="pincode" isEditing={isEditing} />
              </div>
              {isEditing && (
                <div className="mt-8 flex justify-end space-x-4">
                  <button onClick={() => setIsEditing(false)} className="py-2 px-6 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all">Cancel</button>
                  <button onClick={handleSave} disabled={saving} className="py-2 px-6 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all shadow-md">{saving ? 'Saving...' : 'Save Changes'}</button>
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
                <button onClick={handleGenerateQr} disabled={qrLoading} className="py-3 px-6 rounded-xl text-base font-bold text-red-600 bg-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">{qrLoading ? 'Generating...' : 'Generate Donor ID QR'}</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

