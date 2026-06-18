"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { getUserFromToken } from "../../auth/pages/login/user";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/searchBar";
import { fetchQuote } from "../service/quoteService";
import { downloadQuote } from "../service/quoteService";

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

  const router = useRouter();

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
        setError("Erreur lors du chargement des quote");
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
          state: "DRAFT",
          style: "bg-yellow-500 text-white px-2 py-1 rounded",
        };
      case "SENT":
        return {
          state: "SENT",
          style: "bg-blue-500 text-white px-2 py-1 rounded",
        };
      case "PAID":
        return {
          state: "PAID",
          style: "bg-green-500 text-white px-2 py-1 rounded",
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
    <div className="p-6 mt-5">

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search quote..."
      />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
<div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100">
  <table className="min-w-full text-sm text-gray-700">
    
    {/* HEADER */}
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr className="text-gray-500 text-xs uppercase tracking-wider">

        <th className="px-6 py-5 text-left font-semibold">
          Reference
        </th>

        <th className="px-6 py-5 text-left font-semibold">
          Email
        </th>

        <th className="px-6 py-5 text-left font-semibold">
          Website
        </th>

        <th className="px-6 py-5 text-left font-semibold">
          Description
        </th>

        <th className="px-6 py-5 text-left font-semibold">
          Amount
        </th>

        <th className="px-6 py-5 text-left font-semibold">
          TVA
        </th>

        <th className="px-6 py-5 text-left font-semibold">
          Total
        </th>

        <th className="px-6 py-5 text-left font-semibold">
          Status
        </th>

        <th className="px-6 py-5 text-left font-semibold">
          Created At
        </th>

        <th className="px-6 py-5 text-left font-semibold">
          Action
        </th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody>
      {filteredQuote.length === 0 ? (
        <tr>
          <td
            colSpan={10}
            className="text-center py-10 text-gray-400"
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
              className={`border-b border-gray-100 transition hover:bg-gray-50 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/40"
              }`}
            >
              {/* Reference */}
              <td className="px-6 py-5 font-semibold text-gray-800">
                {d.reference}
              </td>

              {/* Email */}
              <td className="px-6 py-5">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {d.contact?.user?.email || d.email}
                  </span>
                </div>
              </td>

              {/* Website */}
              <td className="px-6 py-5">
                {d.webSite ? (
                  <a
                    href={d.webSite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Visit
                  </a>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>

              {/* Description */}
              <td className="px-6 py-5 max-w-[250px]">
                <div className="font-medium text-gray-800">
                  {d.subject}
                </div>
              </td>

              {/* Amount */}
              <td className="px-6 py-5 font-medium">
                {d.amount} TND
              </td>

              {/* TVA */}
              <td className="px-6 py-5">
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                  {d.tva}%
                </span>
              </td>

              {/* Total */}
              <td className="px-6 py-5 font-bold text-gray-900">
                {d.totalAmount} TND
              </td>

              {/* Status */}
              <td className="px-6 py-5">
                <div
                  className={`${statusObj.style} inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold`}
                >
                  {statusObj.state}
                </div>
              </td>

              {/* Created */}
              <td className="px-6 py-5">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {formatDate(d.createdAt)}
                  </span>
                </div>
              </td>

              {/* Action */}
              <td className="px-6 py-5">
                <button
                  disabled={d.status !== "READY"}
                  onClick={() => downloadQuote(d.id)}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold text-white transition ${
                    d.status === "READY"
                      ? "bg-green-600 hover:bg-green-700 shadow-sm"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Download
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
    </div>
  );
}

export default Page;