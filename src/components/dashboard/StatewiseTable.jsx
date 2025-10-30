import React, { useState, useMemo } from "react";

export default function StatewiseTable({ data }) {
  const [sortField, setSortField] = useState("state");
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = useMemo(() => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      if (sortField === "state") return sortAsc ? a.state.localeCompare(b.state) : b.state.localeCompare(a.state);
      return sortAsc ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
    });
    return sortedData;
  }, [data, sortField, sortAsc]);

  const toggleSort = (field) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow p-8 mt-8 px-2 md:px-6 lg:px-10">
      <div className="font-bold text-lg mb-2">Statewise Stats</div>
      <div className="border-b-2 border-red-600 mb-3"></div>
      <div className="overflow-x-auto">
        <table className="w-full text-base whitespace-nowrap">
          <thead>
            <tr className="font-semibold">
              <th className="py-3 px-4 text-center cursor-pointer" onClick={() => toggleSort("state")}>
                State
                {sortField === "state" && (sortAsc ? " ▲" : " ▼")}
              </th>
              <th className="py-3 px-4 text-right cursor-pointer" onClick={() => toggleSort("bloodCentres")}>
                Blood Centres
                {sortField === "bloodCentres" && (sortAsc ? " ▲" : " ▼")}
              </th>
              <th className="py-3 px-4 text-right cursor-pointer" onClick={() => toggleSort("activeBloodCentres")}>
                Active Centres
                {sortField === "activeBloodCentres" && (sortAsc ? " ▲" : " ▼")}
              </th>
              <th className="py-3 px-4 text-right cursor-pointer" onClick={() => toggleSort("licensedBloodCentres")}>
                Licensed Centres
                {sortField === "licensedBloodCentres" && (sortAsc ? " ▲" : " ▼")}
              </th>
              <th className="py-3 px-4 text-right cursor-pointer" onClick={() => toggleSort("bsu")}>
                BSU
                {sortField === "bsu" && (sortAsc ? " ▲" : " ▼")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(
              (
                { state, bloodCentres, activeBloodCentres, licensedBloodCentres, bsu },
                idx
              ) => (
                <tr key={state} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="py-2 px-4 text-center">{state}</td>
                  <td className="py-2 px-4 text-right">{bloodCentres}</td>
                  <td className="py-2 px-4 text-right">{activeBloodCentres}</td>
                  <td className="py-2 px-4 text-right">{licensedBloodCentres}</td>
                  <td className="py-2 px-4 text-right">{bsu}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
