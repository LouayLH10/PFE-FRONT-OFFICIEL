"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { getUserFromToken } from "../../auth/pages/login/user";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/searchBar";
import { fetchQuote } from "../service/quoteService";
import { downloadQuote } from "../service/quoteService";
import { formatDate, formatTND } from "../../services/generalFunctions";
import { useTranslation } from "react-i18next";
import { Mic } from "lucide-react";
import EstimateInvoiceModal from "../../components/EstimateQuoteModal";
import EstimateQuoteModal from "../../components/EstimateQuoteModal";

type Quote = {
  id: number;
  adresse: string;
  phone: string;
  email: string;
  webSite?: string;
  subject: string;
  amount: number;
  tva: number;
  totalAmount: number;
  createdAt: string;
  reference: string;
  status: string;

  contact: {
    user?: {
      email?: string;
    };
  };
};

function Page() {
  const [quote, setQuote] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [query, setQuery] = useState("");
   const [processing, setProcessing] = useState(false);
     const [missingProducts, setMissingProducts] = useState<string[]>([]);
     const [openEstimateModal, setOpenEstimateModal] = useState(false);
     
const { t } = useTranslation("quotes");
  const router = useRouter();

  // ✅ format date


  // ✅ filter
const filteredQuote = quote.filter((d) =>
  d.reference.toLowerCase().includes(query.toLowerCase()) ||
  d.email.toLowerCase().includes(query.toLowerCase()) ||
  d.subject.toLowerCase().includes(query.toLowerCase()) ||
  d.totalAmount.toString().includes(query)
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
        const data = await fetchQuote(user.sub);

        setQuote(data); // déjà tableau
        setError("");
      } catch (err) {
        console.error(err);
        setError(t("loadingError"));
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
        state: t("status.draft").toUpperCase(),
        style: "bg-yellow-500 text-white px-2 py-1 rounded",
      };
    case "SENT":
      return {
        state: t("status.sent").toUpperCase(),
        style: "bg-blue-500 text-white px-2 py-1 rounded",
      };
    case "READY":
      return {
        state: t("status.ready").toUpperCase(),
        style: "bg-green-500 text-white px-2 py-1 rounded",
      };
    case "PAID":
      return {
        state: t("status.paid").toUpperCase(),
        style: "bg-green-500 text-white px-2 py-1 rounded",
      };
    case "CANCELLED":
      return {
        state: t("status.cancelled").toUpperCase(),
        style: "bg-red-500 text-white px-2 py-1 rounded",
      };
    default:
      return {
        state: status.toUpperCase(),
        style: "bg-gray-400 text-white px-2 py-1 rounded",
      };
  }
};

  if (!isAuthChecked) return null;

