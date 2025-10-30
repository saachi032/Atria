import PieCard from "./PieCard";
import { statsData } from "./insightsData";

export default function StatsSection() {
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
