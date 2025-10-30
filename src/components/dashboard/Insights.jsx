import StatsSection from "./StatsSection";
import TodaysStatsSection from "./TodaysStatsSection";
import StatewiseStatsSection from "./StatewiseStatsSection";

export default function Insights() {
  return (
    <div className="bg-gray-100 min-h-screen py-4 font-sans">
      <div className="w-full px-2 md:px-6 lg:px-10 mt-20">
        <div className="mb-12">
          <StatsSection />
        </div>

        <div className="mb-12">
          <TodaysStatsSection />
        </div>

        <div className="mb-12">
          <StatewiseStatsSection />
        </div>
      </div>
    </div>
  );
}
