"use client";

import { useEffect, useState, useRef } from "react";
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
  process.env.NEXT_PUBLIC_API_URL || "https://backend.vintocash.com/api";

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");
const STORAGE_ORIGIN = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend.vintocash.com/api"
).replace(/\/api\/?$/, "");

const DEALER_PROFILE_IMAGE_KEY = "dealer-profile-image-path";

const isDataUrl = (value: string | null | undefined) =>
  Boolean(value && value.startsWith("data:"));

// FIX: cache buster সম্পূর্ণ বাদ — এটাই Next.js Image break করছিল
const buildImageCandidates = (imagePath: string | null | undefined): string[] => {
  if (!imagePath) return [];

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return [imagePath]; // full URL, সরাসরি use করো
  }

  const normalized = imagePath.replace(/^\/+/, "");
  return [...new Set([
    `${API_ORIGIN}/${normalized}`,
    `${STORAGE_ORIGIN}/${normalized}`,
  ])];
};

const fetchDealerInfoSnapshot = async (authToken: string) => {
  const response = await fetch(`${API_BASE_URL}/dealer/info`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  const result: DealerInfoResponse = await response.json();

  if (!response.ok || !result.success || !result.data) {
    throw new Error("Failed to load dealer info.");
  }

  return result.data;
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

  const [dealerName, setDealerName] = useState<string>(authUser?.name || "Dealer");
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  const candidatesRef = useRef<string[]>([]);
  const candidateIndexRef = useRef(0);

  const loadCandidates = (candidates: string[]) => {
    candidatesRef.current = candidates;
    candidateIndexRef.current = 0;
    setImgError(false);
    setProfileImageUrl(candidates[0] || null);
  };

  const handleImgError = () => {
    const next = candidateIndexRef.current + 1;
    if (next < candidatesRef.current.length) {
      candidateIndexRef.current = next;
      setProfileImageUrl(candidatesRef.current[next]);
    } else {
      setProfileImageUrl(null);
      setImgError(true);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");

  useEffect(() => {
    // localStorage থেকে সাথে সাথে দেখাও
    const persisted = window.localStorage.getItem(DEALER_PROFILE_IMAGE_KEY);
    if (persisted) {
      loadCandidates(buildImageCandidates(persisted));
    }

    if (authUser?.name) setDealerName(authUser.name);
    if (!token) return;

    const fetchDealerInfo = async () => {
      try {
        const dealerInfo = await fetchDealerInfoSnapshot(token);
        setDealerName(dealerInfo.name || dealerInfo.contact_name || authUser?.name || "Dealer");

        if (dealerInfo.profile_image) {
          window.localStorage.setItem(DEALER_PROFILE_IMAGE_KEY, dealerInfo.profile_image);
          loadCandidates(buildImageCandidates(dealerInfo.profile_image));
        }
      } catch {
        // auth store এর fallback ব্যবহার হবে
      }
    };

    fetchDealerInfo();

    const handleDealerProfileUpdated = (event: Event) => {
      const { detail } = event as CustomEvent<{
        name?: string;
        image?: string;
        previewImage?: string;
      }>;

      if (detail?.name) setDealerName(detail.name);

      const nextImage = detail?.previewImage || detail?.image;
      if (!nextImage) {
        fetchDealerInfo();
        return;
      }

      if (isDataUrl(nextImage)) {
        // data URL সরাসরি set করো, candidate logic দরকার নেই
        setProfileImageUrl(nextImage);
        candidatesRef.current = [];
        return;
      }

      if (detail?.image) {
        window.localStorage.setItem(DEALER_PROFILE_IMAGE_KEY, detail.image);
      }
      loadCandidates(buildImageCandidates(nextImage));
    };

    window.addEventListener("dealer-profile-updated", handleDealerProfileUpdated);
    return () => window.removeEventListener("dealer-profile-updated", handleDealerProfileUpdated);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, authUser?.name]);

  const pageTitle = pageTitles[pathname] ?? "Dashboard";
  const finalTitle = title ?? pageTitle;

  // ── Avatar ────────────────────────────────────────────────────────────────
  const renderAvatar = () => {
    if (profileImageUrl && !imgError) {
      // data URL → plain <img> (Next.js Image doesn't support data URLs)
      if (isDataUrl(profileImageUrl)) {
        return (
          <img
            src={profileImageUrl}
            alt={dealerName}
            width={50}
            height={50}
            className="w-12.5 h-12.5 object-cover rounded-full"
          />
        );
      }

      return (
        <Image
          src={profileImageUrl}
          alt={dealerName}
          width={50}
          height={50}
          className="w-12.5 h-12.5 object-cover rounded-full"
          priority
          unoptimized
          onError={handleImgError}
        />
      );
    }

    // Fallback: initials
    return (
      <div className="w-12.5 h-12.5 rounded-full bg-[#D93E39] flex items-center justify-center text-white text-sm font-semibold">
        {getInitials(dealerName)}
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <header className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-800 ml-10 lg:ml-0">
        {finalTitle}
      </h2>

      <div className="flex items-center gap-3 py-2.25">
        <div className="flex items-center gap-4 px-6">
          {/* Bell Icon */}
          <div className="shrink-0 w-12 h-12 flex items-center justify-center">
            <Image src="/icons/bell.png" width={50} height={50} alt="notification bell" />
          </div>

          {/* Name & Role */}
          <div className="flex flex-col">
            <h2 className="text-[16px] font-bold text-black">{dealerName}</h2>
            <p className="text-[#6D717F] text-[16px] font-medium -mt-1">Dealer</p>
          </div>

          {/* Profile Picture */}
          <div className="shrink-0 ml-auto">
            {renderAvatar()}
          </div>
        </div>
      </div>
    </header>
  );
}