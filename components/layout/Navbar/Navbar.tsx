"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Desktop dropdown
  const pathname = usePathname();

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
                className={`flex items-center gap-1 text-[16px] font-medium transition-colors ${
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
          <div className="hidden md:block">
            <Button
              asChild
              size="lg"
              className="bg-[#D93E39] px-6 py-5 text-base font-medium rounded-full shadow-md transition-all"
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