"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

export default function Pagination({ total = 12 }: { total?: number }) {
  const [current, setCurrent] = useState(1);

  const pages = [1, 2, 3, "...", total];

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      {/* Prev */}
      <button
        onClick={() => setCurrent((p) => Math.max(1, p - 1))}
        disabled={current === 1}
        className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-red-300 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={15} />
      </button>

      {/* Pages */}
      {pages.map((p, i) => (
        <button
          key={i}
          onClick={() => typeof p === "number" && setCurrent(p)}
          disabled={p === "..."}
          className={clsx(
            "w-8 h-8 flex items-center justify-center rounded-xl text-sm font-medium transition-colors",
            p === current
              ? "bg-[#D93E39] text-white border border-[#D93E39]"
              : p === "..."
              ? "text-gray-400 cursor-default"
              : "border border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:text-red-500"
          )}
        >
          {p}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => setCurrent((p) => Math.min(total, p + 1))}
        disabled={current === total}
        className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-red-300 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
}