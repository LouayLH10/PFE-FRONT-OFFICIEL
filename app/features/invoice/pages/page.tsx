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
    d.reference.toLowerCase().includes(query.toLowerCase()) ||
    d.email.toLowerCase().includes(query.toLowerCase()) ||
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    d.total.toString().includes(query)
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
<div className="p-6 mt-5 ">      <h1 className="text-2xl font-bold mb-6">List of Invoice</h1>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search invoice..."
      />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white shadow rounded-2xl">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Reference</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Website</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">TVA (%)</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Created At</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredInvoice.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-gray-500">
                    No results found
                  </td>
                </tr>
              ) : (
                filteredInvoice.map((d) => {
                  const statusObj = Status(d.status);

                  return (
                    <tr key={d.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <b>{d.reference}</b>
                      </td>

                      <td className="px-4 py-3">{d.contact?.user?.email}</td>

                      <td className="px-4 py-3">
                        <a
                          href={d.webSite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Visit
                        </a>
                      </td>

                      <td className="px-4 py-3">{d.name}</td>
                      <td className="px-4 py-3">{d.subTotal} TND</td>
                      <td className="px-4 py-3"><b>{d.tva*100}%</b></td>
                      <td className="px-4 py-3 font-semibold">
                        {d.total} TND
                      </td>

                      <td className="px-4 py-3">
                        <div className={statusObj.style}>
                          {statusObj.state}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {formatDate(d.createdAt)}
                      </td>

                      <td className="px-4 py-3">
                        <button
                          disabled={d.status !== "SENT" && d.status !== "PAID"}
                          onClick={() => downloadInvoice(d.id)}
                          className={`px-4 py-2 rounded-lg text-white transition ${
                            d.status === "SENT" || d.status === "PAID"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-gray-400 cursor-not-allowed"
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