return (
  <div className="p-3 sm:p-6 mt-2 sm:mt-5">
 <div className="flex items-center gap-4 mb-6">

    <div className="flex-1">
        <SearchBar
            value={query}
            onChange={setQuery}
          placeholder={t("searchPlaceholder")}  />

    </div>

    <button
        onClick={() => setOpenEstimateModal(true)}
        className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-[#6C4DFF]
            px-6
            py-3
            text-white
            font-medium
            shadow-lg
            hover:bg-[#5b3ff0]
            transition-all
        "
    >
        <Mic size={20} />

        Estimate Quote
    </button>

</div>

<EstimateQuoteModal
    open={openEstimateModal}
    onClose={() => {
        setOpenEstimateModal(false);
        setMissingProducts([]);
    }}
    missingProducts={missingProducts}
    onProductsNotFound={(products) => {
        setMissingProducts(products);
        
    }}
      processing={processing}
    onProcessingChange={setProcessing}
/>
 

    {loading && (
      <p className="mt-5">{t("loading")}</p>
    )}

    {error && (
      <p className="mt-5 text-red-500">{error}</p>
    )}

    {!loading && !error && (
      <>

        {/* ========================= */}
        {/* DESKTOP TABLE */}
        {/* ========================= */}

        <div className="hidden lg:block overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100 mt-5">

          <table className="min-w-full text-sm text-gray-700">

      <thead className="bg-gray-50 border-b border-gray-200">
  <tr className="text-gray-500 text-xs uppercase">
    <th className="px-6 py-5 text-left">
      {t("table.reference")}
    </th>

    <th className="px-6 py-5 text-left">
      {t("table.email")}
    </th>

    <th className="px-6 py-5 text-left">
      {t("table.website")}
    </th>

    <th className="px-6 py-5 text-left">
      {t("table.description")}
    </th>

    <th className="px-6 py-5 text-left">
      {t("table.amount")}
    </th>

    <th className="px-6 py-5 text-left">
      {t("table.tva")}
    </th>

    <th className="px-6 py-5 text-left">
      {t("table.total")}
    </th>

    <th className="px-6 py-5 text-left">
      {t("table.status")}
    </th>

    <th className="px-6 py-5 text-left">
      {t("table.created")}
    </th>

    <th className="px-6 py-5 text-left">
      {t("table.action")}
    </th>
  </tr>
</thead>

            <tbody>

              {filteredQuote.length === 0 ? (

                <tr>

                  <td
                    colSpan={10}
                    className="text-center py-10"
                  >
                    No results found
                  </td>

                </tr>

              ) : (

                filteredQuote.map((d, index) => {

                  const statusObj = Status(d.status);

                  return (

                    <tr
                      key={d.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 ${
                        index % 2 === 0
                          ? "bg-white"
                          : "bg-gray-50/40"
                      }`}
                    >

                      <td className="px-6 py-5 font-semibold">
                        {d.reference}
                      </td>

                      <td className="px-6 py-5">
                        {d.contact?.user?.email || d.email}
                      </td>

                      <td className="px-6 py-5">

                        {d.webSite ? (

                          <a
                            href={d.webSite}
                            target="_blank"
                            className="text-blue-600 hover:underline"
                          >
                            {t("buttons.visit")}
                          </a>

                        ) : (
                          "-"
                        )}

                      </td>

                      <td className="px-6 py-5">
                        {d.subject}
                      </td>

                      <td className="px-6 py-5">
                        {formatTND(d.amount)} 
                      </td>

                      <td className="px-6 py-5">
                        {d.tva}%
                      </td>

                      <td className="px-6 py-5 font-bold">
                        {formatTND(d.totalAmount)}
                      </td>

                      <td className="px-6 py-5">

                        <span
                          className={`${statusObj.style} px-3 py-1 rounded-full text-xs`}
                        >
                          {statusObj.state}
                        </span>

                      </td>

                      <td className="px-6 py-5">
                        {formatDate(d.createdAt)}
                      </td>

                      <td className="px-6 py-5">

                        <button
                          disabled={d.status !== "READY"}
                          onClick={() =>
                            downloadQuote(d.id)
                          }
                          className={`px-4 py-2 rounded-xl text-white ${
                            d.status === "READY"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-gray-300"
                          }`}
                        >
                       { t("buttons.download")}
                        </button>

                      </td>

                    </tr>

                  );

                })

              )}

            </tbody>

          </table>

        </div>

        {/* ========================= */}
        {/* MOBILE CARDS */}
        {/* ========================= */}

   <div className="lg:hidden mt-5 space-y-4">

  {filteredQuote.length === 0 ? (

    <div className="bg-white rounded-3xl p-6 text-center">
      {t("noResults")}
    </div>

  ) : (

    filteredQuote.map((d) => {

      const statusObj = Status(d.status);

      return (

        <div
          key={d.id}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5"
        >

          <div className="flex justify-between items-start">

            <div>

              <h2 className="font-bold text-lg">
                {d.reference}
              </h2>

              <p className="text-sm text-gray-500">
                {formatDate(d.createdAt)}
              </p>

            </div>

            <span
              className={`${statusObj.style} px-3 py-1 rounded-full text-xs`}
            >
              {statusObj.state}
            </span>

          </div>

          <div className="mt-4 space-y-2 text-sm">

            <p>

              <span className="font-semibold">
                {t("mobile.email")} :
              </span>{" "}

              {d.contact?.user?.email || d.email}

            </p>

            <p>

              <span className="font-semibold">
                {t("mobile.description")} :
              </span>{" "}

              {d.subject}

            </p>

            <p>

              <span className="font-semibold">
                {t("mobile.amount")} :
              </span>{" "}

              {formatTND(d.amount)}

            </p>

            <p>

              <span className="font-semibold">
                {t("mobile.tva")} :
              </span>{" "}

              {d.tva}%

            </p>

            <p>

              <span className="font-semibold">
                {t("mobile.total")} :
              </span>{" "}

              {formatTND(d.totalAmount)}

            </p>

            {d.webSite && (

              <a
                href={d.webSite}
                target="_blank"
                className="text-blue-600 underline"
              >
                {t("buttons.visitWebsite")}
              </a>

            )}

          </div>

          <button
            disabled={d.status !== "READY"}
            onClick={() => downloadQuote(d.id)}
            className={`mt-5 w-full py-3 rounded-xl text-white font-semibold ${
              d.status === "READY"
                ? "bg-green-600"
                : "bg-gray-300"
            }`}
          >
            {t("buttons.download")}
          </button>

        </div>

      );

    })

  )}

</div>

      </>
    )}

  </div>
);
}

export default Page;