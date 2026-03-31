"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";
import type { Vehicle } from "@/types";

// ── Bid Modal ──────────────────────────────────────────────
function BidModal({ vehicle, onClose }: { vehicle: Vehicle; onClose: () => void }) {
  const [bidAmount, setBidAmount] = useState("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-red-500">Place Your Bid</h2>
            <p className="text-sm text-gray-600 mt-0.5">{vehicle.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex cursor-pointer items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="relative w-full h-44 bg-gray-100">
          <Image src={vehicle.image} alt={vehicle.name} fill className="object-cover" />
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-medium">Bid Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Enter your bid"
                className="w-full border border-gray-200 rounded-xl pl-7 pr-3 py-2.5 text-sm text-gray-800 outline-none focus:border-red-400 transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-2">
            {[500, 1000, 2000].map((amt) => (
              <button
                key={amt}
                onClick={() => setBidAmount((prev) => String(parseInt(prev || "0") + amt))}
                className="flex-1 py-2 cursor-pointer rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 transition-colors hover:border-red-300 hover:text-red-500"
              >
                +${amt >= 1000 ? `${amt / 1000},000` : amt}
              </button>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Estimated Value</span>
              <span className="font-semibold text-gray-800">
                ${vehicle.estimatedValue?.toLocaleString() ?? "—"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Current High Bid</span>
              <span className="font-bold text-red-500">
                ${vehicle.currentHighBid?.toLocaleString() ?? "—"}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border cursor-pointer border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button className="flex-1 py-2.5 rounded-xl cursor-pointer bg-[#D93E39] text-white text-sm font-bold transition-colors hover:bg-red-600">
              Place Bid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── VehicleCard ────────────────────────────────────────────
type VehicleCardProps = {
  vehicle: Vehicle;
  showViewDetails?: boolean;
  showPlaceBid?: boolean;
};

export default function VehicleCard({
  vehicle,
  showViewDetails = true,
  showPlaceBid = true,
}: VehicleCardProps) {
  const router = useRouter();
  const [showBidModal, setShowBidModal] = useState(false);

  console.log("vehicle Data", vehicle);

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Image — no heart icon */}
        {/* <div className="relative h-44 w-full bg-gray-100">
          <Image src={vehicle.image} alt={vehicle.name} fill className="object-cover" />
        </div> */}
        <div className="relative w-full aspect-16/10 bg-gray-100 overflow-hidden">
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        <div className="p-4 flex flex-col gap-3 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">{vehicle.name}</h3>
            <span className="text-sm font-bold text-[#D93E39]">
              ${vehicle.price.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Mileage", value: `${vehicle.mileage.toLocaleString()} mi` },
              { label: "Condition", value: vehicle.condition },
              { label: "Location", value: vehicle.location },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[10px] text-gray-400">{item.label}</p>
                <p className="text-xs font-semibold text-gray-700 mt-0.5 leading-tight">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {(showViewDetails || showPlaceBid) && (
            <div className="flex gap-2 mt-auto pt-1">
              {showViewDetails && (
                <button
                  onClick={() => router.push(`/vehicles/${vehicle.id}`)}
                  className="flex-1 py-2 rounded-xl border cursor-pointer border-[#D93E39] text-[#D93E39] text-xs font-semibold hover:bg-red-50 transition-colors"
                >
                  See Details
                </button>
              )}
              {showPlaceBid && (
                <button
                  onClick={() => setShowBidModal(true)}
                  className="flex-1 py-2 rounded-xl cursor-pointer bg-[#D93E39] text-white text-xs font-semibold hover:bg-red-600 transition-colors"
                >
                  Place Bid
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showPlaceBid && showBidModal && (
        <BidModal vehicle={vehicle} onClose={() => setShowBidModal(false)} />
      )}
    </>
  );
}
