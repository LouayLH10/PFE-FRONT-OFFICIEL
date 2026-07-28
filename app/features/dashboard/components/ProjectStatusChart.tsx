"use client";

import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("dashboard");
const data = [
  {
    name: t("projectStatus.completed"),
    value: completed,
    color: "#22C55E",
  },
  {
    name: t("projectStatus.active"),
    value: active,
    color: "#3B82F6",
  },
  {
    name: t("projectStatus.pending"),
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
  {t("projectStatus.title")}
</h2>

<p className="text-sm text-gray-500">
  {t("projectStatus.subtitle")}
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
    {t("projectStatus.completed")}
  </p>

  <p className="font-bold text-xl">
    {completed}
  </p>
</div>

<div className="bg-blue-50 rounded-2xl p-3 text-center">
  <p className="text-blue-600 text-sm">
    {t("projectStatus.active")}
  </p>

  <p className="font-bold text-xl">
    {active}
  </p>
</div>

<div className="bg-amber-50 rounded-2xl p-3 text-center">
  <p className="text-amber-600 text-sm">
    {t("projectStatus.pending")}
  </p>

  <p className="font-bold text-xl">
    {pending}
  </p>
</div>

<div className="bg-gray-50 rounded-2xl p-3 text-center">
  <p className="text-gray-600 text-sm">
    {t("projectStatus.total")}
  </p>

  <p className="font-bold text-xl">
    {total}
  </p>
</div>  

      </div>
    </div>
  );
}