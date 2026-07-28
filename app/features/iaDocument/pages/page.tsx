"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { getUserFromToken } from "../../auth/pages/login/user";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/searchBar";
import { fetchOcrDocuments } from "../service/aiOCRService";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
export type OcrDocument = {
  id: number;

  fileName: string;
  originalName: string;
  mimeType: string;
  fileUrl: string;

  documentType:
    | "invoice"
    | "quote"
    | "OcrDocument"
    | "purchase_order"
    | "delivery_note"
    | "payment";

  contactId?: number;

  extractedText: string;

  aiSummary: string;
confidenceScore:number
  extractedJson?: {
    invoice_number?: string;
    quote_number?: string;
    OcrDocument_number?: string;

    date?: string;

    client?: {
      name?: string;
      email?: string;
      address?: string;
    };

    items?: {
      description: string;
      quantity: number;
      unit_price: string;
      total: string;
    }[];

    subtotal?: string;

    tax?: {
      percentage?: string;
      amount?: string;
    };

    total?: string;
  };

  aiInsights?: {
    summary: string;

    priority:
      | "LOW"
      | "MEDIUM"
      | "HIGH";

    risks: string[];
risk_percentage:number;
    recommendations: string[];

    financial_analysis?: {
      subtotal?: number;
      tax?: number;
      total?: number;
      currency?: string;
      payment_risk?: string;
    };
  };

  status: string;

  processingTime?: number | null;

 

  createdAt: string;
  updatedAt: string;
  aiExecutiveReport:string;
  invoiceId?: number | null;
  quoteId?: number | null;
  OcrDocumentId?: number | null;
  paymentId?: number | null;
  deliveryNoteId?: number | null;
  purchaseOrderId?: number | null;
};
function Page() {
  const [OcrDocuments, setOcrDocuments] = useState<OcrDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [query, setQuery] = useState("");
const { t } = useTranslation("iaDocument");
  const router = useRouter();
const [openRow, setOpenRow] = useState<number | null>(null);
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
  const formatDateDeadline = (dateString: string) => {
    const date = new Date(dateString);

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`
  };
  // ✅ filter
const filteredOcrDocuments = OcrDocuments.filter((doc) => {
  const search = query.toLowerCase();

  return (
    doc.fileName?.toLowerCase().includes(search) ||
    doc.originalName?.toLowerCase().includes(search) ||
    doc.documentType?.toLowerCase().includes(search) ||
    doc.status?.toLowerCase().includes(search) ||
    doc.extractedText?.toLowerCase().includes(search) ||
    doc.aiSummary?.toLowerCase().includes(search) ||
    doc.extractedJson?.client?.name
      ?.toLowerCase()
      .includes(search) ||
    doc.extractedJson?.client?.email
      ?.toLowerCase()
      .includes(search)
  );
});
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
        const data = await fetchOcrDocuments(user.sub);

        setOcrDocuments(data); // déjà tableau
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
      default:
        return {
          state: status,
          style: "bg-gray-400 text-white px-2 py-1 rounded",
        };
    }
  };
const phaseStatus= (status:String)=>{
    switch (status) {
      case "IN_PROGRESS":
        return {
          state: "IN PROGRESS",
          style: "bg-yellow-500 text-white px-2 py-1 rounded",
        };
      case "PLANNED":
        return {
          state: "PLANNED",
          style: "bg-blue-500 text-white px-2 py-1 rounded",
        };

      default:
        return {
          state: status,
          style: "bg-green-600 text-white px-2 py-1 rounded",
        };
    }
}
const delivrableStatus= (status:String)=>{
    switch (status) {
      case "IN_PROGRESS":
        return {
          state: "IN PROGRESS",
          style: "bg-yellow-500 text-white px-2 py-1 rounded",
        };
      case "PENDING":
        return {
          state: "PENDING",
          style: "bg-blue-500 text-white px-2 py-1 rounded",
        };

      default:
        return {
          state: status,
          style: "bg-green-600 text-white px-2 py-1 rounded",
        };
    }
}
  if (!isAuthChecked) return null;

  return (
    <div className="p-6 mt-5">
   

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder={t("search")}   
      />

{loading && <p>{t("loading")}</p>}
{error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
<div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100">
<table className="min-w-full text-sm text-gray-700">

  {/* HEADER */}
  <thead className="bg-gray-50 border-b border-gray-200">
    <tr>

      <th className="px-6 py-5"></th>

      <th className="px-6 py-5 text-left">
{t("fileName")}
      </th>

      <th className="px-6 py-5 text-left">
{t("type")}
      </th>

      <th className="px-6 py-5 text-left">
{t("status")}
      </th>

      <th className="px-6 py-5 text-left">
{t("riskPercentage")}
      </th>

      <th className="px-6 py-5 text-left">
{t("priority")}
      </th>

      <th className="px-6 py-5 text-left">
{t("createdAt")}
      </th>

    </tr>
  </thead>

  {/* BODY */}
  <tbody>

    {filteredOcrDocuments.length === 0 ? (

      <tr>

        <td
          colSpan={7}
          className="text-center py-10 text-gray-400"
        >
{t("noResults")}
        </td>
      </tr>

    ) : (

      filteredOcrDocuments.map((d, index) => {

        const statusObj =
          Status(d.status);

        return (

          <React.Fragment key={d.id}>

            {/* MAIN ROW */}
            <tr
              className={`border-b border-gray-100 transition hover:bg-gray-50 ${
                index % 2 === 0
                  ? "bg-white"
                  : "bg-gray-50/40"
              }`}
            >
              {/* EXPAND */}
              <td className="px-6 py-5">
                <button
                  onClick={() =>
                    setOpenRow( 
                      openRow === d.id
                        ? null
                        : d.id
                    )
                  }
                >
                  <ChevronDown
                    className={`transition-transform duration-300 ${
                      openRow === d.id
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>
              </td>

              {/* FILE */}
              <td className="px-6 py-5 font-semibold">
                {d.originalName}
              </td>

              {/* TYPE */}
              <td className="px-6 py-5">
                {d.documentType}
              </td>

              {/* STATUS */}
              <td className="px-6 py-5">
                <span
                  className={`${statusObj.style} px-3 py-1 rounded-full text-xs font-semibold`}
                >
                  {statusObj.state}
                </span>
              </td>

              {/* CONFIDENCE */}
              <td className="px-6 py-5">
               {d.aiInsights?.risk_percentage}
                  
              </td>

              {/* PRIORITY */}
              <td className="px-6 py-5">
              {d.aiInsights?.priority === "LOW"
  ? t("priorityLow")
  : d.aiInsights?.priority === "MEDIUM"
  ? t("priorityMedium")
  : d.aiInsights?.priority === "HIGH"
  ? t("priorityHigh")
  : "-"}
              </td>

              {/* CREATED */}
              <td className="px-6 py-5">
                {formatDate(
                  d.createdAt
                )}
              </td>

            </tr>

            {/* DETAILS */}
  <tr>
  <td
    colSpan={7}
    className="p-0 border-none"
  >
    <div
      className={`overflow-hidden transition-all duration-500 ${
        openRow === d.id
          ? "max-h-[4000px] opacity-100"
          : "max-h-0 opacity-0"
      }`}
    >
      <div className="bg-gray-50 p-8">

        {/* SUMMARY */}
        <div className="bg-white rounded-2xl border p-5 mb-6">

          <h3 className="font-bold text-lg mb-3">
{t("aiSummary")}
          </h3>

          <p className="text-gray-700">
            {d.aiInsights?.summary ||
             t("noSummary")
}
          </p>

        </div>
<div className="bg-white rounded-2xl border p-5 mb-6">

  <h3 className="font-bold text-lg mb-3">
{t("executiveReport")}
  </h3>

  <p className="text-gray-700 whitespace-pre-wrap">
    {d.aiExecutiveReport ||
      t("noExecutiveReport")}
  </p>

</div>
        {/* RISKS + RECOMMENDATIONS */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white rounded-2xl border p-5">

            <h3 className="font-bold text-lg mb-3 text-red-600">
{t("risks")}
            </h3>

            {d.aiInsights?.risks?.length ? (
              <ul className="list-disc ml-5 space-y-2">
                {d.aiInsights.risks.map(
                  (
                    risk: string,
                    index: number
                  ) => (
                    <li key={index}>
                      {risk}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p>{t("noRisks")}</p>
            )}

          </div>

          <div className="bg-white rounded-2xl border p-5">

            <h3 className="font-bold text-lg mb-3 text-green-600">
{t("recommendations")}
              </h3>

            {d.aiInsights
              ?.recommendations
              ?.length ? (
              <ul className="list-disc ml-5 space-y-2">
                {d.aiInsights.recommendations.map(
                  (
                    rec: string,
                    index: number
                  ) => (
                    <li key={index}>
                      {rec}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p>
{t("noRecommendations")}
              </p>
            )}

          </div>

        </div>

        {/* FINANCIAL ANALYSIS */}
        {(d.documentType === "invoice" ||
          d.documentType === "quote") &&
          d.aiInsights?.financial_analysis && (

            <div className="mt-6 bg-white rounded-2xl border p-5">

              <h3 className="font-bold text-lg mb-4">
{t("financialAnalysis")}
              </h3>

              <div className="grid md:grid-cols-4 gap-4">

                <div className="bg-gray-50 rounded-xl p-4">

                  <p className="text-sm text-gray-500">
{t("subtotal")}
                  </p>

                  <p className="font-bold text-lg">
                    {
                      d.aiInsights
                        .financial_analysis
                        .subtotal
                    }{" "}
                    {
                      d.aiInsights
                        .financial_analysis
                        .currency
                    }
                  </p>

                </div>

                <div className="bg-gray-50 rounded-xl p-4">

                  <p className="text-sm text-gray-500">
{t("tax")}
                  </p>

                  <p className="font-bold text-lg">
                    {
                      d.aiInsights
                        .financial_analysis
                        .tax
                    }{" "}
                    {
                      d.aiInsights
                        .financial_analysis
                        .currency
                    }
                  </p>

                </div>

                <div className="bg-gray-50 rounded-xl p-4">

                  <p className="text-sm text-gray-500">
{t("total")}
                  </p>

                  <p className="font-bold text-lg">
                    {
                      d.aiInsights
                        .financial_analysis
                        .total
                    }{" "}
                    {
                      d.aiInsights
                        .financial_analysis
                        .currency
                    }
                  </p>

                </div>

                <div className="bg-gray-50 rounded-xl p-4">

                  <p className="text-sm text-gray-500">
                    {t("paymentRisk")}
                  </p>

                  <p
                    className={`font-bold text-lg ${
                      d.aiInsights
                        .financial_analysis
                        .payment_risk ===
                      "HIGH"
                        ? "text-red-600"
                        : d.aiInsights
                            .financial_analysis
                            .payment_risk ===
                          "MEDIUM"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {
                      d.aiInsights
                        .financial_analysis
                        .payment_risk
                    }
                  </p>

                </div>

              </div>

            </div>
          )}

        {/* CONFIDENCE SCORE */}
        <div className="mt-6 bg-white rounded-2xl border p-5">

          <h3 className="font-bold text-lg mb-4">
{t("ocrConfidence")}
          </h3>

          <div className="w-full bg-gray-200 rounded-full h-4">

            <div
              className={`h-4 rounded-full ${
                d.confidenceScore >= 80
                  ? "bg-green-500"
                  : d.confidenceScore >= 60
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{
                width: `${d.confidenceScore}%`,
              }}
            />

          </div>

          <p className="mt-2 text-sm text-gray-600">
            {d.confidenceScore}% {t("ocrReliability")}
          </p>

        </div>

        {/* RISK SCORE */}
        {d.aiInsights?.risk_percentage && (

          <div className="mt-6 bg-white rounded-2xl border p-5">

            <h3 className="font-bold text-lg mb-4">
{t("riskScore")}
            </h3>

            <div className="w-full bg-gray-200 rounded-full h-4">

              <div
                className={`h-4 rounded-full ${
                  d.aiInsights.risk_percentage >= 70
                    ? "bg-red-500"
                    : d.aiInsights.risk_percentage >= 40
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{
                  width: `${d.aiInsights.risk_percentage}%`,
                }}
              />

            </div>

            <p className="mt-2 text-sm text-gray-600">
              {d.aiInsights.risk_percentage}% {t("businessRisk")}
            </p>

          </div>

        )}

        {/* OCR TEXT */}

 

      </div>
    </div>
  </td>
</tr>

          </React.Fragment>

        );
      })

    )}

  </tbody>

</table>
</div>
      )}
    </div>
  );
}

export default Page;