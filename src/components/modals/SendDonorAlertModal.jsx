"use client"

import { useState } from "react"
import { X } from "lucide-react"

const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]

export default function SendDonorAlertModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    bloodType: "O+",
    urgency: "High",
    unitsNeeded: 5,
    message: "",
    recipientGroup: "All Donors",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data.success !== true) {
        const msg = (data && data.msg) || 'Failed to send donor alert'
        alert(msg)
        return
      }
      alert(`Alert sent to ${formData.recipientGroup} for ${formData.unitsNeeded} units of ${formData.bloodType}`)
      setFormData({
        bloodType: "O+",
        urgency: "High",
        unitsNeeded: 5,
        message: "",
        recipientGroup: "All Donors",
      })
      onClose()
    } catch (err) {
      alert('Network error while sending donor alert')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-fade-in">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Send Donor Alert</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type Needed *</label>
            <select
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {bloodTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urgency Level *</label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Units Needed *</label>
              <input
                type="number"
                name="unitsNeeded"
                value={formData.unitsNeeded}
                onChange={handleChange}
                min="1"
                max="50"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Group *</label>
            <select
              name="recipientGroup"
              value={formData.recipientGroup}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All Donors">All Donors</option>
              <option value="Matching Blood Type">Matching Blood Type Only</option>
              <option value="Active Donors">Active Donors</option>
              <option value="Recent Donors">Recent Donors</option>
              <option value="VIP Donors">VIP Donors</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alert Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter alert message for donors"
              rows="4"
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Alert Summary:</strong> {formData.unitsNeeded} units of {formData.bloodType} needed (
              {formData.urgency} priority)
            </p>
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
              className="flex-1 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Send Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
