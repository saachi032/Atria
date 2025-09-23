import { Routes, Route } from "react-router-dom";

import RegisterForm from "./components/RegisterForm";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";

export default function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterForm />} />
        {/* Add more routes here */}
      </Routes>
    </div>
  );
}

