"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { useAuthStore } from "@/store/useAuthStore";

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect width='48' height='48' fill='%23f3f4f6'/%3E%3C/svg%3E";

type BidStatus = "Active" | "Outbid" | "Won";

interface Bid {
  id: string | number;
  name: string;
  location: string;
  image?: string;
  bidAmount: string | number;
  status: BidStatus;
  timeLeft: string;
}

interface MyBidsResponse {
  status: boolean;
  message: string;
  summary: {
    on_progress_bid_value: number | string;
    on_progress_bid_count: number;
    total_won_bid: number;
  };
  data: Bid[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
}

const statusConfig: Record<BidStatus, { bg: string; text: string; border: string }> = {
  Active: {
    bg: "bg-red-50",
    text: "text-red-400",
    border: "border border-red-200",
  },
  Outbid: {
    bg: "bg-orange-50",
    text: "text-orange-400",
    border: "border border-orange-200",
  },
  Won: {
    bg: "bg-emerald-50",
    text: "text-emerald-500",
    border: "border border-emerald-200",
  },
};

export default function MyBidsClient() {
  const token = useAuthStore((state) => state.token);
  const authUser = useAuthStore((state) => state.user);
  const [hydrated, setHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [bidsData, setBidsData] = useState<Bid[]>([]);
  const [summary, setSummary] = useState({
    on_progress_bid_value: 0 as number | string,
    on_progress_bid_count: 0,
    total_won_bid: 0,
  });

  // Zustand hydration check
  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    if (useAuthStore.persist.hasHydrated?.()) setHydrated(true);
    return () => unsub?.();
  }, []);

  // Fetch My Bids
  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      setIsLoading(false);
      setError("Please login to view your bids.");
      return;
    }

    const fetchMyBids = async () => {
      setIsLoading(true);
      setError("");
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEAL || "";
        const response = await fetch(`${API_BASE_URL}/vehicle/my/bids`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result: MyBidsResponse = await response.json();

        if (!response.ok || !result.status || !result.data) {
          throw new Error(
            result.message || "Failed to fetch your bids. Please try again."
          );
        }

        setBidsData(result.data);
        setSummary(result.summary);
      } catch (fetchError) {
        const errorMessage =
          fetchError instanceof Error ? fetchError.message : "An error occurred";
        setError(errorMessage);
        console.error("Error fetching bids:", fetchError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyBids();
  }, [hydrated, token]);

  const formatValue = (value: string | number): string => {
    if (typeof value === "string") return value;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (!hydrated) {
    return (
      <div className="space-y-5">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-center text-sm font-semibold text-red-600">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Welcome */}
      <div>
        <h1 className="text-lg font-bold text-gray-900">
          Welcome, {authUser?.name || "Dealer"}
        </h1>
        <p className="text-sm text-gray-400">
          Monitoring real-time auction data and high-torque opportunities.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border-b-10 border-[#D2D5DB] rounded-2xl border shadow-sm px-8 py-7 text-center">
          <p className="text-[2rem] font-bold text-gray-900 tracking-tight leading-none">
            {formatValue(summary.on_progress_bid_value)}
          </p>
          <p className="text-sm text-gray-400 mt-2.5">On Progress Value</p>
        </div>
        <div className="bg-white border-b-10 border-[#D2D5DB] rounded-2xl border shadow-sm px-8 py-7 text-center">
          <p className="text-[2rem] font-bold text-gray-900 tracking-tight leading-none">
            {summary.on_progress_bid_count}
          </p>
          <p className="text-sm text-gray-400 mt-2.5">On Progress Bids</p>
        </div>
        <div className="bg-white border-b-10 border-[#D2D5DB] rounded-2xl border shadow-sm px-8 py-7 text-center">
          <p className="text-[2rem] font-bold text-gray-900 tracking-tight leading-none">
            {summary.total_won_bid}
          </p>
          <p className="text-sm text-gray-400 mt-2.5">Total Won Bids</p>
        </div>
      </div>

      {/* Empty State */}
      {bidsData.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
          <p className="text-gray-500 text-sm">No bids found. Start bidding on vehicles to see them here.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="hidden sm:table w-full border-collapse">
              <thead>
                <tr
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(239,68,68,0.13) 0%, rgba(239,68,68,0.05) 50%, rgba(255,255,255,0) 100%)",
                  }}
                >
                  {[
                    { label: "Vehicle", align: "text-left", width: "w-[35%]" },
                    { label: "Bid Amount", align: "text-center", width: "w-[18%]" },
                    { label: "Status", align: "text-center", width: "w-[16%]" },
                    { label: "Time Left", align: "text-center", width: "w-[16%]" },
                    { label: "Actions", align: "text-center", width: "w-[15%]" },
                  ].map((col) => (
                    <th
                      key={col.label}
                      className={clsx(
                        col.width,
                        col.align,
                        "px-6 py-4 text-sm font-semibold text-gray-700 whitespace-nowrap border border-gray-200"
                      )}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bidsData.map((bid) => {
                  const s = statusConfig[bid.status || "Active"];
                  return (
                    <tr
                      key={bid.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Vehicle */}
                      <td className="px-6 py-5 border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                            <Image
                              src={bid.image || FALLBACK_IMAGE}
                              alt={bid.name}
                              width={44}
                              height={44}
                              className="object-cover"
                              onError={() => {}}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800 leading-tight">
                              {bid.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {bid.location}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Bid Amount */}
                      <td className="px-6 py-5 text-center border border-gray-200">
                        <span className="text-sm font-semibold text-gray-800">
                          {typeof bid.bidAmount === "number"
                            ? formatValue(bid.bidAmount)
                            : bid.bidAmount}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5 border border-gray-200">
                        <div className="flex justify-center">
                          <span
                            className={clsx(
                              "inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-semibold",
                              s.bg,
                              s.text,
                              s.border
                            )}
                          >
                            {bid.status || "Active"}
                          </span>
                        </div>
                      </td>

                      {/* Time Left */}
                      <td className="px-6 py-5 text-center border border-gray-200">
                        <span className="text-sm text-gray-500">{bid.timeLeft}</span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 text-center border border-gray-200">
                        <button className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors">
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="sm:hidden divide-y divide-gray-100">
              {bidsData.map((bid) => {
                const s = statusConfig[bid.status || "Active"];
                return (
                  <div key={bid.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                          <Image
                            src={bid.image || FALLBACK_IMAGE}
                            alt={bid.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {bid.name}
                          </p>
                          <p className="text-xs text-gray-400">{bid.location}</p>
                        </div>
                      </div>
                      <span
                        className={clsx(
                          "px-3 py-1 rounded-full text-xs font-semibold",
                          s.bg,
                          s.text,
                          s.border
                        )}
                      >
                        {bid.status || "Active"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                      <div className="text-center">
                        <p className="text-[10px] text-gray-400">Bid Amount</p>
                        <p className="text-sm font-bold text-gray-800">
                          {typeof bid.bidAmount === "number"
                            ? formatValue(bid.bidAmount)
                            : bid.bidAmount}
                        </p>
                      </div>
                      <div className="w-px h-8 bg-gray-200" />
                      <div className="text-center">
                        <p className="text-[10px] text-gray-400">Time Left</p>
                        <p className="text-sm font-semibold text-gray-700">
                          {bid.timeLeft}
                        </p>
                      </div>
                      <div className="w-px h-8 bg-gray-200" />
                      <button className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}