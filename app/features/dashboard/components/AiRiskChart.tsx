"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

type AiRiskChartProps = {
  high: number;
  medium: number;
  low: number;
};

export default function AiRiskChart({
  high,
  medium,
  low,
}: AiRiskChartProps) {
  const data = [
    {
      name: "High Risk",
      value: high,
      color: "#EF4444",
    },
    {
      name: "Medium Risk",
      value: medium,
      color: "#F59E0B",
    },
    {
      name: "Low Risk",
      value: low,
      color: "#22C55E",
    },
  ];

  const total = high + medium + low;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            AI Risk Analysis
          </h2>

          <p className="text-sm text-gray-500">
            Priority distribution from AI insights
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

        <div className="bg-red-50 rounded-2xl p-3 text-center">
          <p className="text-red-600 text-sm">
            High
          </p>

          <p className="font-bold text-xl">
            {high}
          </p>
        </div>

        <div className="bg-amber-50 rounded-2xl p-3 text-center">
          <p className="text-amber-600 text-sm">
            Medium
          </p>

          <p className="font-bold text-xl">
            {medium}
          </p>
        </div>

        <div className="bg-green-50 rounded-2xl p-3 text-center">
          <p className="text-green-600 text-sm">
            Low
          </p>

          <p className="font-bold text-xl">
            {low}
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