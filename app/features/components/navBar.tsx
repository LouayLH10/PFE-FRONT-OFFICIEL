"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  Bell,
  MessageCircle,
  Search,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { getUserFromToken } from "../auth/pages/login/user";

function NavBar() {

  const pathname =
    usePathname();

  const [pageName, setPageName] =
    useState("");
const user=getUserFromToken();
  const menuItems = [

    {
      name: "Dashboard",
      path: "/features/dashboard/pages",
    },

    {
      name: "Quotes",
      path: "/features/quotes/pages",
    },

    {
      name: "Delivery Notes",
      path: "/features/delivery-note/pages",
    },

    {
      name: "Purchase Order",
      path: "/features/purchase-order/pages",
    },

    {
      name: "Invoices",
      path: "/features/invoice/pages",
    },

    {
      name: "Payments",
      path: "/features/payment/pages",
    },

    {
      name: "Projects",
      path: "/features/projects/pages",
    },

    {
      name: "Messages",
      path: "/features/messages/pages",
    },
  ];

  useEffect(() => {

    const currentItem =
      menuItems.find(
        (item) =>
          pathname === item.path
      );

    if (currentItem) {

      setPageName(
        currentItem.name
      );

    }

  }, [pathname]);
  const getColorFromName = (
    name: string
  ) => {
      if (!name) {
    return "bg-gray-500";
  }
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];

    let hash = 0;

    for (let i = 0; i < name.length; i++) {
      hash =
        name.charCodeAt(i) +
        ((hash << 5) - hash);
    }

    return (
      colors[Math.abs(hash) % colors.length]
    );
  };
  return (

    <nav className="w-full bg-white rounded-[30px] shadow-xl border border-gray-100 px-8 py-5">

      <div className="flex items-center justify-between">

        {/* LEFT */}
        <div>

          <p className="text-sm text-gray-400 font-medium">
            Welcome Back 
          </p>

          <h1 className="text-3xl font-bold text-gray-900 mt-1">
            {pageName}
          </h1>

        </div>

        {/* CENTER SEARCH */}
        <div className="hidden lg:flex items-center bg-[#f5f5f7] rounded-2xl px-4 py-3 w-[350px]">

          <Search
            size={18}
            className="text-gray-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none ml-3 w-full text-sm text-gray-700 placeholder:text-gray-400"
          />

        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-4">

          {/* MESSAGE */}
          <a
            href="/features/messages/pages"
            className="relative w-14 h-14 rounded-2xl bg-[#f5f5f7] hover:bg-[#edeaff] flex items-center justify-center text-gray-600 hover:text-[#6C4DFF] transition-all duration-300"
          >

            <MessageCircle size={22} />

            {/* BADGE */}
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#6C4DFF]" />

          </a>

          {/* NOTIFICATION */}
          <button
            className="relative w-14 h-14 rounded-2xl bg-[#f5f5f7] hover:bg-[#edeaff] flex items-center justify-center text-gray-600 hover:text-[#6C4DFF] transition-all duration-300"
          >

            <Bell size={22} />

            {/* BADGE */}
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-pink-500" />

          </button>

          {/* USER */}
          <div className="flex items-center gap-3 pl-2">

            <div className="text-right hidden sm:block">

              <p className="font-semibold text-gray-800 leading-none">
                {user?.name}
              </p>



            </div>

            {/* AVATAR */}
            <div className={`w-14 h-14 rounded-2xl bg-[#6C4DFF] text-white ${getColorFromName(user?.name)} flex items-center justify-center font-bold text-lg shadow-md `}>

           {user?.name.charAt(0).toUpperCase()}

            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;