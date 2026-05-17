"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./features/components/sideBar";
import { useState } from "react";
import { MessageCircle} from "lucide-react";
import MessagesBar from "./features/components/messagesBar";


export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage =
    pathname.includes("/login") ||
    pathname.includes("/register") ||
    pathname.includes("/forgotpassword") ||
    pathname.includes("/verify");

  // ✅ 👉 SI AUTH → CENTER
  if (isAuthPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200 w-full">
        {children}
      </div>
    );
  }
  const [open, setOpen] = useState(true);
  const [openMsg,setOpenMsg]=useState(false);
  // ✅ DASHBOARD
  return (
   <div className="flex">
      
      {/* ✅ Sidebar FIXED */}
      <div
        className={`fixed left-0 top-0 h-screen z-50 transition-all duration-300 ${
          open ? "w-64" : "w-20"
        }`}
      >
        <Sidebar open={open} setOpen={setOpen} />
      </div>

      <div
        className={`fixed right-0 top-0 h-screen z-50 transition-all duration-300 ${
          open ? "w-64" : "w-20"
        }`}
      >
        <MessagesBar open={openMsg} setOpen={setOpenMsg} />
      </div>
      {/* ✅ Content dynamique */}
      <div
        className={`flex-1 transition-all duration-300 ${
          open ? "ml-64" : "ml-20"
        }`}
      >
        <main className="p-6 min-h-screen">
          {children}

        </main>
      </div>
    </div>
  );
}