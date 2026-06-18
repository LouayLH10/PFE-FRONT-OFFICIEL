"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./features/components/sideBar";
import { useState } from "react";
import { MessageCircle} from "lucide-react";
import MessagesBar from "./features/components/messagesBar";
import NavBar from "./features/components/navBar";


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
      <div className="flex items-center justify-center  min-h-screen bg-gray-500 min-w-full">
        {children}
      </div>
    );
  }
  const [open, setOpen] = useState(true);
  const [openMsg,setOpenMsg]=useState(false);
  // ✅ DASHBOARD
  return (
<div className="min-h-full min-w-full bg-[#f5f7fb] flex">

  {/* SIDEBAR */}
  <aside
    className={`fixed top-0 left-0 h-screen z-50 p-5 transition-all duration-300 ${
      open ? "w-[320px]" : "w-[120px]"
    }`}
  >
    <Sidebar
      open={open}
      setOpen={setOpen}
    />
  </aside>

  {/* CONTENT */}
  <div
    className={`flex flex-col transition-all duration-300 min-h-screen ${
      open
        ? "ml-[320px] w-[calc(100%-320px)]"
        : "ml-[120px] w-[calc(100%-120px)]"
    }`}
  >

    {/* NAVBAR */}
    <div className="p-5 pb-0">
      <NavBar />
    </div>

    {/* PAGE */}
    <main className="flex-1 p-5 pt-5 overflow-hidden">

      <div className="h-[calc(100vh-170px)] bg-white rounded-[35px] shadow-xl border border-gray-100 overflow-y-auto p-6">

        {children}

      </div>

    </main>
  </div>
</div>
  );
}