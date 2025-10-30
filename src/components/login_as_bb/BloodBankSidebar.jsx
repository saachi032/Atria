import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// If you use AuthContext for bloodbank, import useAuth
import { useAuth } from '../../context/AuthContext';

// --- SVG Icon Components ---
const HomeIcon = (props) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg> 
);
const DropletsIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7 16.3c.5.5 1.2 1 2.2 1.7.9.7 1.8 1 2.8 1 .9 0 1.8-.3 2.8-1 .9-.7 1.7-1.2 2.2-1.7M12 22v-2.2M18.3 5.4A6.4 6.4 0 0 0 12 2a6.4 6.4 0 0 0-6.3 3.4"/><path d="M12 2v7.3"/><path d="m5.7,14 a 6.4,6.4 0 0 0 12.6,0"/>
  </svg>
);
const CalendarIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);
const HospitalIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="18" height="10" x="3" y="7" rx="2" /><path d="M3,17h18M7,17V7M17,17V7" />
  </svg>
);
const LogOutIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
  </svg>
);

function BloodBankSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  // Uncomment if you use AuthContext
  // const { logout } = useAuth();

  async function handleLogout() {

    try {
      await logout();
      navigate('/login/bloodbank');
    } catch (error) {
      console.error("Failed to log out:", error);
    }
    Otherwise:
    navigate('/');
  }

  const getLinkClass = (path) =>
    location.pathname === path
      ? 'flex items-center px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg shadow'
      : 'flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 rounded-lg transition-colors';

  return (
    <aside className="w-64 bg-white border-r shadow-md flex flex-col flex-shrink-0">
      <div className="p-6 text-center border-b">
        <Link to="/bloodbank/dashboard" className="text-2xl font-bold text-red-600 no-underline transition-opacity hover:opacity-80">
          ♦ XYZ Blood Bank
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link to="/bloodbank/dashboard" className={getLinkClass('/bloodbank/dashboard')}>
          <HomeIcon className="w-5 h-5 mr-3" /> Dashboard
        </Link>
        <Link to="/bloodbank/inventory" className={getLinkClass('/bloodbank/inventory')}>
          <DropletsIcon className="w-5 h-5 mr-3" /> Inventory
        </Link>
        <Link to="/bloodbank/appointments" className={getLinkClass('/bloodbank/appointments')}>
          <CalendarIcon className="w-5 h-5 mr-3" /> Appointments
        </Link>
        <Link to="/bloodbank/parent-hospitals" className={getLinkClass('/bloodbank/parent-hospitals')}>
          <HospitalIcon className="w-5 h-5 mr-3" /> Parent Hospitals
        </Link>
      </nav>
      <div className="p-4 border-t">
        <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2 text-gray-600 hover:bg-red-50 rounded-lg transition-colors">
          <LogOutIcon className="w-5 h-5 mr-3" /> Logout
        </button>
      </div>
    </aside>
  );
}

export default BloodBankSidebar;
