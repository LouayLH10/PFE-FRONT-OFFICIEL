"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";


type OrderStatusChartProps = {
  approved: number;
  recieved: number;
  cancelled: number;
  pending: number;
};
export default function OrderStatusChart({
  approved,
  recieved,
  cancelled,
  pending,
}:OrderStatusChartProps) {
  const data = [
  {
    name: "Approved",
    value: approved,
    color: "#22C55E",
  },
  {
    name: "Pending",
    value: pending,
    color: "#F59E0B",
  },
  {
    name: "Cancelled",
    value: cancelled,
    color: "#EF4444",
  },
  {
    name: "Recieved",
    value: recieved,
    color: "#3B82F6",
  },
];
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Orders by Status
          </h2>

          <p className="text-sm text-gray-500">
            Distribution of orders
          </p>
        </div>



      </div>

      {/* CHART */}
      <div className="h-[350px]">

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>

            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend
              verticalAlign="bottom"
              height={36}
            />

          </PieChart>
        </ResponsiveContainer>

      </div>

      {/* FOOTER STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">

        <div className="bg-green-50 rounded-2xl p-3 text-center">
          <p className="text-green-600 text-sm">
            Approved
          </p>

          <p className="font-bold text-xl">
            {approved}
          </p>
        </div>

        <div className="bg-amber-50 rounded-2xl p-3 text-center">
          <p className="text-amber-600 text-sm">
            Pending
          </p>

          <p className="font-bold text-xl">
            {pending}
          </p>
        </div>

        <div className="bg-red-50 rounded-2xl p-3 text-center">
          <p className="text-red-600 text-sm">
            Cancelled
          </p>

          <p className="font-bold text-xl">
            {cancelled}
          </p>
        </div>

        <div className="bg-blue-50 rounded-2xl p-3 text-center">
          <p className="text-blue-600 text-sm">
            Recieved
          </p>

          <p className="font-bold text-xl">
          {recieved}
          </p>
        </div>

      </div>

    </div>
  );
}