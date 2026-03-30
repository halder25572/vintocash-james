// "use client";

// import Image from "next/image";

// export default function Header({ title = "Dashboard" }: { title?: string }) {

//   return (
//     <header className="flex items-center justify-between">
//       <h2 className="text-xl font-semibold text-gray-800 ml-10 lg:ml-0">
//         {title}
//       </h2>

//       <div className="flex items-center gap-3 py-2.25">
//         <div className="flex items-center gap-4 px-6">
//           {/* Bell Icon */}
//           <div className="shrink-0 w-12 h-12 flex items-center justify-center">
//            <Image src="/icons/bell.png" width={50} height={50} alt="images" />
//           </div>

//           {/* Text Content */}
//           <div className="flex flex-col">
//             <h2 className="text-[16px] font-bold text-black">
//               Shaun Marphy
//             </h2>
//             <p className="text-[#6D717F] text-[16px] font-medium -mt-1">
//               Dealer
//             </p>
//           </div>

//           {/* Profile Picture */}
//           <div className="shrink-0 ml-auto">
//             <div className="w-14 h-14 overflow-hidden relative">
//               <Image
//                 src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
//                 alt="Shaun Marphy"
//                 width={50}
//                 height={50}
//                 className="object-cover rounded-full"
//                 priority // optional: good for above-the-fold images
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/vehicles": "Vehicles",
  "/preferences": "Preferences",
  "/my-bids": "My Bids",
  "/messages": "Messages",
  "/settings": "Settings",
};

type HeaderProps = {
  title?: string;
};

export default function Header({ title }: HeaderProps) {
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] ?? "Dashboard";
  const finalTitle = title ?? pageTitle;

  return (
      <header className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-800 ml-10 lg:ml-0">
        {finalTitle}
      </h2>

      <div className="flex items-center gap-3 py-2.25">
        <div className="flex items-center gap-4 px-6">
          {/* Bell Icon */}
          <div className="shrink-0 w-12 h-12 flex items-center justify-center">
            <Image src="/icons/bell.png" width={50} height={50} alt="images" />
          </div>

          {/* Text Content */}
          <div className="flex flex-col">
            <h2 className="text-[16px] font-bold text-black">Shaun Marphy</h2>
            <p className="text-[#6D717F] text-[16px] font-medium -mt-1">
              Dealer
            </p>
          </div>

          {/* Profile Picture */}
          <div className="shrink-0 ml-auto">
            <div className="w-14 h-14 overflow-hidden relative">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                alt="Shaun Marphy"
                width={50}
                height={50}
                className="object-cover rounded-full"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}