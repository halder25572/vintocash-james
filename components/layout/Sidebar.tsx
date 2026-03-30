/* eslint-disable react-hooks/static-components */

"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  SlidersHorizontal,
  Gavel,
  MessageSquare,
  Settings,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import clsx from "clsx";
import Image from "next/image";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Vehicles", href: "/vehicles", icon: Car },
  { label: "Preferences", href: "/preferences", icon: SlidersHorizontal },
  { label: "My Bids", href: "/my-bids", icon: Gavel },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#F9FAFB] border-r border-gray-300">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 border-b border-gray-300">
        <div className="flex items-center gap-2">
          <Image src="/images/logo.png" width={100} height={100} alt="logo" />
          <p className="mb-2.75 pt-7.75 text-2xl font-bold"><span className="text-[#D93E39]">Vinto</span> Cash</p>
        </div>
        {/* <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            width={40}
            height={40}
            alt="logo"
            priority
          />

          <p className="text-xl font-bold leading-none">
            <span className="text-[#D93E39]">Vinto</span> Cash
          </p>
        </Link> */}
        {/* Close button — mobile only */}
        <button
          className="lg:hidden text-gray-400 hover:text-gray-600"
          onClick={() => setMobileOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-300">
          <svg
            className="text-gray-400 shrink-0"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-gray-500 placeholder-gray-400 outline-none w-full"
          />
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-red-50 text-[#D93E39] border-l-[3px] border-[#D93E39]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              )}
            >
              <Icon
                size={18}
                className={clsx(isActive ? "text-[#D93E39]" : "text-gray-400")}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6 pt-2">
        <button className="flex cursor-pointer items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 w-full transition-all duration-150 group">
          <LogOut
            size={18}
            className="text-gray-400 group-hover:text-red-500 transition-colors"
          />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      {/* <aside className="hidden lg:flex flex-col w-52 min-h-screen shrink-0">
        <SidebarContent />
      </aside> */}
      <aside className="hidden lg:flex flex-col w-70 min-h-screen shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Hamburger Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-white border border-gray-200 rounded-xl p-2 shadow-sm"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={20} className="text-gray-600" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={clsx(
          "lg:hidden fixed top-0 left-0 z-50 w-64 h-full transition-transform duration-300 ease-in-out shadow-2xl",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}