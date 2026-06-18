"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { getUserFromToken } from "../../auth/pages/login/user";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/searchBar";
import { fetchInvoice } from "../service/invoiceService";
import { downloadInvoice } from "../service/invoiceService";

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

        setInvoice(data); // déjà tableau
        setError("");
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des invoice");
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
<div className="p-6 mt-5 ">     

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search invoice..."
      />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
  <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-200">

  <table className="min-w-full text-sm text-gray-700">
    
    {/* HEADER */}
    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
      <tr>
        <th className="px-6 py-5 text-left font-semibold">Reference</th>
        <th className="px-6 py-5 text-left font-semibold">Email</th>
        <th className="px-6 py-5 text-left font-semibold">Website</th>
        <th className="px-6 py-5 text-left font-semibold">Description</th>
        <th className="px-6 py-5 text-left font-semibold">Amount</th>
        <th className="px-6 py-5 text-left font-semibold">TVA</th>
        <th className="px-6 py-5 text-left font-semibold">Total</th>
        <th className="px-6 py-5 text-left font-semibold">Status</th>
        <th className="px-6 py-5 text-left font-semibold">Created At</th>
        <th className="px-6 py-5 text-left font-semibold">Action</th>
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
            No results found
          </td>
        </tr>
      ) : (
        filteredInvoice.map((d, index) => {
          const statusObj = Status(d.status);

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
                    Client Email
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
                  Visit
                </a>
              </td>

              {/* DESCRIPTION */}
              <td className="px-6 py-5">
                <div className="max-w-[250px]">
                  <p className="font-medium text-gray-800">
                    {d.name}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Invoice Description
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
                  {d.tva * 100}%
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
                    Created Date
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