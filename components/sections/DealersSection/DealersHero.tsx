"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const DealersHero = () => {
  const badgeRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      badgeRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6 }
    )
      .fromTo(
        headingRef.current,
        { opacity: 0, y: 40, skewY: 3 },
        { opacity: 1, y: 0, skewY: 0, duration: 0.8 },
        "-=0.3"
      )
      .fromTo(
        paraRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.4"
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      );
  }, []);

  return (
    <section className="w-full px-3 py-3 sm:px-4 sm:py-4">
      <div className="relative w-full h-40 sm:h-55 md:h-75 lg:h-102.5 rounded-xl overflow-hidden">

        {/* Background Image */}
        <Image
          src="/images/dealsi.jpg"
          alt="Dealer Buyer Network"
          fill
          priority
          className="object-cover scale-105"
          style={{ objectPosition: "60% center" }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black/95 via-black/70 to-black/10" />

        {/* Text Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-10 lg:p-14">

          {/* Top */}
          <div className="flex flex-col gap-1 sm:gap-2 lg:gap-4">

            <button
              ref={badgeRef}
              className="text-white text-[9px] sm:text-[11px] lg:text-[13px] py-1 px-3 sm:px-4 cursor-pointer w-fit bg-[#D93E39] rounded-full font-semibold uppercase tracking-widest opacity-0"
            >
              Automotive Authority
            </button>

            <h2
              ref={headingRef}
              className="text-[#FDECEC] font-bold leading-none opacity-0
                text-[1.6rem] sm:text-[2.2rem] md:text-[3rem] lg:text-[3.75rem]"
            >
              Dealer Buyer <br /> Network
            </h2>

            <p
              ref={paraRef}
              className="text-[rgba(253,236,236,0.85)] leading-snug opacity-0
                text-[0.65rem] sm:text-[0.8rem] md:text-[0.95rem] lg:text-[1.1rem]
                hidden sm:block max-w-[28ch] md:max-w-[34ch] lg:max-w-none"
            >
              VinToCash sources vehicles directly from private sellers. <br className="hidden lg:block" />
              Qualified dealers may receive select off-market <br className="hidden lg:block" />
              opportunities before vehicles go to auction.
            </p>
          </div>

          {/* Bottom */}
          <div
            ref={ctaRef}
            className="flex items-center pt-5 gap-2 sm:gap-3 lg:gap-4 opacity-0"
          >
            <button
              className="bg-[#D93E39] text-white cursor-pointer font-bold rounded-full transition-all duration-300 hover:bg-[#b52e2a] hover:scale-105 active:scale-95
                text-[0.65rem] sm:text-[0.85rem] lg:text-[1.1rem]
                py-1.5 px-4 sm:py-2 sm:px-5 lg:py-3 lg:px-7"
            >
              Apply for Access
            </button>
            <span
              className="text-[#D93E39] font-bold
                text-[0.6rem] sm:text-[0.85rem] lg:text-[1.1rem]"
            >
              Licensed dealers only
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DealersHero;