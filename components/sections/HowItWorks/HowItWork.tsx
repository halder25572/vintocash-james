"use client"

import { useEffect, useRef } from "react";
import { CircleCheckBig } from "lucide-react";
import Image from "next/image";
import CallToActionBanner from "../CallToActionBanner/CallToActionBanner";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── types ─── */
interface StepProps {
  icon: string;
  title: string;
  description: string;
  checks: string[];
  imgSrc: string;
  imgAlt: string;
  reverse?: boolean;
}

/* ─── reusable animated section ─── */
const Step = ({
  icon,
  title,
  description,
  checks,
  imgSrc,
  imgAlt,
  reverse = false,
}: StepProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const imgRef     = useRef<HTMLDivElement>(null);
  // typed as an array of HTMLDivElement (never null after mount)
  const checksRef  = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      /* heading + paragraph slide in */
      tl.fromTo(
        textRef.current,
        { opacity: 0, x: reverse ? 60 : -60 },
        { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" }
      );

      /* image reveal with clip-path */
      tl.fromTo(
        imgRef.current,
        {
          opacity: 0,
          clipPath: reverse ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
        },
        {
          opacity: 1,
          clipPath: "inset(0 0% 0 0%)",
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.4"
      );

      /* checklist items stagger */
      tl.fromTo(
        checksRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.12, ease: "power2.out" },
        "-=0.5"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reverse]);

  const textBlock = (
    <div ref={textRef}>
      <div className="flex items-center gap-4">
        <div className="bg-black p-3 rounded-full">
          <Image src={icon} width={28} height={28} alt="" />
        </div>
        <h2 className="text-2xl lg:text-[30px] font-semibold text-[#131927]">
          {title}
        </h2>
      </div>
      <p className="mt-3.5 text-[#6D717F]">{description}</p>
      <div className="mt-6 space-y-3">
        {checks.map((item: string, i: number) => (
          <div
            key={i}
            ref={(el: HTMLDivElement | null) => {
              if (el) checksRef.current[i] = el;
            }}
            className="flex gap-3 items-center"
          >
            <CircleCheckBig className="text-[#D93E39] shrink-0" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const imgBlock = (
    <div ref={imgRef} className="overflow-hidden rounded-[24px]">
      <Image
        className="rounded-[24px] w-full h-auto"
        src={imgSrc}
        alt={imgAlt}
        width={650}
        height={445}
      />
    </div>
  );

  return (
    <div ref={sectionRef} className="mt-15 px-4 lg:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-18 items-center">
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
    </div>
  );
};

/* ─── step data ─── */
const steps: StepProps[] = [
  {
    icon: "/images/Icon1.svg",
    title: "Submission & Review",
    description:
      "Fill out our simple online form with details about your vehicle or asset. Include photos if available—they help us provide a more accurate assessment.",
    checks: [
      "Takes just 5-10 minutes",
      "Photos optional but recommended",
      "VIN helps with accuracy",
      "All information kept confidential",
    ],
    imgSrc: "/images/submission.jpg",
    imgAlt: "Submission and Review",
    reverse: false,
  },
  {
    icon: "/images/icon2.svg",
    title: "Conditional Offers for Remote Vehicles",
    description:
      "Receive a preliminary offer even if your vehicle is not nearby. Our team reviews the details you submit and gives you a conditional price instantly.",
    checks: [
      "Quick response within 24 hours",
      "No obligation to accept",
      "Remote submissions fully supported",
      "Transparent pricing",
    ],
    imgSrc: "/images/Conditional.jpg",
    imgAlt: "Conditional Offers",
    reverse: true,
  },
  {
    icon: "/images/Icon1.svg",
    title: "Pickup Verification",
    description:
      "Once you accept the offer, we schedule a pickup and verify the vehicle or asset in person to ensure everything matches your submission.",
    checks: [
      "Convenient scheduling at your location",
      "Verification ensures accurate payment",
      "Professional staff handles inspection",
      "Minimal disruption to your day",
    ],
    imgSrc: "/images/pickup.png",
    imgAlt: "Pickup Verification",
    reverse: false,
  },
  {
    icon: "/images/Icon3.svg",
    title: "Payment Timing (at Pickup Verification)",
    description:
      "Receive your payment immediately after verification. We make sure the transaction is secure and transparent, so you get your funds without delay.",
    checks: [
      "Instant payment after verification",
      "Secure transaction guaranteed",
      "No hidden fees",
      "Clear confirmation receipt",
    ],
    imgSrc: "/images/Payment.jpg",
    imgAlt: "Payment",
    reverse: true,
  },
  {
    icon: "/images/Icon4.svg",
    title: "Transport Handled Professionally",
    description:
      "After verification and payment, our logistics team ensures your vehicle or asset is transported safely to its next destination, handled by trained professionals.",
    checks: [
      "Safe and reliable transport",
      "Experienced drivers and handlers",
      "Real-time updates available",
      "Fully insured for peace of mind",
    ],
    imgSrc: "/images/Transport.png",
    imgAlt: "Transport",
    reverse: false,
  },
];

/* ─── main component ─── */
const HowItWork = () => {
  const heroImgRef   = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubRef   = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroImgRef.current,
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1, duration: 1.1, ease: "power3.out" }
      );
      gsap.fromTo(
        heroTitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.3 }
      );
      gsap.fromTo(
        heroSubRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.5 }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto">

        {/* ── hero banner ── */}
        <div ref={heroImgRef} className="relative w-full h-78 mb-15">
          <Image
            src="/images/howITWorkB.jpg"
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
              How It Works
            </h1>
            <p ref={heroSubRef} className="text-[20px] text-[#6D717F]">
              A clear, professional process designed to make selling your vehicle or asset as smooth as{" "}
              <br />
              possible.
            </p>
          </article>
        </div>

        {/* ── animated steps ── */}
        {steps.map((step, i) => (
          <Step key={i} {...step} />
        ))}
      </div>

      <div className="mt-27.5">
        <CallToActionBanner />
      </div>
    </section>
  );
};

export default HowItWork;