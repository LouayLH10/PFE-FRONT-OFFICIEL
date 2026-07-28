"use client";

import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { updateLanguage } from "../services/generalFunctions";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

const changeLanguage = async (
  lng: string
) => {
  i18n.changeLanguage(lng);

  localStorage.setItem("language", lng);

  try {
    await updateLanguage(lng);
  } catch (e) {
    console.error(e);
  }
};

  return (
    <div className="flex items-center bg-[#f5f5f7] rounded-2xl p-1 shadow-sm">

      <div className="w-10 h-10 flex items-center justify-center text-gray-600">
        <Languages size={20} />
      </div>

      {["en", "fr"].map((lng) => (
        <button
          key={lng}
          onClick={() => changeLanguage(lng as "en" | "fr")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
            i18n.language === lng
              ? "bg-white text-black shadow-md"
              : "text-gray-500 hover:text-[#6C4DFF]"
          }`}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
}