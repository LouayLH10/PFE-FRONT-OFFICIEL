"use client";

import React from "react";
import { Search, Timer } from "lucide-react";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./languageSwitcher";
import { useTranslation } from "react-i18next";

function NavBar() {
  const { t } = useTranslation("navbar");
  const pathname = usePathname();

  const menuItems = [
    {
      name: t("pages.dashboard"),
      path: "/features/dashboard/pages",
    },
    {
      name: t("pages.quotes"),
      path: "/features/quotes/pages",
    },
    {
      name: t("pages.deliveryNotes"),
      path: "/features/delivery-note/pages",
    },
    {
      name: t("pages.orders"),
      path: "/features/purchase-order/pages",
    },
    {
      name: t("pages.invoices"),
      path: "/features/invoice/pages",
    },
    {
      name: t("pages.payments"),
      path: "/features/payment/pages",
    },
    {
      name: t("pages.projects"),
      path: "/features/projects/pages",
    },
    {
      name: t("pages.messages"),
      path: "/features/messages/pages",
    },
       {
      name: t("pages.aidocumentsinsights"),
      path: "/features/iaDocument/pages",
    },
  ];

  const pageName =
    menuItems.find((item) => item.path === pathname)?.name ?? "";

  return (
    <nav className="w-full bg-white rounded-2xl md:rounded-[30px] shadow-xl border border-gray-100 px-4 md:px-8 py-4 md:py-5">
      <div className="flex items-center justify-between gap-4">

        {/* LEFT */}
        <div className="min-w-0">
          <p className="text-xs md:text-sm text-gray-400 font-medium">
            {t("welcome")}
          </p>

          <h1 className="text-xl md:text-3xl font-bold text-gray-900 truncate">
            {pageName}
          </h1>
        </div>

        {/* SEARCH */}
        <div className="hidden lg:flex items-center bg-[#f5f5f7] rounded-2xl px-4 py-3 w-[350px]">
          <Search
            size={18}
            className="text-gray-400"
          />

          <input
            type="text"
            placeholder={t("search")}
            className="bg-transparent outline-none ml-3 w-full text-sm text-gray-700 placeholder:text-gray-400"
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 md:gap-4">

          <LanguageSwitcher />

          <button className="relative w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-[#f5f5f7] hover:bg-[#edeaff] flex items-center justify-center text-gray-600 hover:text-[#6C4DFF] transition">
            <Timer
              size={18}
              className="md:w-[22px] md:h-[22px]"
            />

            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500" />
          </button>

        </div>
      </div>
    </nav>
  );
}

export default NavBar;