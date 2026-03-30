"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

const partners = [
  { name: "AUTOCORE", icon: "/images/Icon.svg" },
  { name: "RECON-X", icon: "/images/Icon (1).svg" },
  { name: "FLEETSTREAM", icon: "/images/Icon (2).svg" },
  { name: "TITLETRAC", icon: "/images/Icon (3).svg" },
];

const items = [...partners, ...partners, ...partners];

export default function PartnerMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const totalWidth = track.scrollWidth / 3;

    animRef.current = gsap.fromTo(
      track,
      { x: 0 },
      { x: -totalWidth, duration: 18, ease: "none", repeat: -1 }
    );

    const pause = () => animRef.current?.pause();
    const resume = () => animRef.current?.resume();
    track.addEventListener("mouseenter", pause);
    track.addEventListener("mouseleave", resume);

    return () => {
      animRef.current?.kill();
      track.removeEventListener("mouseenter", pause);
      track.removeEventListener("mouseleave", resume);
    };
  }, []);

  return (
    <section className="w-full bg-[#E8E9ED] py-5 sm:py-6 md:py-8 overflow-hidden">

      {/* Label */}
      <p className="text-center font-semibold uppercase text-[#6D717F] mb-4 sm:mb-5 md:mb-6
        text-[14px] sm:text-[18px] md:text-[22px] lg:text-[26px]">
        Trusted by Dealers &amp; Partners
      </p>

      {/* Marquee */}
      <div className="overflow-hidden pt-3 sm:pt-5 md:pt-6">
        <div ref={trackRef} className="flex items-center w-max">
          {items.map((p, i) => (
            <div
              key={i}
              className="flex items-center cursor-default select-none
                gap-2 px-5
                sm:gap-2.5 sm:px-8
                md:gap-3 md:px-10
                lg:px-12"
            >
              <Image
                src={p.icon}
                alt={p.name}
                width={28}
                height={28}
                className="object-contain w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
              />
              <span className="font-bold uppercase whitespace-nowrap text-black tracking-[0.15em]
                text-[11px] sm:text-[13px] md:text-[15px]">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}