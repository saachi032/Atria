// src/components/LandingPage.jsx
import nursePhoto from "../assets/nurseAssist.png";

export default function LandingPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-12">

      {/* Hero Section */}
      <section className="relative rounded-xl overflow-hidden">
        <img
          src={nursePhoto}
          alt="Be the Lifeline"
          className="w-full h-[340px] object-cover rounded-xl"
        />
        <div className="absolute left-8 bottom-10 bg-black/55 px-6 py-4 rounded-lg">
          <h1 className="text-white text-4xl font-bold drop-shadow mb-2">Be the Lifeline</h1>
          <p className="text-white text-lg">One Donation, Infinite Possibilities</p>
        </div>
      </section>

      {/* Join Community Banner */}
      <section className="bg-red-100 py-4 text-center rounded-xl text-gray-900 text-base font-semibold shadow-sm">
        Join 25,000+ Life Savers
      </section>

      {/* Information Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Blood Types */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Learn About Blood Donation</h2>
          <p className="text-gray-600 text-base mb-6">Explore blood type compatibility and discover how your donation makes a life-saving difference.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { grp: "O-", label: "Universal Donor", perc: "7%" },
              { grp: "O+", label: "Most Common", perc: "37%" },
              { grp: "A-", label: "Rare type", perc: "2%" },
              { grp: "A+", label: "Common type", perc: "34%" },
              { grp: "B-", label: "Rare type", perc: "1%" },
              { grp: "B+", label: "Less common", perc: "10%" },
              { grp: "AB-", label: "Universal Plasma Donor", perc: "1%" },
              { grp: "AB+", label: "Universal Receiver", perc: "4%" },
            ].map(({ grp, label, perc }) => (
              <div
                key={grp}
                className="bg-white p-4 rounded-xl shadow flex flex-col items-center transition hover:bg-red-50"
              >
                <span className="text-3xl font-black text-red-700 mb-2">{grp}</span>
                <span className="text-sm font-medium text-gray-800">{label}</span>
                <span className="text-xs text-gray-500">{perc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Blood Type Info */}
        <div>
          <h3 className="text-xl font-bold mb-3">Blood Type Information</h3>
          <p className="text-gray-700 mb-4">
            Select a blood type to learn more about its compatibility, donation potential, and unique facts.
          </p>
          <ul className="mb-3 space-y-1">
            <li>
              <span className="font-semibold text-gray-900">Who can donate to them:</span>
              <span className="text-gray-700"> All blood types</span>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Who they can donate to:</span>
              <span className="text-gray-700"> O-</span>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Impact Potential:</span>
              <span className="text-gray-700"> High</span>
            </li>
          </ul>
          <p className="italic text-sm text-gray-600">
            Fun Fact: O- blood is called the "universal donor" because it can be safely transfused into patients of any blood type. This makes it vital in emergencies when blood type is unknown.
          </p>
        </div>
      </section>
    </main>
  );
}
