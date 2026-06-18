"use client";

import { SearchIcon } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: Props) {
  return (
  <div className="mb-4 flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 hover:shadow-md">

  {/* 🔍 Icon */}
  <SearchIcon className="text-gray-400 w-5 h-5" />

  {/* 🔍 Input */}
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
  />
</div>
  );
}