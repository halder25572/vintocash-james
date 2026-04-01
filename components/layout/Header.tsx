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

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

type DealerInfoResponse = {
  success: boolean;
  data?: {
    name: string;
    contact_name: string;
    profile_image: string | null;
  };
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_DEAL || "https://secondbackend.vintocash.com/api";

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

const FALLBACK_PROFILE_IMAGE = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face";

const buildImageCandidates = (imagePath: string | null | undefined) => {
  if (!imagePath) return [];
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return [imagePath];

  const normalized = imagePath.replace(/^\/+/, "");
  const timestamp = new Date().getTime();
  const candidates = [
    `${API_ORIGIN}/${normalized}?v=${timestamp}`,
    `${API_ORIGIN}/storage/${normalized}?v=${timestamp}`,
    `${API_BASE_URL}/${normalized}?v=${timestamp}`,
  ];

  return [...new Set(candidates)];
};

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
  const token = useAuthStore((state) => state.token);
  const authUser = useAuthStore((state) => state.user);
  const [hydrated, setHydrated] = useState(false);
  const [dealerName, setDealerName] = useState<string>(authUser?.name || "Dealer");
  const [dealerImageCandidates, setDealerImageCandidates] = useState<string[]>([]);
  const [dealerImageIndex, setDealerImageIndex] = useState(0);

  const dealerImage = dealerImageCandidates[dealerImageIndex] || FALLBACK_PROFILE_IMAGE;

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (authUser?.name) {
      setDealerName(authUser.name);
    }

    if (!token) return;

    const fetchDealerInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/dealer/info`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result: DealerInfoResponse = await response.json();
        if (!response.ok || !result.success || !result.data) return;

        setDealerName(result.data.name || result.data.contact_name || authUser?.name || "Dealer");
        setDealerImageCandidates(buildImageCandidates(result.data.profile_image));
        setDealerImageIndex(0);
      } catch {
        // Keep fallback values from auth store on request failure.
      }
    };

    fetchDealerInfo();
  }, [hydrated, token, authUser?.name]);

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
            <h2 className="text-[16px] font-bold text-black">{dealerName}</h2>
            <p className="text-[#6D717F] text-[16px] font-medium -mt-1">
              Dealer
            </p>
          </div>

          {/* Profile Picture */}
          <div className="shrink-0 ml-auto">
            <div className="w-14 h-14 overflow-hidden relative">
              <Image
                src={dealerImage}
                alt={dealerName}
                width={50}
                height={50}
                className="object-cover rounded-full"
                priority
                onError={() => setDealerImageIndex((prev) => prev + 1)}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}