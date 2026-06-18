"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { getUserFromToken } from "../../auth/pages/login/user";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/searchBar";
import { downloadPayment, fetchPayment } from "../service/paymentService";
type Payment = {
  id: number;
  amount: number;
  status: string;
  paymentDate: string;
  createdAt?: string;

  invoiceId: number;

  // 🔗 relation invoice
  invoice: {
    id: number;
    name: string;
    status: string;

    reference: string;

    issueDate: string;
    dueDate: string;

    subTotal: number;
    discountTotal: number;
    taxTotal: number;
    total: number;
    tva: number;

    amountPaid: number;
    balanceDue: number;

    paymentTerms: string;
    currency: string;

    createdAt: string;

    contactId: number;
    projectId: number;

    // 🔥 optionnel (si include)
    contact?: {
      user?: {
        name?: string;
        email?: string;
      };
    };
  };
};

function Page() {
  const [payment, setPayment] = useState<Payment[]>([]);
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
const filteredPayment = payment.filter((d) =>
  d.invoice?.reference?.toLowerCase().includes(query.toLowerCase()) ||
  d.status?.toLowerCase().includes(query.toLowerCase()) ||
  d.invoice?.contact?.user?.email
    ?.toLowerCase()
    .includes(query.toLowerCase()) ||
  d.amount?.toString().includes(query)
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
        const data = await fetchPayment(user.sub);

        setPayment(data); // déjà tableau
        setError("");
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des payment");
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
<div className="w-full p-1 mt-5 ">

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search payment..."
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
          Amount
        </th>

        <th className="px-6 py-5 text-left font-semibold">
          Invoice
        </th>

        <th className="px-6 py-5 text-left font-semibold">
          Payment Date
        </th>

        <th className="px-6 py-5 text-left font-semibold">
          Status
        </th>

        <th className="px-6 py-5 text-left font-semibold">
          Action
        </th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody>
      {filteredPayment.length === 0 ? (
        <tr>
          <td
            colSpan={6}
            className="text-center py-10 text-gray-400"
          >
            No results found
          </td>
        </tr>
      ) : (
        filteredPayment.map((d, index) => {
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
                PAY-{d.id}
              </td>

              {/* Amount */}
              <td className="px-6 py-5">
                <div className="font-bold text-gray-900">
                  {d.amount} {d.invoice?.currency || "TND"}
                </div>
              </td>

              {/* Invoice */}
              <td className="px-6 py-5">
                <span className="font-medium text-gray-700">
                  {d.invoice?.reference || "-"}
                </span>
              </td>

              {/* Payment Date */}
              <td className="px-6 py-5">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {formatDate(d.paymentDate)}
                  </span>
                </div>
              </td>

              {/* Status */}
              <td className="px-6 py-5">
                <div
                  className={`${statusObj.style} inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold`}
                >
                  {statusObj.state}
                </div>
              </td>

              {/* Action */}
              <td className="px-6 py-5">
                <button
                  onClick={() => downloadPayment(d.id)}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 shadow-sm transition"
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