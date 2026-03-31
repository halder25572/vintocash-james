"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

type PaginationProps = {
  total?: number;
  current?: number;
  onPageChange?: (page: number) => void;
};

export default function Pagination({
  total = 12,
  current = 1,
  onPageChange,
}: PaginationProps) {
  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  // Generate page numbers with ellipsis
  const generatePages = () => {
    const pages: (number | string)[] = [];

    if (total <= 5) {
      // Show all pages if total is 5 or less
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current > 3) {
        pages.push("...");
      }

      // Show current page and neighbors
      for (
        let i = Math.max(2, current - 1);
        i <= Math.min(total - 1, current + 1);
        i++
      ) {
        pages.push(i);
      }

      if (current < total - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(total);
    }

    return pages;
  };

  const pages = generatePages();

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      {/* Prev */}
      <button
        onClick={() => handlePageChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-red-300 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={15} />
      </button>

      {/* Pages */}
      {pages.map((p, i) => (
        <button
          key={i}
          onClick={() => typeof p === "number" && handlePageChange(p)}
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
        onClick={() => handlePageChange(Math.min(total, current + 1))}
        disabled={current === total}
        className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-red-300 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
}