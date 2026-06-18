"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";

interface KPIProps {
  title: string;
  number: string | number;
  growth?: string;
  icon: React.ReactNode;
  color: string;
  href?: string;
}

function KPI({
  title,
  number,
  growth,
  icon,
  color,
  href,
}: KPIProps) {
  const content = (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-[150px] flex flex-col justify-between cursor-pointer">
      <div className="flex items-start justify-between">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}
        >
          {icon}
        </div>

        <div className="flex items-center gap-1 text-green-500 text-sm font-semibold">
          <TrendingUp size={14} />
          {growth}
        </div>
      </div>

      <div>
        <p className="text-gray-500 text-sm truncate">
          {title}
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-1 truncate">
          {number}
        </h2>
      </div>
    </div>
  );

  return href ? (
    <Link href={href}>{content}</Link>
  ) : (
    content
  );
}

export default KPI;