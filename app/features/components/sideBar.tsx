"use client";

import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  Truck,
  Receipt,
  CreditCard,
  FolderKanban,
  LogOut,
  Menu,
  MessageCircle,
  Archive,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { getUserFromToken } from "../auth/pages/login/user";
import { fetchQuote } from "../quotes/service/quoteService";
import { useEffect, useState } from "react";
import { fetchDN } from "../delivery-note/service/deliveryNoteService";
import { fetchPO } from "../purchase-order/service/purchaseOrderService";
import { fetchInvoice } from "../invoice/service/invoiceService";
import { fetchPayment } from "../payment/service/paymentService";
import { fetchProject } from "../projects/service/projectService";
import { useTranslation } from "react-i18next";
import { fetchUnreadCount } from "../messages/service/messagesService";
import { socket } from "@/app/socket";
import { fetchOcrDocuments } from "../iaDocument/service/aiOCRService";
import logo from "@/app/logo/innoway.png";
  import Image from "next/image";

function Sidebar({ open, setOpen }: any) {
const { t } = useTranslation("sidebar");
  const pathname = usePathname();
const [nbQuote, setNbQuote] = useState(0);
const [nbDn, setNbDn] = useState(0);
const [nbOrder, setNbOrder] = useState(0);
const [nbInvoice, setNbInvoice] = useState(0);
const [nbPyament, setNbPayment] = useState(0);
const [nbProject, setNbProject] = useState(0);
const [nbDoc, setNbDoc] = useState(0);

const user = getUserFromToken();
const [unreadMessages,setUnreadMessages]=useState(0);
useEffect(() => {

  const loadQuotes = async () => {

    if (!user?.sub) return;

    const quotes = await fetchQuote(user.sub);
const dn=await fetchDN(user.sub)
const order=await fetchPO(user.sub)
const invoice=await fetchInvoice(user.sub)
const payment=await fetchPayment(user.sub)
const project =await fetchProject(user.sub)
const Doc =await fetchOcrDocuments(user.sub)

    setNbQuote(quotes.length);
    setNbDn(dn.length)
    setNbOrder(order.length)
    setNbInvoice(invoice.length)
    setNbPayment(payment.length)
    setNbProject(project.length)
    setNbDoc(Doc.length)
    console.log(quotes);

  };

  loadQuotes();

}, [user?.sub]);useEffect(() => {
  if (!user?.sub) return;

  const handleReceiveMessage = (message: any) => {
    if (message.receiverId === user.sub) {
      setUnreadMessages((prev) => prev + 1);
    }
  };

socket.on("newMessage", handleReceiveMessage);
  return () => {
    socket.off("receiveMessage", handleReceiveMessage);
  };
}, [user?.sub]);
useEffect(() => {
  if (!user?.sub) return;

  socket.connect();
  socket.emit("join", user.sub);

  return () => {
    socket.disconnect();
  };
}, [user?.sub]);
const menuItems = [
  {
    name: t("menu.dashboard"),
    icon: LayoutDashboard,
    path: "/features/dashboard/pages",
    badge: null,
    color: "",
  },
  {
    name: t("menu.quotes"),
    icon: FileText,
    path: "/features/quotes/pages",
    badge: nbQuote,
    color: "bg-yellow-400",
  },
  {
    name: t("menu.orders"),
    icon: ShoppingCart,
    path: "/features/purchase-order/pages",
    badge: nbOrder,
    color: "bg-orange-400",
  },
  {
    name: t("menu.deliveryNotes"),
    icon: Truck,
    path: "/features/delivery-note/pages",
    badge: nbDn,
    color: "bg-teal-400",
  },
  {
    name: t("menu.invoices"),
    icon: Receipt,
    path: "/features/invoice/pages",
    badge: nbInvoice,
    color: "bg-pink-500",
  },
  {
    name: t("menu.payments"),
    icon: CreditCard,
    path: "/features/payment/pages",
    badge: nbPyament,
    color: "bg-red-500",
  },
  {
    name: t("menu.projects"),
    icon: FolderKanban,
    path: "/features/projects/pages",
    badge: nbProject,
    color: "bg-blue-500",
  },
  {
    name: t("menu.messages"),
    icon: MessageCircle,
    path: "/features/messages/pages",
    badge: unreadMessages,
    color: "bg-purple-500",
  },
        {
      name: t("menu.aidocumentsinsights"),
      icon: Archive,
      path: "/features/iaDocument/pages",
      badge: nbDoc,
      color: "bg-yellow-500",
    },
];
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

    <div
      className={`h-full bg-white rounded-[35px] shadow-xl border border-gray-100 flex flex-col justify-between transition-all duration-300 overflow-hidden ${
        open
          ? "w-[290px]"
          : "w-[95px]"
      }`}
    >

      {/* TOP */}
      <div>

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 pt-7">

          {/* LOGO */}
<h1 className="flex items-center  gap-2 text-2xl font-extrabold text-gray-900 tracking-tight">
  <Image
    src={logo}
    alt="InnoCRM Logo"
    width={60}
    height={40}
    priority
  />

  {open && <span>InnoCRM</span> }
</h1>

          {/* TOGGLE */}
          <button
            onClick={() =>
              setOpen(!open)
            }
            className="text-gray-500 hover:text-black transition"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* TITLE */}
        {open && (
          <p className="text-[12px] font-bold text-gray-400 tracking-widest px-7 mt-10 mb-4 uppercase">
         {t("navigation")}
          </p>
        )}

        {/* MENU */}
        <div className="px-4 space-y-2">

          {menuItems.map(
            (item, index) => {

              const Icon =
                item.icon;

              const isActive =
                pathname ===
                item.path;

              return (

                <a
                  key={index}
                  href={item.path}
                  className={`group flex items-center  justify-between px-4 py-2 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-[#F4F3FF]"
                      : "hover:bg-gray-50"
                  }`}
                >

                  {/* LEFT */}
                  <div className="flex items-center gap-4">

                    {/* ICON */}
                    <div
                      className={`relative ${
                        isActive
                          ? "text-[#6C4DFF]"
                          : "text-gray-500"
                      }`}
                    >
                      <Icon size={22} />

                      {/* DOT MODE */}
                      {!open &&
                         (
                          <span
                            className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${item.color}`}
                          />
                        )}
                    </div>

                    {/* TEXT */}
                    {open && (
                      <span
                        className={`font-medium ${
                          isActive
                            ? "text-[#6C4DFF]"
                            : "text-gray-700"
                        }`}
                      >
                        {item.name}
                      </span>
                    )}
                  </div>

                  {/* BADGE */}
                  {open &&
                     (
                      <span
                        className={`text-white text-xs font-semibold px-2.5 py-1 rounded-full ${item.color}`}
                      >
                        {item.badge}
                      </span>
                    )}
                </a>
              );
            }
          )}
        </div>
      </div>

{/* FOOTER */}
<div className="p-1">

  <div
    className={`bg-white border border-gray-100 rounded-3xl p-3 flex items-center ${
      open
        ? "justify-between"
        : "justify-center"
    } shadow-sm`}
  >

    {/* USER */}
    <div className="flex items-center gap-3 overflow-hidden">

      <div
        className={`w-12 h-12 rounded-full ${getColorFromName(
          user?.name || "User"
        )} flex items-center justify-center text-white font-bold text-lg shrink-0`}
      >
        {(user?.name?.charAt(0) || "U").toUpperCase()}
      </div>

      {open && (
        <div className="overflow-hidden">

          <p className="font-semibold text-gray-800 truncate">
            {user?.name || "Unknown User"}
          </p>

          <p className="text-sm text-gray-400 truncate">
            {user?.email || "No email"}
          </p>

        </div>
      )}

    </div>

    {/* LOGOUT */}
    {open && (
      <button
        onClick={() => {

          localStorage.removeItem("token");

          window.location.href =
            "/features/auth/pages/login";

        }}
        className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition shrink-0"
      >
        <LogOut size={16} />
      </button>
    )}

  </div>

</div>
    </div>
  );
}

export default Sidebar;