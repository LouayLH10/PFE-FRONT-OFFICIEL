"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { getUserFromToken } from "../../auth/pages/login/user";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/searchBar";
import { downloadPO, fetchPO } from "../service/purchaseOrderService";

type PurchaseOrder = {
  id: number;
  reference: string;

  supplierName: string;
  supplierEmail: string;
  supplierPhone: string;

  orderDate: string;
  deliveryDate?: string;

  status: string;

  subTotal: number;
  tax: number;
  total: number;

  notes?: string;

  createdAt: string;

  contact: {
    user?: {
      email?: string;
    };
  };
};

function Page() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
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
const filteredPO = purchaseOrders.filter((po) =>
  po.reference.toLowerCase().includes(query.toLowerCase()) ||
  po.supplierEmail.toLowerCase().includes(query.toLowerCase()) ||
  po.supplierName.toLowerCase().includes(query.toLowerCase()) ||
  po.total.toString().includes(query)
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
        const data = await fetchPO(user.sub);

        setPurchaseOrders(data); // déjà tableau
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
    case "PENDING":
      return {
        state: "PENDING",
        style: "bg-yellow-500 text-white px-2 py-1 rounded",
      };
    case "APPROVED":
      return {
        state: "APPROVED",
        style: "bg-blue-500 text-white px-2 py-1 rounded",
      };
    case "DELIVERED":
      return {
        state: "DELIVERED",
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
          Supplier
        </th>

        <th className="px-6 py-5 text-left font-semibold">
          Email
        </th>

        <th className="px-6 py-5 text-left font-semibold">
          Phone
        </th>

        <th className="px-6 py-5 text-left font-semibold">
          Order Date
        </th>

        <th className="px-6 py-5 text-left font-semibold">
          Delivery Date
        </th>

        <th className="px-6 py-5 text-left font-semibold">
          Subtotal
        </th>

        <th className="px-6 py-5 text-left font-semibold">
          Tax
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
      {filteredPO.length === 0 ? (
        <tr>
          <td
            colSpan={12}
            className="text-center py-10 text-gray-400"
          >
            No results found
          </td>
        </tr>
      ) : (
        filteredPO.map((po, index) => {
          const statusObj = Status(po.status);

          return (
            <tr
              key={po.id}
              className={`border-b border-gray-100 transition hover:bg-gray-50 ${
                index % 2 === 0
                  ? "bg-white"
                  : "bg-gray-50/40"
              }`}
            >

              {/* Reference */}
              <td className="px-6 py-5 font-semibold text-gray-800">
                {po.reference}
              </td>

              {/* Supplier */}
              <td className="px-6 py-5">
                <div className="font-medium">
                  {po.supplierName}
                </div>
              </td>

              {/* Email */}
              <td className="px-6 py-5">
                <span className="text-gray-700">
                  {po.supplierEmail}
                </span>
              </td>

              {/* Phone */}
              <td className="px-6 py-5">
                {po.supplierPhone}
              </td>

              {/* Order Date */}
              <td className="px-6 py-5">
                {formatDate(po.orderDate)}
              </td>

              {/* Delivery Date */}
              <td className="px-6 py-5">
                {po.deliveryDate
                  ? formatDate(po.deliveryDate)
                  : "-"}
              </td>

              {/* Subtotal */}
              <td className="px-6 py-5">
                {po.subTotal} TND
              </td>

              {/* Tax */}
              <td className="px-6 py-5">
                {po.tax} TND
              </td>

              {/* Total */}
              <td className="px-6 py-5 font-bold text-gray-900">
                {po.total} TND
              </td>

              {/* Status */}
              <td className="px-6 py-5">
                <div
                  className={`${statusObj.style} inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold`}
                >
                  {statusObj.state}
                </div>
              </td>

              {/* Created At */}
              <td className="px-6 py-5">
                {formatDate(po.createdAt)}
              </td>

              {/* Action */}
              <td className="px-6 py-5">
                <button
                  onClick={() => downloadPO(po.id)}
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