// import clsx from "clsx";
// import type { ActivityItem } from "@/types";

// const dotColor = {
//   green: "bg-green-400",
//   yellow: "bg-yellow-400",
//   blue: "bg-blue-400",
// };

// export default function RecentActivity({ items }: { items: ActivityItem[] }) {
//   return (
//     <section className="">
//       <h3 className="text-sm font-bold text-gray-800 mb-3">Recent Activity</h3>
//       <div className="space-y-4">
//         {items.map((item) => (
//           <div key={item.id} className="flex items-start gap-3 border">
//             <span
//               className={clsx(
//                 "mt-1.5 w-2 h-2 rounded-full shrink-0",
//                 dotColor[item.status]
//               )}
//             />
//             <div className="">
//               <p className="text-sm text-gray-700">{item.text}</p>
//               <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

import clsx from "clsx";
import type { ActivityItem } from "@/types";

const dotColor = {
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  blue: "bg-blue-500",
};

export default function RecentActivity({ items }: { items: ActivityItem[] }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-gray-800 mb-3">
        Recent Activity
      </h3>

      <div className="rounded-xl border border-gray-200 overflow-hidden">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={clsx(
              "flex items-start gap-3 px-4 py-3",
              index !== items.length - 1 && "border-b border-gray-200"
            )}
          >
            {/* Dot */}
            <span
              className={clsx(
                "mt-2 w-2.5 h-2.5 rounded-full shrink-0",
                dotColor[item.status]
              )}
            />

            {/* Content */}
            <div>
              <p className="text-sm text-gray-700 leading-snug">
                {item.text}
              </p>
              <p className="text-xs text-gray-400 mt-1">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}