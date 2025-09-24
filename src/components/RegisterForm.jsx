// src/components/RegisterForm.jsx
import { useState } from "react";

export default function RegisterForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    age: "",
    bloodGroup: "",
    district: "",
    state: "",
    pin: "",
    lastDonationMonth: "",
    lastDonationYear: "",
    agreed: false,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: Handle form submission logic here
    alert("Form submitted!");
  }

  return (
    <div className="max-w-3xl mx-auto my-8 rounded-xl bg-white drop-shadow-md">
      <div className="bg-gradient-to-r from-red-900 to-red-700 rounded-t-xl px-8 py-6">
        <h2 className="text-white text-2xl font-bold">Register As Donor</h2>
      </div>
      <form onSubmit={handleSubmit} className="px-8 py-6">
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <div className="flex gap-2">
              <input
                name="firstName"
                placeholder="First"
                value={form.firstName}
                onChange={handleChange}
                className="w-1/2 border rounded px-3 py-2"
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                className="w-1/2 border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-4">
          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
          <input
            name="email"
            placeholder="E mail"
            value={form.email}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <textarea
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              rows={2}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="flex gap-2">
            <input
              name="age"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-1/4"
            />
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-3/4"
            >
              <option value="">Blood Group</option>
              <option>A+</option>
              <option>B+</option>
              <option>AB+</option>
              <option>O+</option>
              <option>A-</option>
              <option>B-</option>
              <option>AB-</option>
              <option>O-</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div className="flex gap-2">
            <select
              name="district"
              value={form.district}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-1/2"
            >
              <option value="">District</option>
              <option>Hyderabad</option>
              <option>Medchal</option>
              {/* Add more districts */}
            </select>
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-1/2"
            >
              <option value="">State</option>
              <option>Telangana</option>
              <option>Andhra Pradesh</option>
              {/* Add more states */}
            </select>
          </div>
          <input
            name="pin"
            placeholder="PinCode"
            value={form.pin}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-6 mb-4">
          <input
            name="lastDonationMonth"
            placeholder="Month"
            value={form.lastDonationMonth}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
          <input
            name="lastDonationYear"
            placeholder="Year"
            value={form.lastDonationYear}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
        </div>
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            name="agreed"
            checked={form.agreed}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-gray-700 text-sm">Terms and conditionsssss.</label>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-white border px-6 py-2 rounded-lg flex items-center shadow gap-2"
          >
            Submit
            <span className="inline-block text-xl">&#8635;</span>
          </button>
        </div>
      </form>
    </div>
  );
}
