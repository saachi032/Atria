import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [dropdown, setDropdown] = useState({ findBlood: false, donate: false });

  return (
    <nav className="flex items-center justify-between px-8 py-4 shadow-sm bg-white relative">
      <span className="font-semibold">♦ Atria</span>
      <div className="flex gap-8 items-center">
        <Link to="/">Home</Link>
        <div
          className="relative"
          onMouseEnter={() => setDropdown(d => ({ ...d, findBlood: true }))}
          onMouseLeave={() => setDropdown(d => ({ ...d, findBlood: false }))}
        >
          <button className="hover:underline">Find Blood</button>
          {dropdown.findBlood && (
            <div className="absolute left-0 top-full mt-1 bg-white border rounded shadow py-2 w-36 z-10 flex flex-col">
              <button
                className="text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => navigate('/register')}
              >Register</button>
              <button
                className="text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => alert('Login modal or page')}
              >Login</button>
            </div>
          )}
        </div>
        <div
          className="relative"
          onMouseEnter={() => setDropdown(d => ({ ...d, donate: true }))}
          onMouseLeave={() => setDropdown(d => ({ ...d, donate: false }))}
        >
          <button className="hover:underline">Donate</button>
          {dropdown.donate && (
            <div className="absolute left-0 top-full mt-1 bg-white border rounded shadow py-2 w-36 z-10 flex flex-col">
              <button
                className="text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => navigate('/register')}
              >Register</button>
              <button
                className="text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => alert('Login modal or page')}
              >Login</button>
            </div>
          )}
        </div>
        <Link to="#">Blood Banks</Link>
        <Link to="#">Dashboard</Link>
      </div>
    </nav>
  );
}
