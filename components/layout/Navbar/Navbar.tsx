"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown } from "lucide-react";
import Image from "next/image";
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

const FALLBACK_PROFILE_IMAGE = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face";

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

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Desktop dropdown
  const [hydrated, setHydrated] = useState(false);
  const [dealerName, setDealerName] = useState("Dealer");
  const [dealerImageCandidates, setDealerImageCandidates] = useState<string[]>([]);
  const [dealerImageIndex, setDealerImageIndex] = useState(0);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const pathname = usePathname();

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
    if (user?.name) {
      setDealerName(user.name);
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

        setDealerName(result.data.name || result.data.contact_name || user?.name || "Dealer");
        setDealerImageCandidates(buildImageCandidates(result.data.profile_image));
        setDealerImageIndex(0);
      } catch {
        // Keep fallback data from auth store.
      }
    };

    fetchDealerInfo();
  }, [hydrated, token, user?.name]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "How It Works", href: "/howItWorks" },
    { name: "Seller Upside", href: "/SellerUpsides" },
    { name: "What We Buy", href: "/whatWeBuy" },
  ];

  // Dealers with dropdown
  const dealersDropdown = {
    name: "Dealers",
    items: [
      { 
        name: "Login", 
        href: "/login",
        external: true 
      },
      { name: "Registration", href: "/dealers" },
    ],
  };

  const isActive = (href: string) => {
    return pathname === href || (href !== "/" && pathname.startsWith(href));
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8 h-25">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative">
            <Image src="/images/logo1.jpg" alt="VintoCash Logo" width={137} height={0} />
          </div>
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

            {/* ✅ Dealers Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
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

              {/* Dropdown Menu */}
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
                      onClick={() => setDropdownOpen(false)}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            {token && (
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={dealerImage}
                    alt={dealerName}
                    fill
                    className="object-cover"
                    onError={() => setDealerImageIndex((prev) => prev + 1)}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-800 max-w-32 truncate">
                  {dealerName}
                </span>
              </Link>
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
                <Link
                  href="/"
                  className="flex items-center gap-2.5"
                  onClick={() => setOpen(false)}
                >
                  <div className="relative">
                    <Image src="/images/logo.png" alt="VintoCash Logo" width={137} height={0} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    <span className="text-[#D93E39]">Vinto</span>Cash
                  </span>
                </Link>

                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  {/* Close button if needed */}
                </Button>
              </div>

              {/* Mobile Links */}
              <nav className="flex flex-col gap-6 text-lg">
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

                {/* Mobile Dealers (সাধারণ লিংক হিসেবে রাখা হয়েছে) */}
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

                {/* Mobile CTA */}
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