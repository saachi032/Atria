import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#e9537d", "#2693e6", "#ffdd5d", "#47c1c8"];
const LEGEND = ["Govt", "Private", "Chartered", "Redcross"];

export default function PieCard({ title, total, pieData, groups }) {
  return (
    <div className="bg-blue-50 rounded-xl mt-6 shadow p-6 min-w-[320px] w-full max-w-[400px]">
      <div className="font-bold text-lg mb-1">{title}</div>
      <div className="text-right font-semibold text-lg mb-2">Total {total}</div>
      <div className="flex gap-3 items-center">
        <PieChart width={120} height={120}>
          <Pie
            data={pieData}
            cx={60}
            cy={60}
            innerRadius={40}
            outerRadius={55}
            dataKey="value"
            paddingAngle={2}
          >
            {pieData.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
        <ul className="ml-2">
          {groups.map((g, idx) => (
            <li key={g.label} className="text-base mb-1">
              <span style={{ color: COLORS[idx], fontWeight: "bold" }}>
                ●
              </span>{" "}
              {g.label}: {g.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
