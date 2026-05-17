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
      <h1 className="text-2xl font-bold mb-6">List of Quote</h1>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search quote..."
      />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white shadow rounded-2xl">
          <table className="min-w-full text-sm">
 <thead className="bg-gray-100">
  <tr>
    <th className="px-4 py-3 text-left">Reference</th>
    <th className="px-4 py-3 text-left">Supplier</th>
    <th className="px-4 py-3 text-left">Email</th>
    <th className="px-4 py-3 text-left">Phone</th>
    <th className="px-4 py-3 text-left">Order Date</th>
    <th className="px-4 py-3 text-left">Delivery Date</th>
    <th className="px-4 py-3 text-left">SubTotal</th>
    <th className="px-4 py-3 text-left">Tax</th>
    <th className="px-4 py-3 text-left">Total</th>
    <th className="px-4 py-3 text-left">Status</th>
    <th className="px-4 py-3 text-left">Created At</th>
    <th className="px-4 py-3 text-left">Action</th>
  </tr>
</thead>

<tbody>
  {filteredPO.length === 0 ? (
    <tr>
      <td colSpan={10} className="text-center py-4 text-gray-500">
        No results found
      </td>
    </tr>
  ) : (
    filteredPO.map((po) => {
      const statusObj = Status(po.status);

      return (
        <tr key={po.id} className="border-t hover:bg-gray-50">

          <td className="px-4 py-3">
            <b>{po.reference}</b>
          </td>

          <td className="px-4 py-3">{po.supplierName}</td>

          <td className="px-4 py-3">{po.supplierEmail}</td>

          <td className="px-4 py-3">{po.supplierPhone}</td>

          <td className="px-4 py-3">
            {formatDate(po.orderDate)}
          </td>

          <td className="px-4 py-3">
            {po.deliveryDate ? formatDate(po.deliveryDate) : "-"}
          </td>

          <td className="px-4 py-3">
            {po.subTotal} TND
          </td>

          <td className="px-4 py-3">
            {po.tax} TND
          </td>

          <td className="px-4 py-3 font-semibold">
            {po.total} TND
          </td>

          <td className="px-4 py-3">
            <div className={statusObj.style}>
              {statusObj.state}
            </div>
          </td>

          <td className="px-4 py-3">
            {formatDate(po.createdAt)}
          </td>

          <td className="px-4 py-3">
            <button
              onClick={() => downloadPO(po.id)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
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