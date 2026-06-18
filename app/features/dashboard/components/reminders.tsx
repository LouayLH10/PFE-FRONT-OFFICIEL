"use client";

import {
  AlertTriangle,
  Receipt,
  FileText,
} from "lucide-react";

const reminders = [
  {
    id: 1,
    type: "payment",
    title: "Invoice INV-2026-015",
    subtitle: "Client: ABC Company",
    daysLate: 12,
    icon: Receipt,
    color:
      "bg-red-50 border-red-200 text-red-600",
  },
  {
    id: 2,
    type: "quote",
    title: "Quote QT-2026-009",
    subtitle: "Waiting approval",
    daysLate: 5,
    icon: FileText,
    color:
      "bg-yellow-50 border-yellow-200 text-yellow-600",
  },
  {
    id: 3,
    type: "payment",
    title: "Invoice INV-2026-022",
    subtitle: "Client: TechCorp",
    daysLate: 3,
    icon: Receipt,
    color:
      "bg-red-50 border-red-200 text-red-600",
  },
];

export default function Reminders() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

        <div>
          <h2 className="font-bold text-xl text-gray-800">
            Reminders
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Overdue payments & quotes
          </p>
        </div>

        <div className="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center">
          <AlertTriangle
            size={20}
            className="text-red-500"
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-4">

        {reminders.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className={`border rounded-2xl p-4 transition hover:shadow-md ${item.color}`}
            >
              <div className="flex items-start justify-between">

                <div className="flex gap-3">

                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center">
                    <Icon size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {item.title}
                    </h3>

                    <p className="text-sm opacity-80 mt-1">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="bg-white px-3 py-1 rounded-full text-sm font-semibold">
                  {item.daysLate}d
                </div>

              </div>

              <div className="mt-4 flex justify-end">

                <button className="bg-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow">
                  View Details
                </button>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}