"use client"


import { useState } from "react"
import nursePhoto from "../assets/nurseAssist.png";
import Footer from "./Footer/Footer"; // Import the Footer component


const bloodInfo = {
  "O-": {
    donors: "All blood types",
    receivers: "O-",
    impact: "High",
    fact: "O- blood is known as the 'universal donor' because it can be safely transfused into recipients of all blood types. This makes it crucial in emergency situations when a patient's blood type is unknown.",
  },
  "O+": {
    donors: "O+, O-, A+, A-, B+, B-, AB+, AB-",
    receivers: "O+, A+, B+, AB+",
    impact: "Common",
    fact: "O+ is the most common blood type and is helpful for most transfusions, but not universal.",
  },
  "A-": {
    donors: "A-, O-",
    receivers: "A-, A+, AB-, AB+",
    impact: "Rare",
    fact: "A- blood is rare and sought after for its versatility in emergencies.",
  },
  "A+": {
    donors: "A+, A-, O+, O-",
    receivers: "A+, AB+",
    impact: "Common",
    fact: "A+ is a common blood type and can receive from many groups.",
  },
  "B-": {
    donors: "B-, O-",
    receivers: "B-, B+, AB-, AB+",
    impact: "Rare",
    fact: "B- is one of the least common types, making donations crucial.",
  },
  "B+": {
    donors: "B+, B-, O+, O-",
    receivers: "B+, AB+",
    impact: "Less common",
    fact: "B+ can receive from both B and O donors.",
  },
  "AB-": {
    donors: "AB-, A-, B-, O-",
    receivers: "AB-, AB+",
    impact: "Universal plasma donor",
    fact: "AB- plasma can be given to any patient; blood is less common.",
  },
  "AB+": {
    donors: "Everyone",
    receivers: "AB+",
    impact: "Universal receiver",
    fact: "AB+ patients are universal recipients—they can receive blood from any group.",
  },
}


const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]


// Updated Blood Bank flows with two subsections
const bloodBankFlows = [
  {
    section: "As a Donor",
    flow: [
      { icon: "👤", text: "Login" },
      { icon: "🔍", text: "View Requests" },
      { icon: "❤️", text: "Donate" },
    ],
  },
  {
    section: "As a Receiver",
    flow: [
      { icon: "👤", text: "Login" },
      { icon: "📦", text: "Manage Inventory" },
      { icon: "🩸", text: "Request Blood" },
      { icon: "⏰", text: "Schedule Donor" },
      { icon: "✅", text: "Collect Blood" },
    ],
  },
]


// Tabs for How to Use Atria
const flowchartTabs = [
  {
    key: "Hospitals",
    label: "Hospitals",
    flow: [
      { icon: "🏥", text: "Login" },
      { icon: "📦", text: "Manage Inventory" },
      { icon: "🩸", text: "Raise Request for Blood" },
      { icon: "⏰", text: "Allot Time Slot to Donors" },
      { icon: "✅", text: "Completed Taking Blood" },
    ],
  },
  {
    key: "Donors",
    label: "Donors",
    flow: [
      { icon: "👤", text: "Login" },
      { icon: "🔍", text: "Browse Requirements" },
      { icon: "📅", text: "Select Time Slot & Place" },
      { icon: "❤️", text: "Visit and Donate" },
    ],
  },
  {
    key: "Blood Banks",
    label: "Blood Banks",
    flow: bloodBankFlows, // SPECIAL: this tab has two subsections
  },
]


