"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

const filters = [
  {
    label: "Type",
    key: "type",
    options: ["All Types", "Sedan", "SUV", "Truck", "Sports"],
    defaultValue: "All Types",
    accent: true,
  },
  {
    label: "Price Range",
    key: "price",
    options: ["Any Price", "Under $30k", "$30k–$50k", "Above $50k"],
    defaultValue: "Price Range",
  },
  {
    label: "Mileage",
    key: "mileage",
    options: ["Any Mileage", "Under 10k", "10k–30k", "Above 30k"],
    defaultValue: "Mileage",
  },
  {
    label: "Condition",
    key: "condition",
    options: ["Any Condition", "New", "Excellent", "Pristine", "Good"],
    defaultValue: "Condition",
  },
  {
    label: "Location",
    key: "location",
    options: ["Any Location", "TX", "FL", "WA", "CA", "IL", "CO"],
    defaultValue: "Location",
  },
];

export default function VehicleFilters() {
  const [selected, setSelected] = useState<Record<string, string>>({
    type: "All Types",
    price: "Price Range",
    mileage: "Mileage",
    condition: "Condition",
    location: "Location",
  });
  const [open, setOpen] = useState<string | null>(null);

  const handleSelect = (key: string, value: string) => {
    setSelected((prev) => ({ ...prev, [key]: value }));
    setOpen(null);
  };

  const handleClear = () => {
    setSelected({
      type: "All Types",
      price: "Price Range",
      mileage: "Mileage",
      condition: "Condition",
      location: "Location",
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {filters.map((f) => (
        <div key={f.key} className="relative">
          <button
            onClick={() => setOpen(open === f.key ? null : f.key)}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors bg-white",
              open === f.key
                ? "border-red-300 text-[#D93E39]"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            )}
          >
            {f.key === "type" ? (
              <>
                <span className="text-gray-500">Type:</span>
                <span className="text-[#D93E39]">{selected[f.key]}</span>
              </>
            ) : (
              <span>{selected[f.key]}</span>
            )}
            <ChevronDown
              size={14}
              className={clsx(
                "transition-transform",
                open === f.key ? "rotate-180 text-[#D93E39]" : "text-gray-400"
              )}
            />
          </button>

          {/* Dropdown */}
          {open === f.key && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setOpen(null)}
              />
              <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-gray-100 rounded-xl shadow-lg py-1 min-w-35">
                {f.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelect(f.key, opt)}
                    className={clsx(
                      "w-full text-left px-4 py-2 text-sm transition-colors",
                      selected[f.key] === opt
                        ? "text-[#D93E39] bg-red-50 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ))}

      {/* Clear Filters */}
      <button
        onClick={handleClear}
        className="ml-auto cursor-pointer text-sm text-[#D93E39] font-medium transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
}