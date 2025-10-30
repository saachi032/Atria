import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function StatewiseBarCard({ title, barData, dataKey, labelKey }) {
  // Chart height is based on number of items (e.g. ~30px per item for 28 states)
  const chartHeight = Math.max(barData.length * 36, 400);

  return (
    <div className="bg-white rounded-xl shadow p-4 w-full max-w-full" style={{ minWidth: 0 }}>
      <div className="bg-blue-700 text-white font-bold rounded-t-md px-4 py-2 mb-2">{title}</div>
      <div className="overflow-y-auto" style={{ maxHeight: "380px" }}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            layout="vertical"
            data={barData}
            barCategoryGap="20%"
            margin={{ left: 10, right: 10 }}
          >
            <XAxis type="number" hide />
            <YAxis dataKey={labelKey} type="category" width={130} fontSize={14} />
            <Tooltip />
            <Bar dataKey={dataKey} fill="#5ec6fa" barSize={16}>
              {barData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