// Updated FAQ List
const faqList = [
  {
    q: "Who can donate blood?",
    a: "Healthy individuals aged 18–65 years, weighing at least 50 kg, and free from any major illness can donate blood.",
    icon: "👤",
    category: "eligibility",
  },
  {
    q: "How often can I donate blood?",
    a: (
      <span>
        <strong>Men:</strong> Every 3 months (90 days)
        <br />
        <strong>Women:</strong> Every 4 months (120 days)
      </span>
    ),
    icon: "📅",
    category: "frequency",
  },
  {
    q: "Is blood donation safe?",
    a: "Yes ✅. A new, sterile needle is used each time, making the process completely safe.",
    icon: "🛡️",
    category: "safety",
  },
  {
    q: "How long does the donation process take?",
    a: "The actual donation takes 10–15 minutes. Including registration and rest, the whole process takes about 30–45 minutes.",
    icon: "⏱️",
    category: "process",
  },
  {
    q: "How much blood is taken during donation?",
    a: "About 350–450 ml, which is less than 10% of your total blood volume.",
    icon: "🩸",
    category: "process",
  },
  {
    q: "Will I feel weak after donating blood?",
    a: "Most donors feel fine. Some may feel light-headed briefly, but rest, hydration, and a snack afterward help you recover quickly.",
    icon: "💪",
    category: "recovery",
  },
  {
    q: "What should I do before donating blood?",
    a: (
      <ul className="list-disc list-inside space-y-1">
        <li>Eat a light meal (avoid fatty foods).</li>
        <li>Drink plenty of water.</li>
        <li>Get a good night's sleep.</li>
      </ul>
    ),
    icon: "📋",
    category: "preparation",
  },
  {
    q: "Who should not donate blood?",
    a: "People with recent infections, low hemoglobin, chronic diseases, or risky medical history (like hepatitis, HIV, malaria, etc.) should not donate.",
    icon: "⚠️",
    category: "eligibility",
  },
  {
    q: "How long does it take to replace the donated blood?",
    a: (
      <span>
        <strong>Plasma:</strong> within 24 hours
        <br />
        <strong>Red blood cells:</strong> about 4–6 weeks
        <br />
        <strong>Platelets:</strong> within a few days
      </span>
    ),
    icon: "🔄",
    category: "recovery",
  },
  {
    q: "Why is blood donation important?",
    a: "Every donation can save up to 3 lives. Blood is needed for surgeries, accident victims, cancer patients, and people with blood disorders.",
    icon: "❤️",
    category: "impact",
  },
]


