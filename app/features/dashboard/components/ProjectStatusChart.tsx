"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

type ProjectStatusChartProps = {
  completed: number;
  active: number;
  pending: number;
};

export default function ProjectStatusChart({
  completed,
  active,
  pending,
}: ProjectStatusChartProps) {
  const data = [
    {
      name: "Completed",
      value: completed,
      color: "#22C55E",
    },
    {
      name: "In Progress",
      value: active,
      color: "#3B82F6",
    },
    {
      name: "Pending",
      value: pending,
      color: "#F59E0B",
    },
  ];

  const total =
    completed + active + pending;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Project Status
          </h2>

          <p className="text-sm text-gray-500">
            Distribution of projects
          </p>
        </div>
      </div>

      {/* CHART */}
      <div className="h-[350px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
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

      {/* FOOTER */}
      <div className="grid grid-cols-4 gap-4 mt-2">

        <div className="bg-green-50 rounded-2xl p-3 text-center">
          <p className="text-green-600 text-sm">
            Completed
          </p>

          <p className="font-bold text-xl">
            {completed}
          </p>
        </div>

        <div className="bg-blue-50 rounded-2xl p-3 text-center">
          <p className="text-blue-600 text-sm">
            Active
          </p>

          <p className="font-bold text-xl">
            {active}
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

        <div className="bg-gray-50 rounded-2xl p-3 text-center">
          <p className="text-gray-600 text-sm">
            Total
          </p>

          <p className="font-bold text-xl">
            {total}
          </p>
        </div>

      </div>
    </div>
  );
}