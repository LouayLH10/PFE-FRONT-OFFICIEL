"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PurchasedProductsProps {
  purchacedProd: {
    jan: number;
    feb: number;
    mar: number;
    apr: number;
    may: number;
    jun: number;
    jul: number;
    aug: number;
    sep: number;
    oct: number;
    nov: number;
    dec: number;
  };
}

function PurchasedProductsChart({
  purchacedProd,
}: PurchasedProductsProps) {
  const data = [
    { month: "Jan", purchased: purchacedProd.jan },
    { month: "Feb", purchased: purchacedProd.feb },
    { month: "Mar", purchased: purchacedProd.mar },
    { month: "Apr", purchased: purchacedProd.apr },
    { month: "May", purchased: purchacedProd.may },
    { month: "Jun", purchased: purchacedProd.jun },
    { month: "Jul", purchased: purchacedProd.jul },
    { month: "Aug", purchased: purchacedProd.aug },
    { month: "Sep", purchased: purchacedProd.sep },
    { month: "Oct", purchased: purchacedProd.oct },
    { month: "Nov", purchased: purchacedProd.nov },
    { month: "Dec", purchased: purchacedProd.dec },
  ];

  const totalPurchased = data.reduce(
    (sum, item) => sum + item.purchased,
    0
  );

  const bestMonth = data.reduce((max, item) =>
    item.purchased > max.purchased ? item : max
  );

  const averagePerMonth = Math.round(
    totalPurchased / 12
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Purchased Products
          </h2>

          <p className="text-sm text-gray-500">
            Products purchased over the year
          </p>
        </div>

        <select className="border border-gray-200 rounded-xl px-3 py-2 text-sm">
          <option>This Year</option>
          <option>Last Year</option>
        </select>
      </div>

      {/* CHART */}
      <div className="h-[350px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
            />

            <Tooltip />

            <Bar
              dataKey="purchased"
              radius={[10, 10, 0, 0]}
              fill="#6C4DFF"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* FOOTER */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-[#F4F3FF] rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-500">
            Total Purchased
          </p>

          <p className="font-bold text-xl text-[#6C4DFF]">
            {totalPurchased}
          </p>
        </div>

        <div className="bg-green-50 rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-500">
            Best Month
          </p>

          <p className="font-bold text-xl text-green-600">
            {bestMonth.month}
          </p>
        </div>

        <div className="bg-blue-50 rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-500">
            Average / Month
          </p>

          <p className="font-bold text-xl text-blue-600">
            {averagePerMonth}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PurchasedProductsChart;