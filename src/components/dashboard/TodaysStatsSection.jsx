import HorizontalBarCard from "./HorizontalBarCard";
import { todaysStatsData } from "./insightsData";

export default function TodaysStatsSection() {
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
