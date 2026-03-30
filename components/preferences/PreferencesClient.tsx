// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { useState } from "react";
// import {
//   Car,
//   Truck,
//   Bike,
//   Bus,
//   CarFront,
//   Caravan,
//   Container,
//   Hammer,
// } from "lucide-react";
// import clsx from "clsx";

// const vehicleTypes = [
//   { id: "cars", label: "Cars", icon: Car },
//   { id: "trucks", label: "Trucks", icon: Truck },
//   { id: "suvs", label: "SUVs", icon: CarFront },
//   { id: "diesel", label: "Diesel Trucks", icon: Truck },
//   { id: "motorcycles", label: "Motorcycles", icon: Bike },
//   { id: "campers", label: "Campers/RVs", icon: Caravan },
//   { id: "trailers", label: "Trailers", icon: Container },
//   { id: "commercial", label: "Commercial Vehicles", icon: Bus },
//   { id: "work", label: "Work Trucks", icon: Hammer },
// ];

// const conditions = ["New", "Used", "Certified"];
// const titleTypes = ["Clean", "Salvage", "Rebuilt", "Lien"];

// export default function PreferencesClient() {
//   const [selectedTypes, setSelectedTypes] = useState<string[]>(["cars", "trucks"]);
//   const [priceRange, setPriceRange] = useState(145000);
//   const [maxMileage, setMaxMileage] = useState("45000");
//   const [selectedCondition, setSelectedCondition] = useState("New");
//   const [titleType, setTitleType] = useState("Clean");
//   const [titleDropdownOpen, setTitleDropdownOpen] = useState(false);

//   const toggleType = (id: string) => {
//     setSelectedTypes((prev) =>
//       prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
//     );
//   };

//   const formatPrice = (val: number) => {
//     if (val >= 1000000) return "$1M+";
//     if (val >= 500000) return "$500k+";
//     return `$${(val / 1000).toFixed(0)}k`;
//   };

//   const sliderPercent = ((priceRange - 10000) / (500000 - 10000)) * 100;

//   return (
//     <div className="flex flex-col lg:flex-row gap-5 relative pb-20 mt-6">
//       {/* LEFT — Vehicle Types */}
//       <div className="w-full lg:w-56 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
//         <div className="flex items-center gap-2 mb-4">
//           {/* Custom icon */}
//           <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//             <path d="M3 7h4l2-3h6l2 3h4" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" />
//             <rect x="2" y="7" width="20" height="12" rx="3" stroke="#EF4444" strokeWidth="1.8" />
//             <circle cx="7" cy="19" r="2" fill="#EF4444" />
//             <circle cx="17" cy="19" r="2" fill="#EF4444" />
//           </svg>
//           <h2 className="text-sm font-bold text-gray-800">Vehicle Types</h2>
//         </div>

//         <div className="space-y-1.5">
//           {vehicleTypes.map(({ id, label, icon: Icon }) => {
//             const checked = selectedTypes.includes(id);
//             return (
//               <button
//                 key={id}
//                 onClick={() => toggleType(id)}
//                 className={clsx(
//                   "w-full flex cursor-pointer items-center justify-between px-3 py-2.5 rounded-xl border text-sm transition-all",
//                   checked
//                     ? "border-gray-200 bg-white"
//                     : "border-gray-100 bg-white hover:bg-gray-50"
//                 )}
//               >
//                 <div className="flex items-center gap-2.5">
//                   <Icon size={16} className="text-gray-500 shrink-0" />
//                   <span className="text-gray-700 font-medium">{label}</span>
//                 </div>
//                 {/* Checkbox */}
//                 <div
//                   className={clsx(
//                     "w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0",
//                     checked
//                       ? "bg-[#D93E39] border-[#D93E39]"
//                       : "border-gray-300 bg-white"
//                   )}
//                 >
//                   {checked && (
//                     <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
//                       <path
//                         d="M1 4L3.5 6.5L9 1"
//                         stroke="white"
//                         strokeWidth="1.5"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                   )}
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* RIGHT — Acquisition Filters */}
//       <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-6">
//         <div className="flex items-center gap-2">
//           <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//             <line x1="4" y1="6" x2="20" y2="6" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" />
//             <line x1="7" y1="12" x2="17" y2="12" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" />
//             <line x1="10" y1="18" x2="14" y2="18" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" />
//           </svg>
//           <h2 className="text-sm font-bold text-gray-800">Acquisition Filters</h2>
//         </div>

