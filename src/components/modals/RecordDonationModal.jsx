"use client"

import { useState } from "react"
import { X } from "lucide-react"

const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]

export default function RecordDonationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    donorName: "",
    donorId: "",
    bloodType: "O+",
    units: 1,
    donationDate: new Date().toISOString().split("T")[0],
    donorPhone: "",
    donorEmail: "",
    healthStatus: "Healthy",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data.success !== true) {
        const msg = (data && data.msg) || 'Failed to record donation'
        alert(msg)
        return
      }
      alert(`Donation recorded from ${formData.donorName} - ${formData.units} units of ${formData.bloodType}`)
      setFormData({
        donorName: "",
        donorId: "",
        bloodType: "O+",
        units: 1,
        donationDate: new Date().toISOString().split("T")[0],
        donorPhone: "",
        donorEmail: "",
        healthStatus: "Healthy",
      })
      onClose()
    } catch (err) {
      alert('Network error while recording donation')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-fade-in">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Record New Donation</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Donor Name *</label>
            <input
              type="text"
              name="donorName"
              value={formData.donorName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter donor name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Donor ID</label>
            <input
              type="text"
              name="donorId"
              value={formData.donorId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter donor ID"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type *</label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {bloodTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Units *</label>
              <input
                type="number"
                name="units"
                value={formData.units}
                onChange={handleChange}
                min="1"
                max="5"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Donation Date *</label>
            <input
              type="date"
              name="donationDate"
              value={formData.donationDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Donor Phone</label>
            <input
              type="tel"
              name="donorPhone"
              value={formData.donorPhone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Donor Email</label>
            <input
              type="email"
              name="donorEmail"
              value={formData.donorEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Health Status</label>
            <select
              name="healthStatus"
              value={formData.healthStatus}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Healthy">Healthy</option>
              <option value="Minor Issues">Minor Issues</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
            >
              Record Donation
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