function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null)
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("all")


  const categories = [
    { key: "all", label: "All Questions", icon: "📋" },
    { key: "eligibility", label: "Eligibility", icon: "👤" },
    { key: "process", label: "Process", icon: "⚙️" },
    { key: "safety", label: "Safety", icon: "🛡️" },
    { key: "recovery", label: "Recovery", icon: "💪" },
    { key: "preparation", label: "Preparation", icon: "📝" },
    { key: "impact", label: "Impact", icon: "❤️" },
  ]


  const filteredFAQs = selectedCategory === "all" ? faqList : faqList.filter((faq) => faq.category === selectedCategory)


  return (
    <section className="max-w-4xl mx-auto py-16 px-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full mb-4">
          <span className="text-2xl">❓</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Get answers to common questions about blood donation and learn how you can make a difference.
        </p>
      </div>


      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-10 p-2 bg-gray-50 rounded-2xl">
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key)}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm flex items-center gap-2 transform hover:scale-105
              ${
                selectedCategory === category.key
                  ? "bg-red-500 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 shadow-sm"
              }`}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>


      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQs.map((faq, idx) => (
          <div
            key={faq.q}
            className={`bg-white border-2 rounded-2xl shadow-sm transition-all duration-300 transform hover:shadow-lg hover:-translate-y-1 overflow-hidden
              ${openIdx === idx ? "border-red-200 shadow-lg" : "border-gray-100"}
              ${hoveredIdx === idx ? "border-red-300" : ""}`}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <button
              className="w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none group cursor-pointer"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              aria-expanded={openIdx === idx}
              >
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 transform group-hover:scale-110
                    ${
                      openIdx === idx
                        ? "bg-red-500 text-white shadow-lg"
                        : "bg-red-50 text-red-500 group-hover:bg-red-100"
                    }`}
                >
                  {faq.icon}
                </div>
                <span
                  className={`text-lg font-semibold transition-colors duration-300 text-balance
                    ${openIdx === idx ? "text-red-600" : "text-gray-800 group-hover:text-red-600"}`}
                >
                  {faq.q}
                </span>
              </div>
              <div
                className={`ml-4 transition-all duration-300 transform
                  ${openIdx === idx ? "rotate-180 text-red-500" : "text-gray-400 group-hover:text-red-500"}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>


            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden
                ${openIdx === idx ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="px-6 pb-6">
                <div className="bg-gradient-to-r from-red-50 to-red-25 rounded-xl p-4 border-l-4 border-red-200">
                  <div className="text-gray-700 text-base leading-relaxed">{faq.a}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-8 border border-red-200">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Still have questions?</h3>
          <p className="text-gray-600 mb-4">
            Our team is here to help you understand the donation process and address any concerns.
          </p>
          <button className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  )
}


export default function LandingPage() {
  const [selectedType, setSelectedType] = useState("O-")
  const [activeTab, setActiveTab] = useState("Hospitals")
  const [bbSubsection, setBbSubsection] = useState("As a Donor")


  // For Blood Banks, handle sub-tab
  const renderBloodBankSection = () => (
    <div className="w-full">
      <div className="flex justify-center mb-8">
        <div className="flex bg-white p-2 rounded-xl shadow-sm border border-blue-200">
          {bloodBankFlows.map((sec) => (
            <button
              key={sec.section}
              onClick={() => setBbSubsection(sec.section)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-xs md:text-sm transform hover:scale-105
                ${
                  bbSubsection === sec.section
                    ? "bg-blue-500 text-white shadow-md scale-105"
                    : "bg-transparent text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
            >
              {sec.section}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-row items-center space-x-4 md:space-x-6 flex-wrap justify-center">
          {bloodBankFlows
            .find((sec) => sec.section === bbSubsection)
            .flow.map((step, idx, arr) => (
              <div key={step.text} className="flex items-center">
                <div className="flex flex-col items-center group">
                  <div className="relative">
                    <div className="rounded-full bg-white text-blue-600 w-16 h-16 flex items-center justify-center text-2xl font-bold border-3 border-blue-200 mb-3 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-110 group-hover:border-blue-300">
                      {step.icon}
                    </div>
                    <div className="absolute inset-0 rounded-full bg-blue-200 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse"></div>
                  </div>
                  <span className="text-sm md:text-base text-gray-700 text-center font-medium w-28 leading-tight">
                    {step.text}
                  </span>
                </div>
                {idx !== arr.length - 1 && (
                  <div className="mx-3 md:mx-4 flex items-center">
                    <svg 
                      className="w-12 h-6 text-blue-400 transition-all duration-300 hover:text-blue-500" 
                      viewBox="0 0 48 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M0 12H44M44 12L36 4M44 12L36 20" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  )


  return (
    <>
      <main className="bg-[#FAFAFA] min-h-screen pt-8 max-w-7xl mx-auto px-6 space-y-12">
        {/* Hero Section */}
        <section
          className="max-w-5xl mx-auto mb-12 mt-12 relative rounded-xl overflow-hidden bg-white shadow-lg flex items-center justify-center"
          style={{ minHeight: "400px" }}
        >
          <img
            src={nursePhoto}
            alt="Be the Lifeline"
            className="w-full h-[380px] md:h-[480px] object-cover rounded-xl"
          />
          <div className="absolute left-0 bottom-0 w-full px-6 py-6 bg-black/50 rounded-b-xl flex flex-col justify-center">
            <h1 className="text-white text-4xl font-extrabold mb-2 drop-shadow-sm">Be the Lifeline</h1>
            <p className="text-white text-lg drop-shadow-sm">One Donation, Infinite Possibilities</p>
          </div>
        </section>


        {/* Join Community Banner */}
        <section className="bg-red-100 py-4 text-center rounded-xl text-gray-900 text-base font-semibold shadow-sm mb-12 mt-8">
          Join 25,000+ Life Savers
        </section>


        {/* Blood Donation Info */}
        <section className="bg-white rounded-xl p-8 shadow border border-gray-200">
          <div className="md:flex md:gap-12">
            {/* Blood Types Grid */}
            <div className="md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Learn About Blood Donation</h2>
              <p className="text-gray-600 text-base mb-8">
                Dive into blood type compatibility and see how your donation makes a difference
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  {
                    grp: "O-",
                    label: "Universal Donor, 7%",
                  },
                  {
                    grp: "O+",
                    label: "Most Common, 37%",
                  },
                  {
                    grp: "A-",
                    label: "Rare donor type, 2%",
                  },
                  {
                    grp: "A+",
                    label: "Common type,34%",
                  },
                  {
                    grp: "B-",
                    label: "Rare type, 1%",
                  },
                  {
                    grp: "B+",
                    label: "Less common, 10%",
                  },
                  {
                    grp: "AB-",
                    label: "Universal Plasma Donor, 1%",
                  },
                  {
                    grp: "AB+",
                    label: "Universal Blood Receiver, 4%",
                  },
                ].map(({ grp, label }) => (
                  <button
                    key={grp}
                    onClick={() => setSelectedType(grp)}
                    className={`bg-white p-6 rounded-xl shadow-md flex flex-col items-center gap-3 transition hover:bg-red-50 border-2 text-center
                      ${selectedType === grp ? "border-red-500" : "border-gray-300"}`}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="text-2xl md:text-3xl font-black text-red-700">{grp}</span>
                    <span className="text-sm text-gray-700">{label}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Blood Type Information */}
            <div className="md:w-1/3 md:pl-2 flex flex-col justify-start mt-8 md:mt-0">
              <h3 className="text-xl font-bold mb-5">Blood Type Information</h3>
              <p className="text-gray-700 mb-5">
                Select a blood type to learn more about its compatibility, donation potential, and interesting facts.
              </p>
              <ul className="mb-6 space-y-3 list-disc list-inside text-gray-800">
                <li>
                  <strong>Who can donate to them:</strong> {bloodInfo[selectedType].donors}
                </li>
                <li>
                  <strong>Who they can donate to:</strong> {bloodInfo[selectedType].receivers}
                </li>
                <li>
                  <strong>Impact Potential:</strong> {bloodInfo[selectedType].impact}
                </li>
              </ul>
              <p className="italic text-sm text-gray-600">Fun Fact: {bloodInfo[selectedType].fact}</p>
            </div>
          </div>
        </section>


        {/* How to Use Atria Section */}
        <section className="bg-white rounded-xl p-8 shadow border border-gray-200 overflow-hidden">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full mb-4">
              <span className="text-2xl">🩸</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              How to Use Atria
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Simple steps to connect donors with those in need through our platform
            </p>
          </div>


          <div className="flex justify-center mb-12">
            <div className="flex bg-gray-50 p-2 rounded-2xl shadow-inner">
              {flowchartTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base transform hover:scale-105 relative overflow-hidden
                    ${
                      activeTab === tab.key
                        ? "bg-red-500 text-white shadow-lg scale-105"
                        : "bg-transparent text-gray-700 hover:bg-red-50 hover:text-red-600"
                    }`}
                  style={{ minWidth: "120px" }}
                >
                  {activeTab === tab.key && (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 rounded-xl animate-pulse"></div>
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>


          <div className="bg-gradient-to-br from-gray-50 to-red-50 rounded-2xl p-8 border border-red-100">
            {activeTab === "Blood Banks" ? (
              <div className="w-full">
                <div className="flex justify-center mb-8">
                  <div className="flex bg-white p-2 rounded-xl shadow-sm border border-red-200">
                    {bloodBankFlows.map((sec) => (
                      <button
                        key={sec.section}
                        onClick={() => setBbSubsection(sec.section)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-xs md:text-sm transform hover:scale-105
                          ${
                            bbSubsection === sec.section
                              ? "bg-red-500 text-white shadow-md scale-105"
                              : "bg-transparent text-gray-700 hover:bg-red-50 hover:text-red-600"
                          }`}
                      >
                        {sec.section}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="flex flex-row items-center space-x-4 md:space-x-6 flex-wrap justify-center">
                    {bloodBankFlows
                      .find((sec) => sec.section === bbSubsection)
                      .flow.map((step, idx, arr) => (
                        <div key={step.text} className="flex items-center">
                          <div className="flex flex-col items-center group">
                            <div className="relative">
                              <div className="rounded-full bg-white text-red-600 w-20 h-20 flex items-center justify-center text-3xl font-bold border-3 border-red-200 mb-3 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-110 group-hover:border-red-400 cursor-pointer">
                                {step.icon}
                              </div>
                              <div className="absolute inset-0 rounded-full bg-red-200 opacity-0 group-hover:opacity-30 transition-opacity duration-300 animate-pulse"></div>
                            </div>
                            <span className="text-sm md:text-base text-gray-700 text-center font-medium w-32 leading-tight group-hover:text-red-600 transition-colors duration-300">
                              {step.text}
                            </span>
                          </div>
                          {idx !== arr.length - 1 && (
                            <div className="mx-3 md:mx-4 flex items-center">
                              <svg 
                                className="w-12 h-6 text-red-400 transition-all duration-300 hover:text-red-500" 
                                viewBox="0 0 48 24" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path 
                                  d="M0 12H44M44 12L36 4M44 12L36 20" 
                                  stroke="currentColor" 
                                  strokeWidth="2.5" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="flex flex-row items-center space-x-4 md:space-x-6 flex-wrap justify-center">
                  {flowchartTabs
                    .find((tab) => tab.key === activeTab)
                    .flow.map((step, idx, arr) => (
                      <div key={step.text} className="flex items-center">
                        <div className="flex flex-col items-center group">
                          <div className="relative">
                            <div className="rounded-full bg-white text-red-600 w-20 h-20 flex items-center justify-center text-3xl font-bold border-3 border-red-200 mb-3 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-110 group-hover:border-red-400 cursor-pointer">
                              {step.icon}
                            </div>
                            <div className="absolute inset-0 rounded-full bg-red-200 opacity-0 group-hover:opacity-30 transition-opacity duration-300 animate-pulse"></div>
                          </div>
                          <span className="text-sm md:text-base text-gray-700 text-center font-medium w-32 leading-tight group-hover:text-red-600 transition-colors duration-300">
                            {step.text}
                          </span>
                        </div>
                        {idx !== arr.length - 1 && (
                          <div className="mx-3 md:mx-4 flex items-center">
                            <svg 
                              className="w-12 h-6 text-red-400 transition-all duration-300 hover:text-red-500" 
                              viewBox="0 0 48 24" 
                              fill="none" 
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path 
                                d="M0 12H44M44 12L36 4M44 12L36 20" 
                                stroke="currentColor" 
                                strokeWidth="2.5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </section>


        {/* Impact Section */}
        <section className="bg-white rounded-xl p-8 shadow border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Impact Together</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12 text-lg">
            Every drop counts. See the collective impact of our community's contributions.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 max-w-4xl mx-auto gap-8 mb-12">
            {[
              {
                label: "Blood Types",
                value: 8,
              },
              {
                label: "Lives Saved Per Donation",
                value: 3,
              },
              {
                label: "Days Between Donations",
                value: 56,
              },
              {
                label: "Minutes to Donate",
                value: 10,
              },
            ].map(({ label, value }) => (
              <div key={label} className="bg-red-50 p-8 rounded-lg font-semibold shadow text-center text-lg">
                <h3 className="mb-2 text-gray-600">{label}</h3>
                <p className="text-2xl font-extrabold text-gray-900">{value}</p>
              </div>
            ))}
          </div>
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold mb-6">Key Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  label: "Lives Saved",
                  value: "10,000",
                },
                {
                  label: "Active Donors",
                  value: "1000",
                },
                {
                  label: "Partner Hospitals",
                  value: "100",
                },
                {
                  label: "Units Donated",
                  value: "10,000",
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-white p-6 rounded-lg shadow-md text-center border border-gray-200 font-semibold"
                >
                  <h4 className="mb-1 text-gray-700">{label}</h4>
                  <p className="text-2xl font-extrabold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Why Choose Section */}
        <section className="max-w-4xl mx-auto text-center px-6 pb-12">
          <h3 className="text-xl font-bold mb-4">Why Choose Atria?</h3>
          <p className="leading-relaxed text-gray-700 text-base">
            At Atria, we're committed to providing a seamless and impactful blood donation experience. Our platform is
            designed with your safety and convenience in mind, ensuring that every donation makes a difference.
          </p>
        </section>


        {/* FAQ Section */}
        <FAQSection />
      </main>
      <Footer /> {/* Add the Footer component here */}
    </>
  )
}