//         {/* Price Range + Max Mileage */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           {/* Price Slider */}
//           <div>
//             <div className="flex items-center justify-between mb-3">
//               <span className="text-xs text-gray-500">Max Price Range</span>
//               <span className="text-sm font-bold text-gray-800">
//                 ${priceRange.toLocaleString()}
//               </span>
//             </div>

//             {/* Custom Slider */}
//             <div className="relative">
//               <input
//                 type="range"
//                 min={10000}
//                 max={500000}
//                 step={5000}
//                 value={priceRange}
//                 onChange={(e) => setPriceRange(Number(e.target.value))}
//                 className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
//                 style={{
//                   background: `linear-gradient(to right, #EF4444 ${sliderPercent}%, #E5E7EB ${sliderPercent}%)`,
//                 }}
//               />
//             </div>

//             <div className="flex justify-between mt-1.5">
//               <span className="text-[10px] text-gray-400">$10k</span>
//               <span className="text-[10px] text-gray-400">$500k+</span>
//             </div>
//           </div>

//           {/* Max Mileage */}
//           <div>
//             <label className="text-xs text-gray-500 block mb-3">
//               Max Mileage
//             </label>
//             <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
//               <input
//                 type="number"
//                 value={maxMileage}
//                 onChange={(e) => setMaxMileage(e.target.value)}
//                 className="flex-1 px-4 py-3 text-sm font-bold text-gray-800 outline-none"
//               />
//               <div className="px-4 py-3 bg-gray-50 border-l border-gray-200">
//                 <span className="text-xs font-semibold text-gray-500 tracking-wide">
//                   MILES
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Preferred Condition + Title Type */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           {/* Condition */}
//           <div>
//             <label className="text-xs text-gray-500 block mb-3">
//               Preferred Condition
//             </label>
//             <div className="flex gap-2 flex-wrap">
//               {conditions.map((c) => (
//                 <button
//                   key={c}
//                   onClick={() => setSelectedCondition(c)}
//                   className={clsx(
//                     "px-4 py-2 rounded-xl cursor-pointer text-sm font-semibold border transition-all",
//                     selectedCondition === c
//                       ? "bg-[#D93E39] text-white border-[#D93E39]"
//                       : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
//                   )}
//                 >
//                   {c}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Title Type Dropdown */}
//           <div>
//             <label className="text-xs text-gray-500 block mb-3">
//               Title Type
//             </label>
//             <div className="relative">
//               <button
//                 onClick={() => setTitleDropdownOpen(!titleDropdownOpen)}
//                 className="w-full cursor-pointer flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:border-gray-300 transition-colors"
//               >
//                 {titleType}
//                 <svg
//                   width="16"
//                   height="16"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   className={clsx(
//                     "transition-transform text-gray-400",
//                     titleDropdownOpen && "rotate-180"
//                   )}
//                 >
//                   <path
//                     d="M6 9l6 6 6-6"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               </button>

//               {titleDropdownOpen && (
//                 <>
//                   <div
//                     className="fixed inset-0 z-10"
//                     onClick={() => setTitleDropdownOpen(false)}
//                   />
//                   <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white border border-gray-100 rounded-xl shadow-lg py-1">
//                     {titleTypes.map((t) => (
//                       <button
//                         key={t}
//                         onClick={() => {
//                           setTitleType(t);
//                           setTitleDropdownOpen(false);
//                         }}
//                         className={clsx(
//                           "w-full text-left px-4 py-2.5 text-sm transition-colors",
//                           titleType === t
//                             ? "text-[#D93E39] cursor-pointer bg-red-50 font-medium"
//                             : "text-gray-600 hover:bg-gray-50"
//                         )}
//                       >
//                         {t}
//                       </button>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Buttons — fixed on mobile, normal on desktop */}
//       <div className="fixed bottom-0 left-0 right-0 lg:absolute lg:bottom-0 lg:left-auto lg:right-0 lg:w-auto flex gap-3 p-4 lg:p-0 bg-white lg:bg-transparent border-t border-gray-100 lg:border-0 z-30">
//         <button className="flex-1 cursor-pointer lg:flex-none lg:px-8 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors bg-white">
//           Cancel
//         </button>
//         <button className="flex-1 cursor-pointer lg:flex-none lg:px-8 py-2.5 rounded-xl bg-[#D93E39] text-white text-sm font-semibold transition-colors">
//           Save Preferences
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import {
  Car, Truck, CarFront, Bike, Bus, Caravan, Container, Hammer,
} from "lucide-react";
import clsx from "clsx";

