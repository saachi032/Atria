import { useState } from "react";
import nursePhoto from "../assets/nurseAssist.png";

const bloodInfo = {
  "O-": {
    donors: "All blood types",
    receivers: "O-",
    impact: "High",
    fact: "O- blood is known as the 'universal donor' because it can be safely transfused into recipients of all blood types. This makes it crucial in emergency situations when a patient's blood type is unknown."
  },
  "O+": {
    donors: "O+, O-, A+, A-, B+, B-, AB+, AB-",
    receivers: "O+, A+, B+, AB+",
    impact: "Common",
    fact: "O+ is the most common blood type and is helpful for most transfusions, but not universal."
  },
  "A-": {
    donors: "A-, O-",
    receivers: "A-, A+, AB-, AB+",
    impact: "Rare",
    fact: "A- blood is rare and sought after for its versatility in emergencies."
  },
  "A+": {
    donors: "A+, A-, O+, O-",
    receivers: "A+, AB+",
    impact: "Common",
    fact: "A+ is a common blood type and can receive from many groups."
  },
  "B-": {
    donors: "B-, O-",
    receivers: "B-, B+, AB-, AB+",
    impact: "Rare",
    fact: "B- is one of the least common types, making donations crucial."
  },
  "B+": {
    donors: "B+, B-, O+, O-",
    receivers: "B+, AB+",
    impact: "Less common",
    fact: "B+ can receive from both B and O donors."
  },
  "AB-": {
    donors: "AB-, A-, B-, O-",
    receivers: "AB-, AB+",
    impact: "Universal plasma donor",
    fact: "AB- plasma can be given to any patient; blood is less common."
  },
  "AB+": {
    donors: "Everyone",
    receivers: "AB+",
    impact: "Universal receiver",
    fact: "AB+ patients are universal recipients—they can receive blood from any group."
  }
};

const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];
const hospitalData = [
  { name: "A Hospital", total: 120, units: [20, 15, 5, 30, 10, 15, 10, 15] },
  { name: "B Hospital", total: 95, units: [12, 20, 10, 18, 8, 12, 7, 8] },
  { name: "E Hospital", total: 120, units: [20, 20, 15, 30, 10, 15, 5, 5] },
  { name: "C Hospital", total: 150, units: [22, 22, 25, 30, 15, 18, 8, 10] },
  { name: "D Hospital", total: 80, units: [10, 8, 5, 20, 5, 10, 12, 10] },
  { name: "E Hospital", total: 120, units: [20, 15, 10, 20, 18, 15, 12, 10] },
];

export default function LandingPage() {
  const [selectedType, setSelectedType] = useState("O-");

  return (
    <main className="bg-[#FAFAFA] min-h-screen pt-8 max-w-7xl mx-auto px-6 space-y-12">

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto mb-12 relative rounded-xl overflow-hidden bg-white shadow-lg flex items-center justify-center" style={{ minHeight: "400px" }}>
        <img
          src={nursePhoto}
          alt="Be the Lifeline"
          className="w-full h-[380px] md:h-[480px] object-cover rounded-xl"
        />
        <div className="absolute left-0 bottom-0 w-full px-6 py-6 bg-black/50 rounded-b-xl flex flex-col justify-center">
          <h1 className="text-white text-4xl font-extrabold mb-2 drop-shadow-sm">Be the Lifeline</h1>
          <p className="text-white text-lg drop-shadow-sm">
            One Donation, Infinite Possibilities
          </p>
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
            <p className="text-gray-600 text-base mb-8">Dive into blood type compatibility and see how your donation makes a difference</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { grp: "O-", label: "Universal Donor, 7%" },
                { grp: "O+", label: "Most Common, 37%" },
                { grp: "A-", label: "Rare donor type, 2%" },
                { grp: "A+", label: "Common type,34%" },
                { grp: "B-", label: "Rare type, 1%" },
                { grp: "B+", label: "Less common, 10%" },
                { grp: "AB-", label: "Universal Plasma Donor, 1%" },
                { grp: "AB+", label: "Universal Blood Receiver, 4%" },
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
              <li><strong>Who can donate to them:</strong> {bloodInfo[selectedType].donors}</li>
              <li><strong>Who they can donate to:</strong> {bloodInfo[selectedType].receivers}</li>
              <li><strong>Impact Potential:</strong> {bloodInfo[selectedType].impact}</li>
            </ul>
            <p className="italic text-sm text-gray-600">
              Fun Fact: {bloodInfo[selectedType].fact}
            </p>
          </div>
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
            { label: "Blood Types", value: 8 },
            { label: "Lives Saved Per Donation", value: 3 },
            { label: "Days Between Donations", value: 56 },
            { label: "Minutes to Donate", value: 10 },
          ].map(({ label, value }) => (
            <div key={label} className="bg-red-50 p-8 rounded-lg font-semibold shadow text-center text-lg">
              <h3 className="mb-2 text-gray-600">{label}</h3>
              <span className="text-2xl font-extrabold text-gray-900">{value}</span>
            </div>
          ))}
        </div>
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold mb-6">Key Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Lives Saved", value: "10,000" },
              { label: "Active Donors", value: "1000" },
              { label: "Partner Hospitals", value: "100" },
              { label: "Units Donated", value: "10,000" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white p-6 rounded-lg shadow-md text-center border border-gray-200 font-semibold">
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
          At Atria, we're committed to providing a seamless and impactful blood donation experience. Our platform is designed with your safety and convenience in mind, ensuring that every donation makes a difference.
        </p>
      </section>

      {/* Blood Availability Overview */}
      <section className="max-w-7xl mx-auto py-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Blood Availability Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {hospitalData.map((hospital, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col">
              <h3 className="font-semibold mb-2">{hospital.name}</h3>
              <div className="text-3xl font-bold mb-2">{hospital.total} units</div>
              <div className="text-sm text-gray-600 mb-4">Total Blood Units</div>
              <div className="flex items-end gap-2 mt-auto mb-2 h-20">
                {hospital.units.map((unit, i) => (
                  <div
                    key={bloodTypes[i]}
                    className="flex flex-col items-center justify-end"
                    style={{ width: "18px" }}
                  >
                    <div
                      style={{
                        height: unit < 5 ? "10%" : unit < 15 ? "50%" : "90%",
                        backgroundColor: "#F9A8D4",
                        borderRadius: "8px",
                        width: "100%",
                        marginBottom: "4px",
                        transition: "height 0.3s"
                      }}
                    />
                    <span className="text-xs text-gray-500">{bloodTypes[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
