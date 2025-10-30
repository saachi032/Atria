import { useState } from "react";
import {
  STATES,
  DISTRICTS,
  BLOOD_GROUPS,
  COMPONENTS,
  BLOOD_BANK_RESULTS,
} from "./bloodData";

export default function FindBlood() {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [group, setGroup] = useState("");
  const [component, setComponent] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    const filteredResults = BLOOD_BANK_RESULTS.filter(
      (item) =>
        item.state === state &&
        item.district === district &&
        (group ? item.availability.includes(group) : true) &&
        (component ? item.availability.includes(component) : true)
    );
    setResults(filteredResults);
    setSearched(true);
  };

  return (
    <main className="w-full min-h-screen bg-[#FAFAFA] py-12 px-2 md:px-8 pt-28">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-red-600 mb-8 tracking-wider">
          Search Blood Stock Availability
        </h1>
        <section className="bg-white rounded-xl shadow-lg p-8 mb-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block font-semibold mb-2">State</label>
              <select
                className="w-full border rounded-lg p-2"
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setDistrict("");
                }}
              >
                <option value="">Select State</option>
                {STATES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2">District</label>
              <select
                className="w-full border rounded-lg p-2"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={!state}
              >
                <option value="">Select District</option>
                {state &&
                  DISTRICTS[state]?.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2">Blood Group</label>
              <select
                className="w-full border rounded-lg p-2"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
              >
                <option value="">All Blood Groups</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2">Component</label>
              <select
                className="w-full border rounded-lg p-2"
                value={component}
                onChange={(e) => setComponent(e.target.value)}
              >
                <option value="">All Components</option>
                {COMPONENTS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-center">
            <button
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-red-700 transition"
              onClick={handleSearch}
              disabled={!state || !district}
            >
              Search
            </button>
          </div>
        </section>
        {searched && (
          <section className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-xl font-extrabold mb-4 text-red-700 text-center">
              Blood Banks & Hospitals
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border table-auto">
                <thead>
                  <tr className="bg-red-100 text-red-700 font-bold">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Address</th>
                    <th className="px-4 py-2">Contact</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Availability</th>
                    <th className="px-4 py-2">Last Updated</th>
                    <th className="px-4 py-2">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {results.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-6 text-gray-500">
                        No results found.
                      </td>
                    </tr>
                  ) : (
                    results.map((r, idx) => (
                      <tr
                        key={idx}
                        className="even:bg-red-50 odd:bg-white text-gray-700"
                      >
                        <td className="px-4 py-3 font-semibold">{r.name}</td>
                        <td className="px-4 py-3">{r.address}</td>
                        <td className="px-4 py-3">{r.contact}</td>
                        <td className="px-4 py-3">{r.category}</td>
                        <td className="px-4 py-3">{r.availability}</td>
                        <td className="px-4 py-3">{r.updated}</td>
                        <td className="px-4 py-3">{r.type}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
