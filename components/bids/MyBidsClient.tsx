"use client";

import Image from "next/image";
import clsx from "clsx";

const bidStats = [
  { label: "Active Value", value: "$1.42M" },
  { label: "On Progress Auctions", value: "12" },
];

type BidStatus = "Active" | "Outbid" | "Won";

const bids = [
  {
    id: "1",
    name: "2020 Honda Accord",
    location: "Los Angeles, CA",
    image: "/images/2.png",
    bidAmount: "$21,000",
    status: "Active" as BidStatus,
    timeLeft: "2d 14h",
  },
  {
    id: "2",
    name: "2021 Toyota Camry",
    location: "Phoenix, AZ",
    image: "/images/Toyota.png",
    bidAmount: "$24,000",
    status: "Outbid" as BidStatus,
    timeLeft: "1d 8h",
  },
  {
    id: "3",
    name: "2022 Ford F-150",
    location: "Houston, TX",
    image: "/images/1.png",
    bidAmount: "$41,000",
    status: "Won" as BidStatus,
    timeLeft: "Ended",
  },
];

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
  return (
    <div className="space-y-5">
      {/* Welcome */}
      <div>
        <h1 className="text-lg font-bold text-gray-900">Welcome, Daniel</h1>
        <p className="text-sm text-gray-400">
          Monitoring real-time auction data and high-torque opportunities.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {bidStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border-b-10 border-[#D2D5DB] rounded-2xl border shadow-sm px-8 py-7 text-center"
          >
            <p className="text-[2rem] font-bold text-gray-900 tracking-tight leading-none">
              {stat.value}
            </p>
            <p className="text-sm text-gray-400 mt-2.5">{stat.label}</p>
          </div>
        ))}
      </div>

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
            {bids.map((bid) => {
              const s = statusConfig[bid.status];
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
                          src={bid.image}
                          alt={bid.name}
                          fill
                          className="object-cover"
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
                      {bid.bidAmount}
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
                        {bid.status}
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
          {bids.map((bid) => {
            const s = statusConfig[bid.status];
            return (
              <div key={bid.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={bid.image}
                        alt={bid.name}
                        fill
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
                    {bid.status}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-400">Bid Amount</p>
                    <p className="text-sm font-bold text-gray-800">
                      {bid.bidAmount}
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
    </div>
  );
}