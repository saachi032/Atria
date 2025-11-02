import { useState, useEffect } from "react";
import { statesAndCities } from "../data/locations";
import { useNavigate } from "react-router-dom";

// Initial form state with password fields
const initialFormState = {
  firstName: "", lastName: "", email: "", phone: "",
  password: "", confirmPassword: "",
  state: "", city: "", district: "",
  address: "", bloodGroup: "", gender: "",
  dob_day: "", dob_month: "", dob_year: "",
  agreed: false,
};

export default function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormState);
  const [calculatedAge, setCalculatedAge] = useState(null);
  
  // State for location dropdowns
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]); 
  const [pincode, setPincode] = useState("");
  
  // State for phone OTP verification
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stateNames = Object.keys(statesAndCities).sort();

  // Effects for age and location (no change)
  useEffect(() => {
    if (form.dob_year && form.dob_month && form.dob_day) {
      const birthDate = new Date(form.dob_year, form.dob_month - 1, form.dob_day);
      let age = new Date().getFullYear() - birthDate.getFullYear();
      const m = new Date().getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && new Date().getDate() < birthDate.getDate())) age--;
      setCalculatedAge(age);
    } else setCalculatedAge(null);
  }, [form.dob_day, form.dob_month, form.dob_year]);

  useEffect(() => {
    if (form.state) setCities(Object.keys(statesAndCities[form.state]).sort());
    else setCities([]);
    setDistricts([]); setPincode("");
  }, [form.state]);

  useEffect(() => {
    if (form.state && form.city) setDistricts(statesAndCities[form.state][form.city]);
    else setDistricts([]);
    setPincode("");
  }, [form.city]);

  useEffect(() => {
    if (form.district) {
      const district = districts.find(d => d.district === form.district);
      if (district) setPincode(district.pincode);
    } else setPincode("");
  }, [form.district, districts]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    let newFormState = { ...form, [name]: type === "checkbox" ? checked : value };
    if (name === 'state') { newFormState.city = ''; newFormState.district = ''; }
    else if (name === 'city') newFormState.district = '';
    setForm(newFormState);
  }

  async function handleSendOtp() {
    if (form.phone.length !== 10 || !/^\d+$/.test(form.phone)) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: form.phone })
      });
      const data = await res.json();
      setLoading(false);
      
      if (data.success) {
        alert(`OTP sent successfully to ${form.phone}`);
        setIsOtpSent(true);
        setError("");
      } else {
        setError(data.message || 'Failed to send OTP');
        alert(data.message || 'Failed to send OTP');
      }
    } catch (e) {
      setLoading(false);
      setError("Failed to send OTP. Please try again.");
      alert("Failed to send OTP. Please try again.");
    }
  }

  async function handleVerifyOtp() {
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      alert("Invalid OTP. Please enter the 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: form.phone, otp })
      });
      const data = await res.json();
      setLoading(false);
      
      if (data.success) {
        alert("Phone number verified successfully!");
        setIsPhoneVerified(true);
        setError("");
      } else {
        setError(data.message || 'Invalid OTP');
        alert(data.message || 'Invalid OTP. Please try again.');
        setOtp(""); // Clear OTP input on failure
      }
    } catch (e) {
      setLoading(false);
      setError("Failed to verify OTP. Please try again.");
      alert("Failed to verify OTP. Please try again.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!isPhoneVerified) { setError("Please verify your phone number before signing up."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    if (form.password.length < 8) { setError("Password must be at least 8 characters long."); return; }
    if (!hasNumber.test(form.password)) { setError("Password must contain at least one number."); return; }
    if (!hasSpecialChar.test(form.password)) { setError("Password must contain at least one special character."); return; }
    if (!form.agreed) { setError("Please agree to the terms."); return; }
    const finalData = { ...form, age: calculatedAge, pincode: pincode };
    const formToValidate = { ...finalData }; delete formToValidate.agreed; delete formToValidate.confirmPassword;
    for (const key in formToValidate) { if (!formToValidate[key]) { setError(`Incomplete fields. Please fill out the entire form. Missing: ${key}`); return; }}

    const pad = (n) => String(n).padStart(2,'0');
    const dob = `${form.dob_year}-${pad(form.dob_month)}-${pad(form.dob_day)}`;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          password: form.password,
          phone: form.phone,
          address: form.address,
          state: form.state,
          city: form.city,
          district: form.district,
          pincode: pincode,
          gender: form.gender,
          bloodGroup: form.bloodGroup,
          dob,
        })
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        alert("Sign up successful! You will now be redirected to the login page.");
        navigate('/donor-login');
      } else {
        setError(data.msg || "Registration failed. Try again.");
      }
    } catch (e) {
      setLoading(false);
      setError("Server error. Please try again later.");
    }
  }

  const inputStyle = "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 transition";
  const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="flex items-center justify-center py-12 px-4 pt-24">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg space-y-6">
        <div><h2 className="text-center text-3xl font-extrabold text-gray-900">Become a Donor</h2><p className="mt-2 text-center text-sm text-gray-600">Join our community of lifesavers today.</p></div>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div><label className={labelStyle}>First Name</label><input name="firstName" value={form.firstName} onChange={handleChange} className={inputStyle} /></div>
            <div><label className={labelStyle}>Last Name</label><input name="lastName" value={form.lastName} onChange={handleChange} className={inputStyle} /></div>
          </div>
          
          <div><label className={labelStyle}>Email Address</label><input name="email" type="email" value={form.email} onChange={handleChange} className={inputStyle} /></div>

          {/* --- Phone Verification Section --- */}
          <div>
            <label className={labelStyle}>Phone Number</label>
            <div className="flex items-center gap-2">
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputStyle} disabled={isPhoneVerified} placeholder="10-digit number" />
              <button type="button" onClick={handleSendOtp} disabled={isOtpSent} className="py-2 px-4 rounded-md text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 whitespace-nowrap">
                {isPhoneVerified ? 'Verified ✓' : 'Send OTP'}
              </button>
            </div>
          </div>

          {isOtpSent && !isPhoneVerified && (
            <div className="p-4 bg-gray-50 rounded-md">
              <label className={labelStyle}>Enter OTP</label>
              <div className="flex items-center gap-2">
                <input name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} className={inputStyle} placeholder="6-digit code" maxLength="6" />
                <button type="button" onClick={handleVerifyOtp} className="py-2 px-4 rounded-md text-white bg-green-500 hover:bg-green-600 whitespace-nowrap">Confirm OTP</button>
              </div>
            </div>
          )}

          {/* --- Password Section --- */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} className={inputStyle} />
              {/* --- NEW: Updated helper text --- */}
              <p className="text-xs text-gray-500 mt-1">8+ chars, 1 number, 1 special character.</p>
            </div>
            <div>
              <label className={labelStyle}>Confirm Password</label>
              <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className={inputStyle} />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div><label className={labelStyle}>Address</label><input name="address" value={form.address} onChange={handleChange} className={inputStyle} placeholder="House No, Street, Area"/></div>
            <div><label className={labelStyle}>Pincode</label><div className="w-full h-[42px] p-2 border border-gray-200 bg-gray-100 rounded-md text-left font-semibold text-gray-700 flex items-center">{pincode || '--'}</div></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><label className={labelStyle}>State</label><select name="state" value={form.state} onChange={handleChange} className={inputStyle}><option value="">Select</option>{stateNames.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
            <div><label className={labelStyle}>City</label><select name="city" value={form.city} onChange={handleChange} className={inputStyle} disabled={!form.state}><option value="">Select</option>{cities.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className={labelStyle}>District</label><select name="district" value={form.district} onChange={handleChange} className={inputStyle} disabled={!form.city}><option value="">Select</option>{districts.map(d=><option key={d.district} value={d.district}>{d.district}</option>)}</select></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className={labelStyle}>Blood Group</label><select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className={inputStyle}><option value="">Select</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option></select></div>
            <div><label className={labelStyle}>Gender</label><select name="gender" value={form.gender} onChange={handleChange} className={inputStyle}><option value="">Select</option><option>Male</option><option>Female</option><option>Prefer not to say</option></select></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div className="md:col-span-3"><label className={labelStyle}>Date of Birth</label><div className="grid grid-cols-3 gap-2"><select name="dob_day" value={form.dob_day} onChange={handleChange} className={inputStyle}><option value="">Day</option>{Array.from({length:31},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}</option>)}</select><select name="dob_month" value={form.dob_month} onChange={handleChange} className={inputStyle}><option value="">Month</option>{Array.from({length:12},(_,i)=>i+1).map(m=><option key={m} value={m}>{m}</option>)}</select><select name="dob_year" value={form.dob_year} onChange={handleChange} className={inputStyle}><option value="">Year</option>{Array.from({length:100},(_,i)=>new Date().getFullYear()-18-i).map(y=><option key={y} value={y}>{y}</option>)}</select></div></div>
              <div><label className={labelStyle}>Age</label><div className="w-full p-2 h-[42px] border border-gray-200 bg-gray-100 rounded-md text-center font-semibold text-gray-700 flex items-center justify-center">{calculatedAge !== null ? calculatedAge : '--'}</div></div>
          </div>
          
          <div className="flex items-center"><input id="agreed" name="agreed" type="checkbox" checked={form.agreed} onChange={handleChange} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" /><label htmlFor="agreed" className="ml-2 block text-sm text-gray-900">I agree to the terms and conditions.</label></div>
          
          <div><button type="submit" disabled={!isPhoneVerified || loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button></div>
        </form>
      </div>
    </div>
  );
}

