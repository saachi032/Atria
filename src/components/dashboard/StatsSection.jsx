import { useState, useEffect } from "react";
import axios from "axios";
import PieCard from "./PieCard";

export default function StatsSection() {
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/insights/stats");
        setStatsData(response.data.statsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching stats data:", err);
        setError("Failed to load stats data");
        // Fallback to empty array on error
        setStatsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStatsData();
    // Refresh data every 60 seconds
    const interval = setInterval(fetchStatsData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="mb-8">
        <h2 className="text-red-700 text-xl font-semibold mb-3">Stats</h2>
        <div className="flex flex-wrap gap-6">
          <div className="text-gray-600">Loading real-time data...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-8">
        <h2 className="text-red-700 text-xl font-semibold mb-3">Stats</h2>
        <div className="flex flex-wrap gap-6">
          <div className="text-red-600">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="text-red-700 text-xl font-semibold mb-3">Stats</h2>
      <div className="flex flex-wrap gap-6">
        {statsData.map((card, idx) => (
          <PieCard key={idx} {...card} />
        ))}
      </div>
    </section>
  );
}