const vehicleTypes = [
  { id: "cars", label: "Cars", icon: Car },
  { id: "trucks", label: "Trucks", icon: Truck },
  { id: "suvs", label: "SUVs", icon: CarFront },
  { id: "diesel", label: "Diesel Trucks", icon: Truck },
  { id: "motorcycles", label: "Motorcycles", icon: Bike },
  { id: "campers", label: "Campers/RVs", icon: Caravan },
  { id: "trailers", label: "Trailers", icon: Container },
  { id: "commercial", label: "Commercial Vehicles", icon: Bus },
  { id: "work", label: "Work Trucks", icon: Hammer },
];

const dropdownOptions = ["Clean", "Salvage", "Rebuilt", "Lien", "Any"];

function Dropdown({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex-1 min-w-0">
      <label className="block text-xs text-gray-500 mb-1.5 font-medium">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:border-gray-300 transition-colors"
        >
          {value}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className={clsx(
              "transition-transform text-gray-400 shrink-0",
              open && "rotate-180"
            )}
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
            />
            <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white border border-gray-100 rounded-xl shadow-lg py-1">
              {dropdownOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={clsx(
                    "w-full text-left px-4 py-2.5 text-sm transition-colors",
                    value === opt
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
    </div>
  );
}

export default function PreferencesClient() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["cars", "trucks"]);
  const [priceRange, setPriceRange] = useState("Clean");
  const [mileagePref, setMileagePref] = useState("Clean");
  const [titleTolerance, setTitleTolerance] = useState("Clean");
  const [buyingVolume, setBuyingVolume] = useState("Clean");

  const toggleType = (id: string) => {
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 relative pb-20 lg:pb-0">
      {/* LEFT — Vehicle Types */}
      <div className="w-full lg:w-56 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 7h4l2-3h6l2 3h4"
              stroke="#D93E39"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <rect
              x="2" y="7" width="20" height="12" rx="3"
              stroke="#D93E39"
              strokeWidth="1.8"
            />
            <circle cx="7" cy="19" r="2" fill="#D93E39" />
            <circle cx="17" cy="19" r="2" fill="#D93E39" />
          </svg>
          <h2 className="text-sm font-bold text-gray-800">Vehicle Types</h2>
        </div>

        <div className="space-y-1.5">
          {vehicleTypes.map(({ id, label, icon: Icon }) => {
            const checked = selectedTypes.includes(id);
            return (
              <button
                key={id}
                onClick={() => toggleType(id)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className="text-gray-500 shrink-0" />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
                {/* Checkbox */}
                <div
                  className={clsx(
                    "w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0",
                    checked
                      ? "bg-[#D93E39] border-[#D93E39]"
                      : "border-gray-300 bg-white"
                  )}
                >
                  {checked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT — Acquisition Filters */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-6">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <line x1="4" y1="6" x2="20" y2="6" stroke="#D93E39" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="7" y1="12" x2="17" y2="12" stroke="#D93E39" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="10" y1="18" x2="14" y2="18" stroke="#D93E39" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <h2 className="text-sm font-bold text-gray-800">Acquisition Filters</h2>
        </div>

        {/* Row 1 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Dropdown label="Price Range" value={priceRange} onChange={setPriceRange} />
          <Dropdown label="Mileage preference" value={mileagePref} onChange={setMileagePref} />
        </div>

        {/* Row 2 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Dropdown label="Title Tolerance" value={titleTolerance} onChange={setTitleTolerance} />
          <Dropdown label="Buying Volume" value={buyingVolume} onChange={setBuyingVolume} />
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 lg:absolute lg:-bottom-15 lg:left-auto lg:right-0 lg:w-auto flex gap-3 p-4 lg:p-0 bg-white lg:bg-transparent border-t border-gray-100 lg:border-0 z-30">
        <button className="flex-1 lg:flex-none lg:px-8 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors bg-white">
          Cancel
        </button>
        <button className="flex-1 lg:flex-none lg:px-8 py-2.5 rounded-xl bg-[#D93E39] text-white text-sm font-semibold hover:bg-red-600 transition-colors">
          Save Preferences
        </button>
      </div>
    </div>
  );
}