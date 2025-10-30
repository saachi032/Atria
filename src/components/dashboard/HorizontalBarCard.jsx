import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function HorizontalBarCard({ title, total, barData, dataKey, labelKey }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 min-w-[320px] w-full max-w-[400px]">
      <div className="font-bold text-lg mb-1">{title}</div>
      <div className="text-right font-semibold text-lg mb-2">Total {total}</div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          layout="vertical"
          data={barData}
          barCategoryGap="18%"
          margin={{ left: 10, right: 30 }}
        >
          <XAxis type="number" hide />
          <YAxis dataKey={labelKey} type="category" width={120} />
          <Tooltip />
          <Bar dataKey={dataKey} fill="#2693e6" barSize={18}>
            {barData.map((entry, idx) => (
              <Cell key={`cell-${idx}`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
