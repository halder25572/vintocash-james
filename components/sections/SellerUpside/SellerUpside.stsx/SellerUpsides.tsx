"use client"

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── types ─── */
interface CardProps {
  title: string;
  paragraphs: string[];
  imgSrc: string;
  imgAlt: string;
  imgHeight?: string;
  bg: string;
  reverse?: boolean;
}

/* ─── reusable animated card ─── */
const Card = ({
  title,
  paragraphs,
  imgSrc,
  imgAlt,
  imgHeight = "h-auto",
  bg,
  reverse = false,
}: CardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imgRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      /* whole card fades + lifts in */
      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 48, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" }
      );

      /* text block slides from the correct side */
      tl.fromTo(
        textRef.current,
        { opacity: 0, x: reverse ? 50 : -50 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
        "-=0.45"
      );

      /* image wipes in via clip-path */
      tl.fromTo(
        imgRef.current,
        {
          opacity: 0,
          clipPath: reverse
            ? "inset(0 0 0 100%)"
            : "inset(0 100% 0 0)",
        },
        {
          opacity: 1,
          clipPath: "inset(0 0% 0 0%)",
          duration: 0.75,
          ease: "power3.out",
        },
        "-=0.5"
      );
    }, cardRef);

    return () => ctx.revert();
  }, [reverse]);

  const imgBlock = (
    <div ref={imgRef} className="overflow-hidden">
      <Image
        className={`w-full object-cover ${imgHeight} ${
          reverse ? "rounded-l-[28px]" : "rounded-r-[28px]"
        }`}
        src={imgSrc}
        alt={imgAlt}
        width={651}
        height={390}
      />
    </div>
  );

  const textBlock = (
    <div ref={textRef} className="p-12">
      <h2 className="text-[30px] font-semibold mb-4">{title}</h2>
      {paragraphs.map((p: string, i: number) => (
        <p key={i} className={`${i < paragraphs.length - 1 ? "mb-2" : ""} text-[#6D717F]`}>
          {p}
        </p>
      ))}
    </div>
  );

  return (
    < div
      ref={cardRef}
      className={`grid grid-cols-1 lg:grid-cols-2 items-center rounded-[28px] ${bg} ${
        reverse ? "rounded-l-[28px]" : "rounded-r-[28px]"
      }`}
    >
      {reverse ? (
        <>
          {imgBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {imgBlock}
        </>
      )}
    </div>
  );
};

