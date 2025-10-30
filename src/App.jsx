import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Core Pages
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import AboutBloodDonation from "./components/AboutUs/AboutBloodDonation";
import Insights from "./components/dashboard/Insights";

// Donor Pages
import DonorLogin from "./components/DonorLogin";
import RegisterForm from "./components/RegisterForm";
import Profile from "./components/Profile";
import DonationHistory from "./components/DonationHistory";
import ScheduleAppointment from "./components/ScheduleAppointment";

// Hospital Pages
import HospitalLogin from "./components/hospital/HospitalLogin";
import HospitalRegister from "./components/hospital/HospitalRegister";
import HospitalDashboard from "./components/hospital/HospitalDashboard";
import AppointmentsPage from "./components/hospital/AppointmentsPage";
import Inventory from "./components/hospital/Inventory";
import RequestsPage from "./components/hospital/Requests";

// Blood Bank Pages
import BloodBankLogin from "./components/login_as_bb/BloodBankLogin";
import BloodBankRegister from "./components/login_as_bb/BloodBankRegister";
import BloodBankDashboard from "./components/login_as_bb/BloodBankDashboard";
import BloodBankInventory from "./components/login_as_bb/BloodBankInventory";
import BloodBankAppointments from "./components/login_as_bb/BloodBankAppointments";
import BloodBankParentHospitals from "./components/login_as_bb/BloodBankParentHospitals";

// import BloodBankParentHospitals from "./components/login_as_bb/BloodBankParentHospitals"; // Uncomment if you have this file

// Find Blood Page
import FindBlood from "./components/findBlood/FindBlood";

export default function App() {
  return (
    <AuthProvider>
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <Routes>
          {/* Hospital Protected Routes */}
          <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
          <Route path="/hospital/inventory" element={<Inventory />} />
          <Route path="/hospital/requests" element={<RequestsPage />} />
          <Route path="/hospital/appointments" element={<AppointmentsPage />} />

          {/* Blood Bank Protected Routes */}
          <Route path="/bloodbank/dashboard" element={<BloodBankDashboard />} />
          <Route path="/bloodbank/inventory" element={<BloodBankInventory />} />
          <Route path="/bloodbank/appointments" element={<BloodBankAppointments />} />
          <Route path="/bloodbank/parent-hospitals" element={<BloodBankParentHospitals />} />


          {/* Public Routes with Navbar */}
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <Routes>
                  {/* Core Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/about" element={<AboutBloodDonation />} />
                  <Route path="/dashboard" element={<Insights />} />
                  <Route path="/find-blood" element={<FindBlood />} />

                  {/* Donor Routes */}
                  <Route path="/donor-login" element={<DonorLogin />} />
                  <Route path="/register" element={<RegisterForm />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/donation-history" element={<DonationHistory />} />
                  <Route path="/schedule-appointment" element={<ScheduleAppointment />} />

                  {/* Hospital Auth Routes */}
                  <Route path="/login/hospital" element={<HospitalLogin />} />
                  <Route path="/register/hospital" element={<HospitalRegister />} />

                  {/* Blood Bank Auth Routes */}
                  <Route path="/login/bloodbank" element={<BloodBankLogin />} />
                  <Route path="/register/bloodbank" element={<BloodBankRegister />} />
                </Routes>
              </>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}
