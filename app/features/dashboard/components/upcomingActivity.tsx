"use client";

import {
  FileText,
  Receipt,
  ShoppingCart,
  Truck,
} from "lucide-react";

const activities = [
  {
    id: 1,
    title: "Quote waiting for approval",
    description: "Quote #QT-2026-001",
    date: "Today",
    icon: FileText,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    id: 2,
    title: "Invoice overdue",
    description: "Invoice #INV-2026-015",
    date: "2 days ago",
    icon: Receipt,
    color: "bg-red-100 text-red-600",
  },
  {
    id: 3,
    title: "Purchase order pending confirmation",
    description: "Order #PO-2026-021",
    date: "Tomorrow",
    icon: ShoppingCart,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 4,
    title: "Delivery scheduled",
    description: "Project Alpha",
    date: "Next week",
    icon: Truck,
    color: "bg-green-100 text-green-600",
  },
];

export default function UpcomingActivity() {
  return (
    <div className="">

      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">
          Upcoming Activities
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Deliverables, invoices, orders and quotes
        </p>
      </div>

      {/* Timeline */}
      <div className="p-6 overflow-y-auto max-h-[550px]">

        <div className="space-y-1">

          {activities.map((activity, index) => {
            const Icon = activity.icon;

            return (
              <div
                key={activity.id}
                className="relative flex gap-4 pb-8"
              >
                {/* Timeline line */}
                {index !== activities.length - 1 && (
                  <div className="absolute left-[22px] top-12 w-[2px] h-full bg-gray-200" />
                )}

                {/* Icon */}
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${activity.color}`}
                >
                  <Icon size={18} />
                </div>

                {/* Content */}
                <div className="flex-1">

                  <h3 className="font-semibold text-gray-800">
                    {activity.title}
                  </h3>

                  <p className="text-gray-600 mt-1">
                    {activity.description}
                  </p>

                  <p className="text-sm text-gray-400 mt-2">
                    {activity.date}
                  </p>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}