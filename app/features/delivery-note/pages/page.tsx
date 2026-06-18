"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { getUserFromToken } from "../../auth/pages/login/user";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/searchBar";
import { downloadDN,fetchDN } from "../service/deliveryNoteService";

type DeliveryNote = {
  id: number;
  reference: string;

  deliveryDate: string;
  location: string;

  status: string;

  createdAt: string;

  contact: {
    user?: {
      email?: string;
      name?: string;
    };
    phone?: string;
  };

  items: {
    id: number;
    description: string;
    quantity: number;
    unity: string;
  }[];
};

function Page() {
  const [deliveryNotes, setDeliveryNotes] = useState<DeliveryNote[]>([]);
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
const filteredDN = deliveryNotes.filter((dn) =>
  dn.reference.toLowerCase().includes(query.toLowerCase()) ||
  dn.location.toLowerCase().includes(query.toLowerCase()) ||
  dn.contact?.user?.email?.toLowerCase().includes(query.toLowerCase())
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
        const data = await fetchDN(user.sub);

        setDeliveryNotes(data); // déjà tableau
        setError("");
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des Delivery Note");
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
        placeholder="Search Delivey Note..."
      />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
<div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-200">

  <table className="min-w-full text-sm text-gray-700">

    {/* HEADER */}
    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
      <tr>
        <th className="px-6 py-5 text-left font-semibold">
          Reference
        </th>

        <th className="px-6 py-5 text-left font-semibold">
          Client
        </th>

        <th className="px-6 py-5 text-left font-semibold">
          Email
        </th>

        <th className="px-6 py-5 text-left font-semibold">
          Location
        </th>

        <th className="px-6 py-5 text-left font-semibold">
          Delivery Date
        </th>

        <th className="px-6 py-5 text-left font-semibold">
          Items
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
    <tbody className="divide-y divide-gray-100">

      {filteredDN.length === 0 ? (
        <tr>
          <td
            colSpan={9}
            className="text-center py-10 text-gray-400"
          >
            No results found
          </td>
        </tr>
      ) : (
        filteredDN.map((dn, index) => {
          const statusObj = Status(dn.status);

          return (
            <tr
              key={dn.id}
              className={`transition hover:bg-gray-50 ${
                index % 2 === 0
                  ? "bg-white"
                  : "bg-gray-50/50"
              }`}
            >

              {/* REFERENCE */}
              <td className="px-6 py-5 font-semibold text-gray-900">
                {dn.reference}
              </td>

              {/* CLIENT */}
              <td className="px-6 py-5">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {dn.contact?.user?.name || "-"}
                  </span>

                  <span className="text-xs text-gray-400">
                    Client Name
                  </span>
                </div>
              </td>

              {/* EMAIL */}
              <td className="px-6 py-5">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {dn.contact?.user?.email || "-"}
                  </span>

                  <span className="text-xs text-gray-400">
                    Contact Email
                  </span>
                </div>
              </td>

              {/* LOCATION */}
              <td className="px-6 py-5">
                <div className="max-w-[220px]">
                  <p className="font-medium text-gray-800">
                    {dn.location}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Delivery Location
                  </p>
                </div>
              </td>

              {/* DELIVERY DATE */}
              <td className="px-6 py-5">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {formatDate(dn.deliveryDate)}
                  </span>

                  <span className="text-xs text-gray-400">
                    Scheduled Delivery
                  </span>
                </div>
              </td>

              {/* ITEMS */}
              <td className="px-6 py-5">
                <span className="font-semibold">
                  {dn.items?.length || 0} items
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

              {/* CREATED */}
              <td className="px-6 py-5">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {formatDate(dn.createdAt)}
                  </span>

                  <span className="text-xs text-gray-400">
                    Created Date
                  </span>
                </div>
              </td>

              {/* ACTION */}
              <td className="px-6 py-5">
                <button
                  onClick={() => downloadDN(dn.id)}
                  className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition shadow-sm"
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