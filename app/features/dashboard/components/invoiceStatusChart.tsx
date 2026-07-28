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

type InvoiceStatusChartProps = {
  paid: number;
  unpaid: number;
};

export default function InvoiceStatusChart({
  paid,
  unpaid,
}: InvoiceStatusChartProps) {
  const { t } = useTranslation("dashboard");

  const data = [
    {
      name: t("invoiceStatus.paid"),
      value: paid,
      color: "#22C55E",
    },
    {
      name: t("invoiceStatus.unpaid"),
      value: unpaid,
      color: "#EF4444",
    },
  ];

  const total = paid + unpaid;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {t("invoiceStatus.title")}
          </h2>

          <p className="text-sm text-gray-500">
            {t("invoiceStatus.subtitle")}
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
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* FOOTER */}
      <div className="grid grid-cols-3 gap-4 mt-2">
        <div className="bg-green-50 rounded-2xl p-3 text-center">
          <p className="text-green-600 text-sm">
            {t("invoiceStatus.paid")}
          </p>

          <p className="font-bold text-xl">{paid}</p>
        </div>

        <div className="bg-red-50 rounded-2xl p-3 text-center">
          <p className="text-red-600 text-sm">
            {t("invoiceStatus.unpaid")}
          </p>

          <p className="font-bold text-xl">{unpaid}</p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-3 text-center">
          <p className="text-gray-600 text-sm">
            {t("invoiceStatus.total")}
          </p>

          <p className="font-bold text-xl">{total}</p>
        </div>
      </div>
    </div>
  );
}