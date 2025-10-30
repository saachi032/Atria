import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// --- SVG Icon Components ---
const HomeIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> );
const DropletsIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 16.3c.5.5 1.2 1 2.2 1.7.9.7 1.8 1 2.8 1 .9 0 1.8-.3 2.8-1 .9-.7 1.7-1.2 2.2-1.7M12 22v-2.2M18.3 5.4A6.4 6.4 0 0 0 12 2a6.4 6.4 0 0 0-6.3 3.4"/><path d="M12 2v7.3"/><path d="m 5.7,14 a 6.4,6.4 0 0 0 12.6,0"/></svg> );
const CalendarIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg> );
const LogOutIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg> );


export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    async function handleLogout() {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    }

    const getLinkClass = (path) => {
        return location.pathname === path
            ? 'flex items-center px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg shadow'
            : 'flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 rounded-lg transition-colors';
    };

    return (
        <aside className="w-64 bg-white border-r shadow-md flex flex-col flex-shrink-0">
            <div className="p-6 text-center border-b">
                <Link to="/hospital/dashboard" className="text-2xl font-bold text-red-600 no-underline transition-opacity hover:opacity-80">
                    ♦ XYZ Hospital
                </Link>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                <Link to="/hospital/dashboard" className={getLinkClass('/hospital/dashboard')}>
                    <HomeIcon className="w-5 h-5 mr-3" /> Dashboard
                </Link>
                <Link to="/hospital/inventory" className={getLinkClass('/hospital/inventory')}>
                    <DropletsIcon className="w-5 h-5 mr-3" /> Inventory
                </Link>
                <Link to="/hospital/appointments" className={getLinkClass('/hospital/appointments')}>
                    <CalendarIcon className="w-5 h-5 mr-3" /> Appointments
                </Link>
            </nav>
            <div className="p-4 border-t">
                <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2 text-gray-600 hover:bg-red-50 rounded-lg transition-colors">
                    <LogOutIcon className="w-5 h-5 mr-3"/> Logout
                </button>
            </div>
        </aside>
    );
}