/* ─── card data ─── */
const cards: CardProps[] = [
  {
    title: "What is Seller Upside?",
    paragraphs: [
      "Seller Upside is our way of sharing success with sellers who are willing to give us time to maximize the value of their asset.",
      "Here's how it works: Instead of receiving a single cash payment, you receive a guaranteed minimum payment upfront. Then, if we're able to sell your asset for more than our target price, you receive a percentage of that additional profit.",
      "It's designed for sellers who want to maximize their return but still need some cash now. You get the security of a guaranteed payment plus the opportunity to earn more.",
    ],
    imgSrc: "/images/Upside.png",
    imgAlt: "What is Seller Upside",
    bg: "bg-[#F3F3E0]",
    reverse: true,
  },
  {
    title: "When It Makes Sense?",
    paragraphs: [
      "Seller Upside is ideal for assets that have strong market value or unique features.",
      "If your vehicle or asset has the potential to sell above the typical market price, participating in Seller Upside can help you capture additional profit. Our specialists will guide you on whether your asset qualifies and if it's a good fit for this program.",
    ],
    imgSrc: "/images/Sense.jpg",
    imgAlt: "When It Makes Sense",
    bg: "bg-[#CBDCEB]",
    reverse: false,
  },
  {
    title: "It's Completely Optional",
    paragraphs: [
      "Participation in Seller Upside is entirely optional.",
      "You are never required to take part, and you can always choose the immediate cash offer instead. This ensures you remain in full control of your sale and can select the option that best suits your needs.",
    ],
    imgSrc: "/images/Optional.jpg",
    imgAlt: "It's Completely Optional",
    imgHeight: "h-97.5",
    bg: "bg-[#DFF2EB]",
    reverse: true,
  },
  {
    title: "Cash Option Always Available",
    paragraphs: [
      "Even if you choose Seller Upside, a guaranteed cash offer is always available.",
      "This flexibility allows you to participate in the program without risking access to immediate payment. You can decide the best approach for your situation at any time.",
    ],
    imgSrc: "/images/Available.jpg",
    imgAlt: "Cash Option Always Available",
    bg: "bg-[#EDDFE0]",
    reverse: false,
  },
  {
    title: "Clear Sale Summary",
    paragraphs: [
      "Every Seller Upside transaction comes with a detailed sale summary.",
      "This summary shows exactly how your final payout is calculated, providing transparency and confidence. You'll see the breakdown of sale price, deductions, and net payout clearly documented.",
    ],
    imgSrc: "/images/Summary.jpg",
    imgAlt: "Clear Sale Summary",
    imgHeight: "h-95",
    bg: "bg-[#FAF7F0]",
    reverse: true,
  },
  {
    title: "Final Sale Price",
    paragraphs: [
      "Your final sale price reflects the true value your asset achieved in the market.",
      "It's included in your sale summary so you can see exactly how much your vehicle or asset sold for, giving you a clear picture of your potential earnings.",
    ],
    imgSrc: "/images/Price.jpg",
    imgAlt: "Final Sale Price",
    bg: "bg-[#CBDCEB]",
    reverse: false,
  },
  {
    title: "Deductions (Predefined)",
    paragraphs: [
      "All applicable deductions are predefined and clearly listed.",
      "These may include fees, logistics, or adjustments. Everything is transparent — there are no hidden costs, and you'll know exactly how the net payout is determined.",
    ],
    imgSrc: "/images/Predefined.jpg",
    imgAlt: "Deductions Predefined",
    imgHeight: "h-95",
    bg: "bg-[#DFF2EB]",
    reverse: true,
  },
  {
    title: "Net Payout",
    paragraphs: [
      "Your net payout is the final amount you receive after all deductions.",
      "It represents the cash that goes directly into your hands. By clearly showing this, we ensure sellers feel confident, informed, and secure throughout the process.",
    ],
    imgSrc: "/images/Payout.jpg",
    imgAlt: "Net Payout",
    bg: "bg-[#CBDCEB]",
    reverse: false,
  },
];

/* ─── main component ─── */
const SellerUpsides = () => {
  const heroImgRef   = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubRef   = useRef<HTMLParagraphElement>(null);
  const btnRef       = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* hero image: scale + fade */
      gsap.fromTo(
        heroImgRef.current,
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1, duration: 1.1, ease: "power3.out" }
      );

      /* title: slide up */
      gsap.fromTo(
        heroTitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.3 }
      );

      /* subtitle: slide up, offset */
      gsap.fromTo(
        heroSubRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.5 }
      );

      /* CTA button: scroll-triggered bounce in */
      gsap.fromTo(
        btnRef.current,
        { opacity: 0, scale: 0.85, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.55,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: btnRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-gray-100 py-10 mt-10">
      <div className="max-w-7xl mx-auto">

        {/* ── hero banner ── */}
        <div ref={heroImgRef} className="relative w-full h-78 mb-15">
          <Image
            src="/images/SellerUpside.jpg"
            alt="this is car"
            fill
            className="object-cover rounded-[24px] px-4 lg:px-0"
          />
        </div>

        {/* ── headline block ── */}
        <div className="px-4 lg:px-0">
          <article className="text-center">
            <h1
              ref={heroTitleRef}
              className="text-3xl lg:text-[60px] font-bold"
            >
              Seller Upside
            </h1>
            <p ref={heroSubRef} className="text-[20px] text-[#6D717F]">
              An optional program that lets qualifying sellers receive guaranteed cash now, with{" "}
              <br />
              the potential for additional payment if your asset sells for more than expected.
            </p>
          </article>
        </div>

        {/* ── animated cards ── */}
        <div className="mt-15 space-y-14">
          {cards.map((card, i) => (
            <Card key={i} {...card} />
          ))}
        </div>

        {/* ── CTA button ── */}
        {/* <div ref={btnRef} className="flex justify-center mt-12">
          <Button className="bg-[#D93E39] cursor-pointer">
            See If My Vehicle Qualifies
          </Button>
        </div> */}

      </div>
    </section>
  );
};

export default SellerUpsides;