import { useState, useEffect } from "react";
import { statesAndCities } from "../../data/locations";
import { useNavigate } from "react-router-dom";

// Comprehensive initial state for the blood bank registration form
const initialFormState = {
  bloodBankName: "",
  licenseNumber: "",
  category: "", // govt, pvt, redcross, charitable
  isAffiliated: "no", // 'yes' or 'no'
  affiliatedHospitalName: "",
  affiliatedHospitalContact: "",
  address: "",
  contactNumber: "",
  email: "",
  website: "",
  pocName: "",
  pocDesignation: "",
  pocMobile: "",
  pocEmail: "",
  password: "",
  confirmPassword: "",
  state: "",
  city: "",
  district: "",
  agreed: false,
};

export default function BloodBankRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormState);
  
  // State for location logic
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]); 
  const [pincode, setPincode] = useState("");
  const stateNames = Object.keys(statesAndCities).sort();

  // State for OTP verification for the POC mobile number
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Location logic effects (same as hospital registration)
  useEffect(() => {
    if (form.state) setCities(Object.keys(statesAndCities[form.state]).sort());
    else { setCities([]); setDistricts([]); setPincode(""); }
    setForm(f => ({ ...f, city: '', district: '' }));
  }, [form.state]);

  useEffect(() => {
    if (form.state && form.city) setDistricts(statesAndCities[form.state][form.city]);
    else { setDistricts([]); setPincode(""); }
    setForm(f => ({ ...f, district: '' }));
  }, [form.city]);

  useEffect(() => {
    if (form.district) {
      const district = districts.find(d => d.district === form.district);
      if (district) setPincode(district.pincode);
    } else setPincode("");
  }, [form.district, districts]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  // OTP Handlers for POC Mobile
  function handleSendOtp() {
    if (form.pocMobile.length < 10 || !/^\d+$/.test(form.pocMobile)) {
      alert('Please enter a valid 10-digit POC mobile number.');
      return;
    }
    alert(`An OTP has been sent to ${form.pocMobile}. (Simulation)`);
    setIsOtpSent(true);
  }

  function handleVerifyOtp() {
    if (otp === "1234") { // Simulate correct OTP
      alert("POC mobile number verified successfully!");
      setIsPhoneVerified(true);
    } else {
      alert("Invalid OTP. Please try again.");
    }
  }

  // Form Submission
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!isPhoneVerified) { setError("Please verify the POC's mobile number."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (!form.agreed) { setError("Please agree to the terms."); return; }
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    if (form.password.length < 8) { setError("Password must be at least 8 characters long."); return; }
    if (!hasNumber.test(form.password)) { setError("Password must contain at least one number."); return; }
    if (!hasSpecialChar.test(form.password)) { setError("Password must contain at least one special character."); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/bloodbank/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.pocName,
          email: form.pocEmail,
          password: form.password,
        })
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        alert("Blood Bank registration successful! Redirecting to login page.");
        navigate('/login/bloodbank');
      } else {
        setError(data.msg || "Registration failed. Try again.");
      }
    } catch (e) {
      setLoading(false);
      setError("Server error. Please try again later.");
    }
  }

  const inputStyle = "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 transition";
  const labelStyle = "block text-sm font-medium text-gray-700 mb-1";
  const sectionHeaderStyle = "text-xl font-semibold text-gray-800 border-b border-gray-300 pb-2 mb-6";

  return (
    <div className="bg-gray-50 flex items-center justify-center py-12 px-4 pt-24">
      <div className="w-full max-w-4xl bg-white p-8 md:p-12 rounded-xl shadow-lg space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Blood Bank Onboarding</h2>
          <p className="mt-2 text-sm text-gray-600">Register your blood bank to join the Atria lifesaving network.</p>
        </div>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Section 1: Blood Bank Details */}
          <fieldset>
            <legend className={sectionHeaderStyle}>1. Blood Bank Details</legend>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2"><label htmlFor="bloodBankName" className={labelStyle}>Blood Bank Name</label><input id="bloodBankName" name="bloodBankName" value={form.bloodBankName} onChange={handleChange} className={inputStyle} /></div>
              <div><label htmlFor="category" className={labelStyle}>Category</label><select id="category" name="category" value={form.category} onChange={handleChange} className={inputStyle}><option value="">Select Category</option><option value="govt">Government</option><option value="pvt">Private</option><option value="redcross">Red Cross</option><option value="charitable">Charitable</option></select></div>
            </div>
            <div className="mt-6"><label htmlFor="licenseNumber" className={labelStyle}>License No.</label><input id="licenseNumber" name="licenseNumber" value={form.licenseNumber} onChange={handleChange} className={inputStyle} /></div>
          </fieldset>

          {/* Section 2: Affiliation Details */}
           <fieldset>
            <legend className={sectionHeaderStyle}>2. Affiliation Details</legend>
            <div>
              <label className={labelStyle}>is the blood bank affiliated with a hospital?</label>
              <div className="flex items-center gap-6 mt-2">
                <label className="flex items-center"><input type="radio" name="isAffiliated" value="yes" checked={form.isAffiliated === 'yes'} onChange={handleChange} className="h-4 w-4 text-green-600 focus:ring-green-500" /> <span className="ml-2">Yes</span></label>
                <label className="flex items-center"><input type="radio" name="isAffiliated" value="no" checked={form.isAffiliated === 'no'} onChange={handleChange} className="h-4 w-4 text-green-600 focus:ring-green-500" /> <span className="ml-2">No</span></label>
              </div>
            </div>
            {form.isAffiliated === 'yes' && (
              <div className="grid md:grid-cols-2 gap-6 mt-4 p-4 bg-gray-50 rounded-md">
                <div><label htmlFor="affiliatedHospitalName" className={labelStyle}>Affiliated Hospital Name</label><input id="affiliatedHospitalName" name="affiliatedHospitalName" value={form.affiliatedHospitalName} onChange={handleChange} className={inputStyle} /></div>
                <div><label htmlFor="affiliatedHospitalContact" className={labelStyle}>Hospital Contact Number</label><input id="affiliatedHospitalContact" name="affiliatedHospitalContact" type="tel" value={form.affiliatedHospitalContact} onChange={handleChange} className={inputStyle} /></div>
              </div>
            )}
          </fieldset>
          
          {/* Section 3: Contact & Location */}
          <fieldset>
            <legend className={sectionHeaderStyle}>3. Contact & Location</legend>
             <div className="grid md:grid-cols-2 gap-6">
                 <div><label htmlFor="email" className={labelStyle}>Official Email</label><input id="email" name="email" type="email" value={form.email} onChange={handleChange} className={inputStyle} /></div>
                 <div><label htmlFor="contactNumber" className={labelStyle}>Contact Number (Reception)</label><input id="contactNumber" name="contactNumber" type="tel" value={form.contactNumber} onChange={handleChange} className={inputStyle} /></div>
             </div>
             <div className="mt-6"><label htmlFor="website" className={labelStyle}>Website (Optional)</label><input id="website" name="website" type="url" value={form.website} onChange={handleChange} className={inputStyle} placeholder="https://www.example.com" /></div>
             <div className="mt-6"><label htmlFor="address" className={labelStyle}>Full Address</label><textarea id="address" name="address" value={form.address} onChange={handleChange} className={inputStyle} rows={2}></textarea></div>
             <div className="grid md:grid-cols-4 gap-6 mt-6">
                <div><label htmlFor="state" className={labelStyle}>State</label><select id="state" name="state" value={form.state} onChange={handleChange} className={inputStyle}><option value="">Select</option>{stateNames.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                <div><label htmlFor="city" className={labelStyle}>City</label><select id="city" name="city" value={form.city} onChange={handleChange} className={inputStyle} disabled={!form.state}><option value="">Select</option>{cities.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div><label htmlFor="district" className={labelStyle}>District</label><select id="district" name="district" value={form.district} onChange={handleChange} className={inputStyle} disabled={!form.city}><option value="">Select</option>{districts.map(d => <option key={d.district} value={d.district}>{d.district}</option>)}</select></div>
                <div><label className={labelStyle}>Pincode</label><div className="h-[42px] p-2 border bg-gray-100 rounded-md flex items-center">{pincode || '--'}</div></div>
              </div>
          </fieldset>

          {/* Section 4: Point of Contact (POC) Details */}
          <fieldset>
            <legend className={sectionHeaderStyle}>4. Point of Contact (POC) Details</legend>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6"><div><label htmlFor="pocName" className={labelStyle}>POC Full Name</label><input id="pocName" name="pocName" value={form.pocName} onChange={handleChange} className={inputStyle} /></div><div><label htmlFor="pocDesignation" className={labelStyle}>POC Designation</label><input id="pocDesignation" name="pocDesignation" value={form.pocDesignation} onChange={handleChange} className={inputStyle} /></div></div>
              <div className="grid md:grid-cols-2 gap-6"><div><label htmlFor="pocMobile" className={labelStyle}>POC Mobile Number</label><div className="flex gap-2"><input id="pocMobile" name="pocMobile" type="tel" value={form.pocMobile} onChange={handleChange} className={inputStyle} disabled={isPhoneVerified} /><button type="button" onClick={handleSendOtp} disabled={isOtpSent} className="py-2 px-4 rounded-md text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 whitespace-nowrap">{isPhoneVerified ? 'Verified ✓' : 'Verify'}</button></div></div><div><label htmlFor="pocEmail" className={labelStyle}>POC Email (This is your username)</label><input id="pocEmail" name="pocEmail" type="email" value={form.pocEmail} onChange={handleChange} className={inputStyle} /></div></div>
              {isOtpSent && !isPhoneVerified && (<div className="p-4 bg-blue-50 rounded-md grid md:grid-cols-2 gap-6 items-center"><label htmlFor="otp" className={labelStyle}>Enter OTP sent to {form.pocMobile}</label><div className="flex items-center gap-2"><input id="otp" name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} className={inputStyle} maxLength="4" placeholder="4-digit code" /><button type="button" onClick={handleVerifyOtp} className="py-2 px-4 rounded-md text-white bg-green-500 hover:bg-green-600">Confirm</button></div></div>)}
              <div className="grid md:grid-cols-2 gap-6"><div><label htmlFor="password" className={labelStyle}>Create Password</label><input id="password" name="password" type="password" value={form.password} onChange={handleChange} className={inputStyle} /><p className="text-xs text-gray-500 mt-1">8+ chars, 1 number, 1 special character.</p></div><div><label htmlFor="confirmPassword" className={labelStyle}>Confirm Password</label><input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className={inputStyle} /></div></div>
            </div>
          </fieldset>

          {/* Submission */}
          <div>
            <div className="flex items-center mb-6"><input id="agreed" name="agreed" type="checkbox" checked={form.agreed} onChange={handleChange} className="h-4 w-4 text-green-600 focus:ring-green-500" /><label htmlFor="agreed" className="ml-2 block text-sm">I confirm that all information is accurate and agree to the terms of service.</label></div>
            <button type="submit" disabled={!isPhoneVerified || loading} className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-lg font-semibold text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400">
              {loading ? "Registering..." : "Complete Registration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

