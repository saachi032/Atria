import { useState, useEffect } from "react";
import axios from "axios";
import HorizontalBarCard from "./HorizontalBarCard";

export default function TodaysStatsSection() {
  const [todaysStatsData, setTodaysStatsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodaysStatsData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/insights/todays-stats`);
        setTodaysStatsData(response.data.todaysStatsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching today's stats data:", err);
        setError("Failed to load today's stats data");
        // Fallback to empty array on error
        setTodaysStatsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTodaysStatsData();
    // Refresh data every 60 seconds
    const interval = setInterval(fetchTodaysStatsData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="mb-8">
        <h2 className="text-red-700 text-xl font-semibold mb-2">Today's Stats</h2>
        <div className="flex flex-wrap gap-6">
          <div className="text-gray-600">Loading real-time data...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-8">
        <h2 className="text-red-700 text-xl font-semibold mb-2">Today's Stats</h2>
        <div className="flex flex-wrap gap-6">
          <div className="text-red-600">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="text-red-700 text-xl font-semibold mb-2">Today's Stats</h2>
      <div className="flex flex-wrap gap-6">
        {todaysStatsData.map((card, idx) => (
          <HorizontalBarCard key={idx} {...card} />
        ))}
      </div>
    </section>
  );
}
