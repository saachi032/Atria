"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom" // Import useNavigate
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate() // Hook for navigation
  const { isLoggedIn, logout, user } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle logout and redirect
  const handleLogout = () => {
    logout();
    navigate('/');
  };


  const LoggedOutLinks = () => (
    <>
      <li className="relative group">
        <Link
          to="/"
          className={`nav-link relative px-3 py-2 rounded-lg transition-all duration-300 ease-in-out hover:text-red-600 hover:bg-red-50 ${isActive("/") ? "text-red-600 font-bold bg-red-50" : ""}`}
        >
          Home
          {isActive("/") && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full"></div>}
        </Link>
        <div className="absolute left-0 top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white rounded-xl shadow-xl border border-gray-100 z-10 min-w-[160px] overflow-hidden">
          <div className="py-2">
            <Link to="/about" className="block w-full px-5 py-3 hover:bg-red-50 hover:text-red-600 text-gray-700 text-left transition-all duration-200 hover:pl-6">
              About Us
            </Link>
          </div>
        </div>
      </li>
      <li>
        <Link to="/find-blood" className={`nav-link relative px-3 py-2 rounded-lg transition-all duration-300 ease-in-out hover:text-red-600 hover:bg-red-50 ${isActive("/find-blood") ? "text-red-600 font-bold bg-red-50" : ""}`}>
          Find Blood
          {isActive("/find-blood") && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full"></div>}
        </Link>
      </li>
      <li>
        <Link to="/donor-login" className={`nav-link relative px-3 py-2 rounded-lg transition-all duration-300 ease-in-out hover:text-red-600 hover:bg-red-50 ${isActive("/donor-login") || isActive("/register") ? "text-red-600 font-bold bg-red-50" : ""}`}>
          Want to Donate Blood?
          {(isActive("/donor-login") || isActive("/register")) && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full"></div>}
        </Link>
      </li>
      <li className="relative group">
        <span className="nav-link cursor-pointer px-3 py-2 rounded-lg font-semibold select-none transition-all duration-300 hover:bg-gray-50 hover:text-gray-700">
          Login As
          <svg className="inline-block ml-1 w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
        <div className="absolute left-0 top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white rounded-xl shadow-xl border border-gray-100 z-10 min-w-[160px] overflow-hidden">
          <div className="py-2">
            <Link to="/login/hospital" className="block w-full px-5 py-3 hover:bg-red-50 hover:text-red-600 text-gray-700 text-left transition-all duration-200 hover:pl-6">
              Hospital
            </Link>
            <Link to="/login/bloodbank" className="block w-full px-5 py-3 hover:bg-red-50 hover:text-red-600 text-gray-700 text-left transition-all duration-200 hover:pl-6">
              Blood Bank
            </Link>
          </div>
        </div>
      </li>
       <li>
          <Link
            to="/dashboard"
            className={`nav-link relative px-3 py-2 rounded-lg transition-all duration-300 ease-in-out hover:text-red-600 hover:bg-red-50 ${
              isActive("/dashboard") ? "text-red-600 font-bold bg-red-50" : ""
            }`}
          >
            Dashboard
            {isActive("/dashboard") && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full"></div>
            )}
          </Link>
        </li>
    </>
  );

  const LoggedInLinks = () => (
    <>
      <li className="relative group">
        <Link
          to="/"
          className={`nav-link relative px-3 py-2 rounded-lg transition-all duration-300 ease-in-out hover:text-red-600 hover:bg-red-50 ${isActive("/") ? "text-red-600 font-bold bg-red-50" : ""}`}
        >
          Home
          {(isActive("/") || isActive("/about")) && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full"></div>}
        </Link>
        <div className="absolute left-0 top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white rounded-xl shadow-xl border border-gray-100 z-10 min-w-[160px] overflow-hidden">
          <div className="py-2">
            <Link to="/about" className="block w-full px-5 py-3 hover:bg-red-50 hover:text-red-600 text-gray-700 text-left transition-all duration-200 hover:pl-6">
              About Us
            </Link>
          </div>
        </div>
      </li>
      <li>
        <Link to="/find-blood" className={`nav-link relative px-3 py-2 rounded-lg transition-all duration-300 ease-in-out hover:text-red-600 hover:bg-red-50 ${isActive("/find-blood") ? "text-red-600 font-bold bg-red-50" : ""}`}>
          Find Blood
          {isActive("/find-blood") && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full"></div>}
        </Link>
      </li>
      {/* --- NEW LINK ADDED HERE --- */}
      <li>
        <Link to="/schedule-appointment" className={`nav-link relative px-3 py-2 rounded-lg transition-all duration-300 ease-in-out hover:text-red-600 hover:bg-red-50 ${isActive("/schedule-appointment") ? "text-red-600 font-bold bg-red-50" : ""}`}>
          Schedule Appointment
          {isActive("/schedule-appointment") && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full"></div>}
        </Link>
      </li>
      <li>
        <Link to="/dashboard" className={`nav-link relative px-3 py-2 rounded-lg transition-all duration-300 ease-in-out hover:text-red-600 hover:bg-red-50 ${isActive("/dashboard") ? "text-red-600 font-bold bg-red-50" : ""}`}>
          Dashboard
          {isActive("/dashboard") && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full"></div>}
        </Link>
      </li>
      <li className="relative group">
        <span className={`nav-link cursor-pointer px-3 py-2 rounded-lg font-semibold select-none transition-all duration-300 hover:bg-gray-50 hover:text-gray-700 ${isActive("/profile") || isActive("/donation-history") ? "text-red-600 font-bold bg-red-50" : ""}`}>
          My Profile
          <svg className="inline-block ml-1 w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
           {(isActive("/profile") || isActive("/donation-history")) && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full"></div>}
        </span>
        <div className="absolute right-0 top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white rounded-xl shadow-xl border border-gray-100 z-10 min-w-[200px] overflow-hidden">
          <div className="py-2">
            <Link to="/profile" className="block w-full px-5 py-3 hover:bg-red-50 hover:text-red-600 text-gray-700 text-left transition-all duration-200 hover:pl-6">
              Profile
            </Link>
            <Link to="/donation-history" className="block w-full px-5 py-3 hover:bg-red-50 hover:text-red-600 text-gray-700 text-left transition-all duration-200 hover:pl-6">
              Donation History
            </Link>
            <div className="border-t border-gray-100 my-1"></div>
            <button onClick={handleLogout} className="block w-full px-5 py-3 hover:bg-red-50 hover:text-red-600 text-gray-700 text-left transition-all duration-200 hover:pl-6">
              Logout
            </button>
          </div>
        </div>
      </li>
    </>
  );

  return (
    <nav
      className={`w-full flex items-center justify-between px-4 md:px-8 py-3 fixed top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100" : "bg-white shadow-sm"}`}
    >
      <div className="flex items-center">
        <Link to="/" className="flex items-center no-underline cursor-pointer group">
          <span className="font-extrabold text-3xl md:text-4xl tracking-widest text-red-600 drop-shadow-[0_4px_16px_rgba(220,38,38,0.50)] transition-all duration-300 hover:text-red-700 hover:scale-105 group-hover:drop-shadow-[0_6px_20px_rgba(220,38,38,0.60)]">
            ♦ Atria
          </span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center space-x-8 text-black font-semibold">
        {isLoggedIn ? <LoggedInLinks /> : <LoggedOutLinks />}
      </ul>
      {isLoggedIn && (
        <div className="hidden md:flex items-center text-sm text-gray-600 font-semibold ml-4">
          Hello, <span className="ml-1 text-gray-900">{user?.name || 'User'}</span>
        </div>
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1 transition-all duration-300 hover:bg-gray-100 rounded-lg p-1"
        aria-label="Toggle mobile menu"
      >
        <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}></div>
        <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}></div>
        <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></div>
      </button>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-4"}`}
      >
        {isLoggedIn ? (
          <div className="px-4 py-6 space-y-4">
            <Link to="/" className={`block px-4 py-3 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600 ${isActive("/") ? "text-red-600 font-bold bg-red-50" : "text-gray-700"}`}>Home</Link>
            <Link to="/about" className="block px-4 py-3 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600 text-gray-700 ml-4">About Us</Link>
            <Link to="/find-blood" className={`block px-4 py-3 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600 ${isActive("/find-blood") ? "text-red-600 font-bold bg-red-50" : "text-gray-700"}`}>Find Blood</Link>
            {/* --- NEW LINK ADDED HERE --- */}
            <Link to="/schedule-appointment" className={`block px-4 py-3 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600 ${isActive("/schedule-appointment") ? "text-red-600 font-bold bg-red-50" : "text-gray-700"}`}>Schedule Appointment</Link>
            <Link to="/dashboard" className={`block px-4 py-3 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600 ${isActive("/dashboard") ? "text-red-600 font-bold bg-red-50" : "text-gray-700"}`}>Dashboard</Link>
            <div className="space-y-2">
              <div className="px-4 py-2 text-gray-500 font-medium text-sm">My Profile</div>
              <Link to="/profile" className={`block px-4 py-3 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600 ml-4 ${isActive("/profile") ? "text-red-600 font-bold bg-red-50" : "text-gray-700"}`}>Profile</Link>
              <Link to="/donation-history" className={`block px-4 py-3 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600 ml-4 ${isActive("/donation-history") ? "text-red-600 font-bold bg-red-50" : "text-gray-700"}`}>Donation History</Link>
            </div>
             <div className="border-t border-gray-200 pt-4 mt-4">
              <button onClick={handleLogout} className="block w-full text-left px-4 py-3 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600 text-gray-700">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="px-4 py-6 space-y-4">
            <Link to="/" className={`block px-4 py-3 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600 ${isActive("/") ? "text-red-600 font-bold bg-red-50" : "text-gray-700"}`}>Home</Link>
            <Link to="/about" className="block px-4 py-3 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600 text-gray-700 ml-4">About Us</Link>
            <Link to="/find-blood" className={`block px-4 py-3 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600 ${isActive("/find-blood") ? "text-red-600 font-bold bg-red-50" : "text-gray-700"}`}>Find Blood</Link>
            <Link to="/donor-login" className={`block px-4 py-3 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600 ${isActive("/donor-login") || isActive("/register") ? "text-red-600 font-bold bg-red-50" : "text-gray-700"}`}>Want to Donate Blood?</Link>
            <div className="space-y-2">
              <div className="px-4 py-2 text-gray-500 font-medium text-sm">Login As</div>
              <Link to="/login/hospital" className="block px-4 py-3 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600 text-gray-700 ml-4">Hospital</Link>
              <Link to="/login/bloodbank" className="block px-4 py-3 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600 text-gray-700 ml-4">Blood Bank</Link>
            </div>
            <Link to="/dashboard" className={`block px-4 py-3 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600 ${isActive("/dashboard") ? "text-red-600 font-bold bg-red-50" : "text-gray-700"}`}>Dashboard</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar