"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  Truck,
  Receipt,
  CreditCard,
  FolderKanban,
  LogOut,
  MessageCircle,
  Puzzle,
} from "lucide-react";
import { usePathname } from "next/navigation";

function Sidebar({ open, setOpen }: any) {
  
 const pathname = usePathname();
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Quotes", icon: FileText, path: "/features/quotes/pages" },
    { name: "Delivery Notes", icon: Truck, path: "/features/delivery-note/pages" },
     { name: "Purchase Order", icon:ShoppingCart, path: "/features/purchase-order/pages" },
    { name: "Invoices", icon: Receipt, path: "/features/invoice/pages" },
    { name: "Payments", icon: CreditCard, path: "/features/payment/pages" },
    { name: "Projects", icon: FolderKanban, path: "/features/projects/pages" },
   
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-md h-screen p-4 flex flex-col justify-between transition-all duration-300 ${
          open ? "w-64" : "w-20"
        }`}
      >
        <div>
          {/* Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="mb-6 text-gray-600 hover:text-blue-600"
          >
            ☰
          </button>

          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-xl font-bold text-blue-600">
              {open ? "MyApp" : "M"}
            </h1>
          </div>

          {/* Menu */}
          <ul className="space-y-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
const isActive = pathname === item.path;
              return (
                <li key={index}>
                  <a
                    href={item.path}
                                 className={`flex items-center gap-3 px-2 py-2 rounded-lg transition ${
                      isActive
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={20} />
                    {open && <span>{item.name}</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Logout en bas */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/features/auth/pages/login";
          }}
          className={`flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition ${
            open ? "w-full" : "w-12 h-10"
          }`}
        >
          <LogOut size={18} />
          {open && "Logout"}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;