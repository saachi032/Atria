import React from 'react';
import BloodBankSidebar from './BloodBankSidebar';

const parentHospitals = [
  { name: "Metro Hospital", city: "Mumbai", contact: "022-14567890", email: "contact@metrohosp.com", address: "Sector-8, Navi Mumbai" },
  { name: "HealthPlus Clinic", city: "Pune", contact: "020-26654321", email: "info@healthplus.com", address: "Shivaji Nagar, Pune" },
  { name: "Sunrise Hospital", city: "Nashik", contact: "0253-123456", email: "support@sunrisehosp.com", address: "Ring Road, Nashik" },
  { name: "City General", city: "Nagpur", contact: "0712-782322", email: "citygen@hospital.com", address: "Civil Lines, Nagpur" },
];

export default function BloodBankParentHospitals() {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <BloodBankSidebar />
      <main className="flex-1 p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Parent Hospitals</h2>
        <p className="mb-8 text-gray-500 text-lg">Blood bank network: contact, manage, and communicate with connected hospitals below.</p>
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Hospital Name</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">City</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Contact</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Email</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Address</th>
              </tr>
            </thead>
            <tbody>
              {parentHospitals.map((h, i) => (
                <tr key={i} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-bold">{h.name}</td>
                  <td className="py-3 px-4">{h.city}</td>
                  <td className="py-3 px-4">{h.contact}</td>
                  <td className="py-3 px-4">{h.email}</td>
                  <td className="py-3 px-4">{h.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
