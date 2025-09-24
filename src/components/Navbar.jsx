import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [dropdown, setDropdown] = useState({ findBlood: false, donate: false });

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 shadow-sm bg-white relative">
  <span className="font-semibold text-2xl tracking-wide">♦ Atria</span>
  <div className="flex gap-8 items-center">
        <Link to="/">Home</Link>

        <div
          className="relative"
          onMouseEnter={() => setDropdown(d => ({ ...d, findBlood: true }))}
          onMouseLeave={() => setDropdown(d => ({ ...d, findBlood: false }))}
        >
          <button className="hover:underline">Find Blood</button>
          <div
            className={`absolute left-0 top-full mt-1 bg-white border rounded shadow py-2 w-48 z-10 flex flex-col transition-all duration-300 ease-in-out origin-top
              ${dropdown.findBlood ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
          >
            <Link
              to="/blood-availability"
              className="text-left px-4 py-2 hover:bg-gray-100"
            >
              Blood Availability
            </Link>
            <Link
              to="/blood-center-directory"
              className="text-left px-4 py-2 hover:bg-gray-100"
            >
              Blood Center Directory
            </Link>
          </div>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setDropdown(d => ({ ...d, donate: true }))}
          onMouseLeave={() => setDropdown(d => ({ ...d, donate: false }))}
        >
          <button className="hover:underline">Donate</button>
          <div
            className={`absolute left-0 top-full mt-1 bg-white border rounded shadow py-2 w-52 z-10 flex flex-col transition-all duration-300 ease-in-out origin-top
              ${dropdown.donate ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
          >
            <Link
              to="/donation-camps"
              className="text-left px-4 py-2 hover:bg-gray-100"
            >
              Blood Donation Camps
            </Link>
            <Link
              to="/donor-login"
              className="text-left px-4 py-2 hover:bg-gray-100"
            >
              Donor Login
            </Link>
            <Link
              to="/about-blood-donation"
              className="text-left px-4 py-2 hover:bg-gray-100"
            >
              About Blood Donation
            </Link>
          </div>
        </div>

        <Link to="#">Blood Banks</Link>
        <Link to="#">Dashboard</Link>
      </div>
    </nav>
  );
}
