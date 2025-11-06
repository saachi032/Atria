import { useState, useEffect } from "react";
import axios from "axios";
import StatewiseBarCard from "./StatewiseBarCard";
import StatewiseTable from "./StatewiseTable";

export default function StatewiseStatsSection() {
  const [statewiseBars, setStatewiseBars] = useState([]);
  const [statewiseTableData, setStatewiseTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatewiseData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/insights/statewise`);
        setStatewiseBars(response.data.statewiseBars);
        setStatewiseTableData(response.data.statewiseTableData);
        setError(null);
      } catch (err) {
        console.error("Error fetching statewise data:", err);
        setError("Failed to load statewise data");
        // Fallback to empty arrays on error
        setStatewiseBars([]);
        setStatewiseTableData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStatewiseData();
    // Refresh data every 60 seconds
    const interval = setInterval(fetchStatewiseData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="w-full px-2">
        <h2 className="text-red-700 text-xl font-semibold mb-2">Statewise Stats</h2>
        <div className="text-gray-600">Loading real-time data...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full px-2">
        <h2 className="text-red-700 text-xl font-semibold mb-2">Statewise Stats</h2>
        <div className="text-red-600">{error}</div>
      </section>
    );
  }

  return (
    <section className="w-full px-2">
      <h2 className="text-red-700 text-xl font-semibold mb-2">Statewise Stats</h2>
      {/* Responsive grid: 1 on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-5 w-full">
        {statewiseBars.map((card, idx) => (
          <StatewiseBarCard key={idx} {...card} />
        ))}
      </div>
      <StatewiseTable data={statewiseTableData} />
    </section>
  );
}
