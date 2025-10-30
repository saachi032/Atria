import StatewiseBarCard from "./StatewiseBarCard";
import StatewiseTable from "./StatewiseTable";
import { statewiseBars, statewiseTableData } from "./insightsData";

export default function StatewiseStatsSection() {
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
