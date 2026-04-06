"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown, LogOut } from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";

type DealerInfoResponse = {
  success: boolean;
  data?: {
    profile_image?: string | null;
  };
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://backend.vintocash.com/api";
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");
const STORAGE_ORIGIN = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend.vintocash.com/api"
).replace(/\/api\/?$/, "");

const DEALER_PROFILE_IMAGE_KEY = "dealer-profile-image-path";

// ─── helpers ────────────────────────────────────────────────────────────────

const isDataUrl = (value: string | null | undefined) =>
  Boolean(value && value.startsWith("data:"));

// FIX: cache buster সরানো হয়েছে — এটাই Next.js Image কে break করছিল
const buildImageCandidates = (imagePath: string | null | undefined): string[] => {
  if (!imagePath) return [];

  // Full URL হলে সরাসরি use করো
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return [imagePath];
  }

  // Relative path হলে দুটো origin থেকে try করো
  const normalized = imagePath.replace(/^\/+/, "");
  return [...new Set([
    `${API_ORIGIN}/${normalized}`,
    `${STORAGE_ORIGIN}/${normalized}`,
  ])];
};

const fetchDealerInfoSnapshot = async (authToken: string): Promise<string | null> => {
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

  return result.data.profile_image || null;
};

// ─── component ──────────────────────────────────────────────────────────────

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

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

  useEffect(() => {
    // localStorage থেকে আগের image দেখাও
    const persisted = window.localStorage.getItem(DEALER_PROFILE_IMAGE_KEY);
    if (persisted) {
      loadCandidates(buildImageCandidates(persisted));
    }

    if (!token) return;

    const fetchUserImage = async () => {
      try {
        const apiImagePath = await fetchDealerInfoSnapshot(token);

        if (apiImagePath) {
          window.localStorage.setItem(DEALER_PROFILE_IMAGE_KEY, apiImagePath);
          loadCandidates(buildImageCandidates(apiImagePath));
        }
      } catch (error) {
        console.error("[Navbar] dealer image fetch failed:", error);
      }
    };

    fetchUserImage();

    const handleDealerProfileUpdated = (event: Event) => {
      const { detail } = event as CustomEvent<{ image?: string; previewImage?: string }>;
      const nextPath = detail?.previewImage || detail?.image;

      if (!nextPath) {
        fetchUserImage();
        return;
      }

      if (isDataUrl(nextPath)) {
        setProfileImageUrl(nextPath);
        candidatesRef.current = [];
        return;
      }

      if (detail?.image) {
        window.localStorage.setItem(DEALER_PROFILE_IMAGE_KEY, detail.image);
      }
      loadCandidates(buildImageCandidates(nextPath));
    };

    window.addEventListener("dealer-profile-updated", handleDealerProfileUpdated);
    return () => window.removeEventListener("dealer-profile-updated", handleDealerProfileUpdated);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");

  const handleLogout = async () => {
    await logout();
    window.localStorage.removeItem(DEALER_PROFILE_IMAGE_KEY);
    setProfileImageUrl(null);
    router.push("/login");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "How It Works", href: "/howItWorks" },
    { name: "Seller Upside", href: "/SellerUpsides" },
    { name: "What We Buy", href: "/whatWeBuy" },
  ];

  const dealersDropdown = {
    name: "Dealers",
    items: [
      { name: "Login", href: "/login", external: true },
      { name: "Registration", href: "/dealers" },
    ],
  };

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  // ── Shared Avatar component ──────────────────────────────────────────────
  const Avatar = ({ size = 36 }: { size?: number }) => {
    const initials = getInitials(user?.name || "User");
    return (
      <div
        style={{ width: size, height: size, minWidth: size }}
        className="relative flex items-center justify-center rounded-full bg-[#D93E39] text-white font-semibold overflow-hidden"
      >
        {profileImageUrl && !imgError ? (
          <Image
            src={profileImageUrl}
            alt={user?.name || "User"}
            width={size}
            height={size}
            className="object-cover w-full h-full rounded-full"
            onError={handleImgError}
            unoptimized
          />
        ) : (
          <span style={{ fontSize: size * 0.38 }}>{initials}</span>
        )}
      </div>
    );
  };

  // ────────────────────────────────────────────────────────────────────────

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8 h-25">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/images/logo1.jpg" alt="VintoCash Logo" width={137} height={0} />
        </Link>

        <div className="flex items-center gap-6">
          {/* Desktop Navigation */}
          <nav className="hidden gap-12 md:flex items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[16px] font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-[#D93E39] font-semibold"
                    : "text-[#6D717F] hover:text-gray-900"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Dealers Dropdown */}
            <div className="relative group">
              <button
                className={`flex items-center cursor-pointer gap-1 text-[16px] font-medium transition-colors ${
                  isActive("/dealers")
                    ? "text-[#D93E39] font-semibold"
                    : "text-[#6D717F] hover:text-gray-900"
                }`}
              >
                {dealersDropdown.name}
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>

              <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {dealersDropdown.items.map((item) => {
                  const isExternal = item.external || item.href.startsWith("http");
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className={`block px-4 py-2.5 text-[15px] hover:bg-gray-50 transition-colors ${
                        isActive(item.href) && !isExternal
                          ? "text-[#D93E39] font-semibold"
                          : "text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {token && user && (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 hover:bg-gray-50 transition-colors"
                >
                  <Avatar size={36} />
                  <div className="max-w-32">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer rounded-full text-gray-600 hover:text-[#D93E39]"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Logout</span>
                </Button>
              </>
            )}

            <Button
              asChild
              size="lg"
              className="bg-[#D93E39] cursor-pointer px-6 py-5 text-base font-medium rounded-full shadow-md transition-all"
            >
              <Link href="/getAOffer">Get A Offer</Link>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[85%] sm:w-95 pr-0">
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
                  <Image src="/images/logo.png" alt="VintoCash Logo" width={137} height={0} />
                  <span className="text-2xl font-bold text-gray-900">
                    <span className="text-[#D93E39]">Vinto</span>Cash
                  </span>
                </Link>
              </div>

              <nav className="flex flex-col gap-6 text-lg">
                {token && user && (
                  <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                    <Avatar size={40} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                )}

                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`font-medium transition-colors ${
                      isActive(link.href)
                        ? "text-[#D93E39] font-semibold"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

                <Link
                  href="/dealers"
                  className={`font-medium transition-colors ${
                    isActive("/dealers")
                      ? "text-[#D93E39] font-semibold"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  Dealers
                </Link>

                {token && (
                  <>
                    <Link
                      href="/dashboard"
                      className={`font-medium transition-colors ${
                        isActive("/dashboard")
                          ? "text-[#D93E39] font-semibold"
                          : "text-gray-700 hover:text-gray-900"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      Dashboard
                    </Link>

                    <button
                      onClick={async () => {
                        await handleLogout();
                        setOpen(false);
                      }}
                      className="text-left font-medium text-gray-700 hover:text-[#D93E39] transition-colors"
                    >
                      Logout
                    </button>
                  </>
                )}

                <div className="mt-6">
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-[#D93E39] text-base font-medium rounded-full shadow-md"
                  >
                    <Link href="/getAOffer" onClick={() => setOpen(false)}>
                      Get A Offer
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

