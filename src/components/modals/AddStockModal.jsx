"use client"

import { useState } from "react"

const CloseIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
)

export default function AddStockModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    type: "O+",
    units: "",
    collectionDate: "",
    expiryDate: "",
    location: "",
    donorId: "",
    notes: "",
  })

  const [errors, setErrors] = useState({})

  const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]

  const validateForm = () => {
    const newErrors = {}
    if (!formData.units || formData.units <= 0) newErrors.units = "Units must be greater than 0"
    if (!formData.collectionDate) newErrors.collectionDate = "Collection date is required"
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required"
    if (!formData.location) newErrors.location = "Location is required"
    if (!formData.donorId) newErrors.donorId = "Donor ID is required"

    if (formData.collectionDate && formData.expiryDate) {
      if (new Date(formData.expiryDate) <= new Date(formData.collectionDate)) {
        newErrors.expiryDate = "Expiry date must be after collection date"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
      setFormData({
        type: "O+",
        units: "",
        collectionDate: "",
        expiryDate: "",
        location: "",
        donorId: "",
        notes: "",
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Add New Stock</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Blood Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Blood Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {bloodTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Units */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Units *</label>
            <input
              type="number"
              name="units"
              value={formData.units}
              onChange={handleChange}
              placeholder="Enter number of units"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.units ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-red-500"}`}
            />
            {errors.units && <p className="text-red-500 text-xs mt-1">{errors.units}</p>}
          </div>

          {/* Collection Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Collection Date *</label>
            <input
              type="date"
              name="collectionDate"
              value={formData.collectionDate}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.collectionDate ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-red-500"}`}
            />
            {errors.collectionDate && <p className="text-red-500 text-xs mt-1">{errors.collectionDate}</p>}
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Expiry Date *</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.expiryDate ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-red-500"}`}
            />
            {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Fridge A-1"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.location ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-red-500"}`}
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>

          {/* Donor ID */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Donor ID *</label>
            <input
              type="text"
              name="donorId"
              value={formData.donorId}
              onChange={handleChange}
              placeholder="e.g., D-123"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.donorId ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-red-500"}`}
            />
            {errors.donorId && <p className="text-red-500 text-xs mt-1">{errors.donorId}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 font-semibold"
            >
              Add Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
