"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { getUserFromToken } from "../../auth/pages/login/user";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/searchBar";
import { fetchInvoice } from "../service/invoiceService";
import { downloadInvoice } from "../service/invoiceService";
import { analyseDocument, fetchOcrDocuments, verifyExistence } from "../../iaDocument/service/aiOCRService";
import { useTranslation } from "react-i18next";
import VoiceRecorder from "../../components/voiceRecorder";
import EstimateInvoiceModal from "../../components/EstimateQuoteModal";
import { Mic } from "lucide-react";

type Invoice = {
  id: number;
  adresse: string;
  phone: string;
  email: string;
  webSite: string;
  name: string;
  total: number;
  tva: number;
  subTotal: number;
  createdAt: string;
  validatedAt?: string;
  reference: string;
  status: string;
  contact:{
    user:{
      email:String
    };
  };
  
};

function Page() {
  const [invoice, setInvoice] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [query, setQuery] = useState("");
   const [userId, setUserId] = useState(0);
   const [processing, setProcessing] = useState(false);
   const [missingProducts, setMissingProducts] = useState<string[]>([]);
const [analyzedDocuments, setAnalyzedDocuments] =
  useState<Record<number, boolean>>({});
useEffect(() => {
  const loadAnalysisStatus = async () => {
    const result: Record<number, boolean> = {};

    for (const inv of invoice) {
      result[inv.id] = await verifyExistence(
        inv.id,
        "invoice"
      );
    }

    setAnalyzedDocuments(result);
  };

  if (invoice.length) {
    loadAnalysisStatus();
  }
}, [invoice]);
  const router = useRouter();
  const { t } = useTranslation("invoice");
 const [loadingAnalysis, setLoadingAnalysis] =
  useState(false);
const [openEstimateModal, setOpenEstimateModal] = useState(false);
  // ✅ format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  // ✅ filter
  const filteredInvoice = invoice.filter((d) =>
    d.reference?.toLowerCase().includes(query.toLowerCase()) ||
    d.email?.toLowerCase().includes(query.toLowerCase()) ||
    d.name?.toLowerCase().includes(query.toLowerCase()) ||
    d.total?.toString().includes(query)
  );

  // ✅ AUTH + FETCH
  useEffect(() => {
    const user = getUserFromToken();

    if (!user) {
      router.push("/features/auth/pages/login");
      return;
    }

    setIsAuthChecked(true);

    const fetchDev = async () => {
      try {
        setLoading(true);

        // ❗ CORRECTION ICI
        const data = await fetchInvoice(user.sub);

        setInvoice(data);
        setUserId(user.sub) // déjà tableau
        setError("");
      } catch (err) {
        console.error(err);
setError(t("loadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchDev();
  }, [router]);
  const handleAnalyse = async (
  id: number,

) => {
  try {
    setLoadingAnalysis(true);

    await analyseDocument(
      id,
      "invoice",
      userId
    );

    router.push(
      "/features/iaDocument/pages"
    );
  } catch (error) {
    console.error(error);
  } finally {
    setLoadingAnalysis(false);
  }
};
  // ✅ DOWNLOAD


  // ✅ STATUS
const Status = (status: string) => {
  switch (status) {
    case "DRAFT":
      return {
        state: t("statusDraft"),
        style: "bg-yellow-500 text-white px-2 py-1 rounded",
      };

    case "SENT":
      return {
        state: t("statusSent"),
        style: "bg-blue-500 text-white px-2 py-1 rounded",
      };

    case "PAID":
      return {
        state: t("statusPaid"),
        style: "bg-green-500 text-white px-2 py-1 rounded",
      };

    case "CANCELLED":
      return {
        state: t("statusCancelled"),
        style: "bg-red-500 text-white px-2 py-1 rounded",
      };

    default:
      return {
        state: status,
        style: "bg-gray-400 text-white px-2 py-1 rounded",
      };
  }
};

  if (!isAuthChecked) return null;

  return (
<div className="p-6 mt-5 ">     


      {loading && <p>{t("loading")}</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
  <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-200">

  <table className="min-w-full text-sm text-gray-700">
    
    {/* HEADER */}
    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
      <tr>
        <th className="px-6 py-5 text-left font-semibold">{t("reference")}</th>
        <th className="px-6 py-5 text-left font-semibold">{t("email")}</th>
        <th className="px-6 py-5 text-left font-semibold">{t("website")}</th>
        <th className="px-6 py-5 text-left font-semibold">{t("description")}</th>
        <th className="px-6 py-5 text-left font-semibold">{t("amount")}</th>
        <th className="px-6 py-5 text-left font-semibold">{t("vat")}</th>
        <th className="px-6 py-5 text-left font-semibold">{t("total")}</th>
        <th className="px-6 py-5 text-left font-semibold">{t("status")}</th>
        <th className="px-6 py-5 text-left font-semibold">{t("createdAt")}</th>
        <th className="px-6 py-5 text-left font-semibold">{t("action")}</th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody className="divide-y divide-gray-100">

      {filteredInvoice.length === 0 ? (
        <tr>
          <td
            colSpan={10}
            className="text-center py-10 text-gray-400"
          >
           {t("noResults")}
          </td>
        </tr>
      ) : (
        filteredInvoice.map((d, index) => {
          const statusObj = Status(d.status);
  const isAnalyzed =
  analyzedDocuments[d.id] ;
          return (
            <tr
              key={d.id}
              className={`transition hover:bg-gray-50 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              }`}
            >
              {/* REFERENCE */}
              <td className="px-6 py-5 font-semibold text-gray-900">
                {d.reference}
              </td>

              {/* EMAIL */}
              <td className="px-6 py-5">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {d.contact?.user?.email}
                  </span>

                  <span className="text-xs text-gray-400">
{t("clientEmail")}
                  </span>
                </div>
              </td>

              {/* WEBSITE */}
              <td className="px-6 py-5">
                <a
                  href={d.webSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium hover:underline"
                >
{t("visit")}                </a>
              </td>

              {/* DESCRIPTION */}
              <td className="px-6 py-5">
                <div className="max-w-[250px]">
                  <p className="font-medium text-gray-800">
                    {d.name}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                   {t("invoiceDescription")}
                  </p>
                </div>
              </td>

              {/* AMOUNT */}
              <td className="px-6 py-5 font-medium">
                {d.subTotal} TND
              </td>

              {/* TVA */}
              <td className="px-6 py-5">
                <span className="font-semibold">
                  {d.tva }%
                </span>
              </td>

              {/* TOTAL */}
              <td className="px-6 py-5">
                <span className="font-bold text-gray-900">
                  {d.total} TND
                </span>
              </td>

              {/* STATUS */}
              <td className="px-6 py-5">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusObj.style}`}
                >
                  {statusObj.state}
                </div>
              </td>

              {/* DATE */}
              <td className="px-6 py-5">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {formatDate(d.createdAt)}
                  </span>

                  <span className="text-xs text-gray-400">
                    {t("createdDate")}
                  </span>
                </div>
                
              </td>

              {/* ACTION */}
              <td className="px-6 py-5">
                <button
                  disabled={
                    d.status !== "SENT" &&
                    d.status !== "PAID"
                  }
                  onClick={() => downloadInvoice(d.id)}
                  className={`px-5 py-2 rounded-xl text-sm font-medium text-white transition ${
                    d.status === "SENT" ||
                    d.status === "PAID"
                      ? "bg-green-600 hover:bg-green-700 shadow-sm"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {t("download")}
                </button>
                
<button
  disabled={
    d.status === "CANCELLED" ||
  isAnalyzed
  }
  onClick={() =>
    handleAnalyse(d.id)
  }
  className={`px-5 ml-2 py-2 rounded-xl text-sm font-medium text-white transition ${
    d.status !== "CANCELLED" &&
    !isAnalyzed
      ? "bg-yellow-600 hover:bg-yellow-700 shadow-sm"
      : "bg-gray-300 cursor-not-allowed"
  }`}
>
{
  isAnalyzed
    ? t("alreadyAnalysed")
    : t("analyse")
}
    
</button>
              </td>
            </tr>
          );
        })
      )}
    </tbody>
  </table>
  
</div>
      )}
      {
  loadingAnalysis && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      <div className="bg-white rounded-2xl p-8 w-[400px] text-center shadow-xl">

        <div className="flex justify-center mb-5">

          <div className="h-16 w-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />

        </div>

        <h2 className="text-xl font-bold mb-2">
         {t("analysisTitle")}
        </h2>

        <p className="text-gray-600">
       {t("analysisDescription")}
        </p>

      </div>

    </div>
  )
}
    </div>
  );
}

export default Page;