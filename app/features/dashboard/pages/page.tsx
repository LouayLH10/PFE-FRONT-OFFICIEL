"use client";
import React, { useEffect, useState,useRef} from 'react'
import KPI from '../components/kpi'
import { CreditCard, FileText, FolderKanban, PieChart, Receipt, Share, Share2Icon, ShoppingCart, Truck } from 'lucide-react'
import UpcomingActivity from '../components/upcomingActivity'
import Reminders from '../components/reminders'
import InvoiceStatusChart from '../components/invoiceStatusChart'
import OrderStatusChart from '../components/orderStatusChart'
import PurchasedProductsChart from '../components/purchasedProductChart'
import { getUserFromToken } from '../../auth/pages/login/user'

import { fetchDashboard, generateDashboardPdf, sendDashboardEmail } from '../service/dashboardService';
import AiRiskChart from '../components/AiRiskChart';
import ProjectStatusChart from '../components/ProjectStatusChart';

function page() {
const [nbQuote, setNbQuote] = useState(0);
const [nbDn, setNbDn] = useState(0);
const [nbOrder, setNbOrder] = useState(0);
const [nbInvoice, setNbInvoice] = useState(0);
const [nbPyament, setNbPayment] = useState(0);
const [nbProject, setNbProject] = useState(0);
const [amount,setAmount]=useState(0)
const [balance,setDueBalance]=useState(0)
const user = getUserFromToken();
const dashboardRef = useRef<HTMLDivElement>(null);
const [invoiceStats, setInvoiceStats] = useState({
  paid: 0,
  sent: 0,
  cancelled: 0,
  draft:0
});
const [orderStats, setOrderStats] = useState({
  approved: 0,
  pending: 0,
  cancelled: 0,
  recieved:0
});
const [purchacedProd, setPurchacedProd] = useState({
  jan: 0,
  feb: 0,
  mar: 0,
  apr:0,
  may:0,
  jun:0,
  jul:0,
  aug:0,
  sep:0,
  oct:0,
  nov:0,
  dec:0
});
const [subject, setSubject] = useState("");
const [message, setMessage] = useState("");
const [dashboard, setDashboard] =
  useState<any>(null);
const [isPdfMode, setIsPdfMode] =
  useState(false);
const [openShareModal, setOpenShareModal] =
  useState(false);

const [pdfFile, setPdfFile] =
  useState<File | null>(null);

const [email, setEmail] =
  useState("");
  const currentYear = new Date().getFullYear();

const years = Array.from(
  { length: currentYear - 2023 + 1 },
  (_, index) => 2023 + index
).reverse(); // pour afficher la plus récente en premier
const [openSuccessModal, setOpenSuccessModal] =
  useState(false);
const [selectedYear, setSelectedYear] =
  useState(currentYear);
const handleSendEmail = async () => {
  try {
    if (!pdfFile) {
      return;
    }

    await new Promise((resolve) =>
      setTimeout(resolve, 200)
    );

    await sendDashboardEmail(
      pdfFile,
      email,
      subject,
      message
    );

    setIsPdfMode(false);

    setOpenShareModal(false);

    setEmail("");
    setSubject("");
    setMessage("");

    setOpenSuccessModal(true);
  } catch (error) {
    console.error(error);
  }
};
useEffect(() => {
  const loadData = async () => {
    if (!user?.sub) return;

    try {
      const data =
        await fetchDashboard(user.sub);
console.log(data)
      setDashboard(data);
    } catch (error) {
      console.error(error);
    }
  };

  loadData();
}, [user?.sub]);

  return (
<div
  ref={dashboardRef}
  className={`flex flex-col gap-6 ${
    isPdfMode
      ? "w-[1200px] bg-white"
      : ""
  }`}
>

  {/* HEADER */}
  <div className="flex justify-between items-center">

    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        Dashboard
       
      </h1>

      <p className="text-gray-500">
        Overview of your business metrics
      </p>
    </div>
    <div className='flex flex-col xl:flex-row gap-6'>
{!isPdfMode && (
 <select
  value={selectedYear}
  onChange={(e) =>
    setSelectedYear(Number(e.target.value))
  }
  className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
>
  {years.map((year) => (
    <option
      key={year}
      value={year}
    >
      {year}
    </option>
  ))}
</select>
)}
        {!isPdfMode && (
  <button
    onClick={() =>
    generateDashboardPdf(
      dashboardRef,
      setPdfFile,
      setOpenShareModal,
      setIsPdfMode
    )
  }
    className="w-12 h-12 flex items-center justify-center bg-[#6C4DFF] text-white rounded-2xl shadow-lg hover:bg-[#5b3df0] transition"
  >
    <Share2Icon size={20} />
  </button>
)}


    </div>
        
  </div>

{/* KPI SECTION */}
<div
  className={
    isPdfMode
      ? "grid grid-cols-3 gap-5"
      : "flex gap-6 overflow-x-auto pb-2 scrollbar-hide"
  }
>
  <div className="min-w-[260px] flex-shrink-0">
    <KPI
      title="Projects"
      number={
        dashboard?.projects?.totalProjects || 0
      }
      href="/features/projects/pages"
      icon={
        <FolderKanban
          size={22}
          className="text-blue-600"
        />
      }
      color="bg-blue-100"
    />
  </div>

  <div className="min-w-[260px] flex-shrink-0">
    <KPI
      title="Purchase Orders"
      number={
        dashboard?.logistics
          ?.purchaseOrders || 0
      }
      href="/features/purchase-order/pages"
      icon={
        <ShoppingCart
          size={22}
          className="text-orange-600"
        />
      }
      color="bg-orange-100"
    />
  </div>

  <div className="min-w-[260px] flex-shrink-0">
    <KPI
      title="Delivery Notes"
      number={
        dashboard?.logistics
          ?.deliveryNotes || 0
      }
      href="/features/delivery-note/pages"
      icon={
        <Truck
          size={22}
          className="text-green-600"
        />
      }
      color="bg-green-100"
    />
  </div>

  <div className="min-w-[260px] flex-shrink-0">
    <KPI
      title="Revenue"
      number={`${
        dashboard?.finance
          ?.totalRevenue || 0
      } TND`}
      icon={
        <CreditCard
          size={22}
          className="text-emerald-600"
        />
      }
      color="bg-emerald-100"
    />
  </div>

  <div className="min-w-[260px] flex-shrink-0">
    <KPI
      title="Paid Amount"
      number={`${
        dashboard?.finance
          ?.totalPaid || 0
      } TND`}
      icon={
        <Receipt
          size={22}
          className="text-green-600"
        />
      }
      color="bg-green-100"
    />
  </div>

  <div className="min-w-[260px] flex-shrink-0">
    <KPI
      title="Unpaid Amount"
      number={`${
        dashboard?.finance
          ?.totalUnpaid || 0
      } TND`}
      icon={
        <Receipt
          size={22}
          className="text-red-600"
        />
      }
      color="bg-red-100"
    />
  </div>

  <div className="min-w-[260px] flex-shrink-0">
    <KPI
      title="OCR Documents"
      number={
        dashboard?.ocr
          ?.totalDocuments || 0
      }
      icon={
        <FileText
          size={22}
          className="text-purple-600"
        />
      }
      color="bg-purple-100"
    />
  </div>

  <div className="min-w-[260px] flex-shrink-0">
    <KPI
      title="AI High Risk"
      number={
        dashboard?.ai?.highRisk || 0
      }
      icon={
        <PieChart
          size={22}
          className="text-red-600"
        />
      }
      color="bg-red-100"
    />
  </div>
</div>

  {/* MAIN CONTENT */}
{isPdfMode ? (
  <>
    <div className="grid grid-cols-2 gap-5">

      <InvoiceStatusChart
        paid={
          dashboard?.finance?.paidInvoices || 0
        }
        unpaid={
          dashboard?.finance?.unpaidInvoices || 0
        }
      />

      <ProjectStatusChart
        completed={
          dashboard?.projects?.completedProjects || 0
        }
        active={
          dashboard?.projects?.activeProjects || 0
        }
        pending={
          dashboard?.projects?.pendingProjects || 0
        }
      />

    </div>

    <div className="mt-5">
      <AiRiskChart
        high={
          dashboard?.ai?.highRisk || 0
        }
        medium={
          dashboard?.ai?.mediumRisk || 0
        }
        low={
          dashboard?.ai?.lowRisk || 0
        }
      />
    </div>

    <div className="grid grid-cols-2 gap-5 mt-5">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100">
        <UpcomingActivity />
      </div>

      <Reminders />
    </div>
  </>
) : (
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

    <div className="xl:col-span-2 space-y-6">

      <div className="flex flex-col xl:flex-row gap-6">

        <div className="flex-1">
          <InvoiceStatusChart
            paid={
              dashboard?.finance?.paidInvoices || 0
            }
            unpaid={
              dashboard?.finance?.unpaidInvoices || 0
            }
          />
        </div>

        <div className="flex-1">
          <ProjectStatusChart
            completed={
              dashboard?.projects?.completedProjects || 0
            }
            active={
              dashboard?.projects?.activeProjects || 0
            }
            pending={
              dashboard?.projects?.pendingProjects || 0
            }
          />
        </div>

      </div>

      <div className="mt-6">
        <AiRiskChart
          high={
            dashboard?.ai?.highRisk || 0
          }
          medium={
            dashboard?.ai?.mediumRisk || 0
          }
          low={
            dashboard?.ai?.lowRisk || 0
          }
        />
      </div>

    </div>

    <div className="space-y-6">

      <div className="overflow-y-auto h-137 bg-white rounded-3xl shadow-sm border border-gray-100">
        <UpcomingActivity />
      </div>

      <Reminders />

    </div>

  </div>
)}
{openShareModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl">

      <h2 className="text-xl font-bold text-gray-800 mb-2">
        Share Dashboard Report
      </h2>

      <p className="text-sm text-gray-500 mb-5">
        Send the generated PDF report by email
      </p>

      {/* Recipient */}
      <input
        type="email"
        placeholder="Recipient email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:border-[#6C4DFF]"
      />

      {/* Subject */}
      <input
        type="text"
        placeholder="Email subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:border-[#6C4DFF]"
      />

      {/* Message */}
      <textarea
        placeholder="Write your message..."
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none resize-none focus:border-[#6C4DFF]"
      />

      {/* PDF */}
      {pdfFile && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-4">
          <p className="text-sm text-gray-600">
            📄 {pdfFile.name}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3">

        <button
          onClick={() => setOpenShareModal(false)}
          className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
         onClick={handleSendEmail}

          className="px-4 py-2 rounded-xl bg-[#6C4DFF] text-white hover:bg-[#5b3df0]"
        >
          Send
        </button>

      </div>

    </div>
  </div>
)}
{openSuccessModal && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-3xl p-8 shadow-xl max-w-sm w-full text-center">

      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-2">
        Email Sent
      </h3>

      <p className="text-gray-500 mb-6">
        Dashboard report has been sent successfully.
      </p>

      <button
        onClick={() =>
          setOpenSuccessModal(false)
        }
        className="w-full py-3 rounded-xl bg-[#6C4DFF] text-white hover:bg-[#5b3df0]"
      >
        OK
      </button>

    </div>
  </div>
)}
</div>
  )
}

export default page
