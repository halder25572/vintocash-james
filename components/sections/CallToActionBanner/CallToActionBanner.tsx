"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

interface CTABannerProps {
  backgroundImage?: string;
  heading?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function CallToActionBanner({
  backgroundImage = "/images/Frame42.png",
  heading = "Ready to See Your Options?",
  buttonText = "Get My Offer",
  onButtonClick
}: CTABannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(backgroundRef.current, {
        scale: 1.2,
        opacity: 0
      });

      gsap.set(headingRef.current, {
        opacity: 0,
        y: 30,
        scale: 0.9
      });

      gsap.set(buttonRef.current, {
        opacity: 0,
        y: 20,
        scale: 0.8
      });

      // Create timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      });

      // Animate background
      tl.to(backgroundRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out'
      });

      // Animate heading
      tl.to(headingRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.4)'
      }, '-=0.8');

      // Animate button
      tl.to(buttonRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.7)'
      }, '-=0.5');

      // Continuous pulse animation on button
      gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.5
      });

      // Parallax effect on background
      gsap.to(backgroundRef.current, {
        y: 30,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });

      // Button hover glow effect
      if (buttonRef.current) {
        buttonRef.current.addEventListener('mouseenter', () => {
          gsap.to(buttonRef.current, {
            scale: 1.1,
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        buttonRef.current.addEventListener('mouseleave', () => {
          gsap.to(buttonRef.current, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      }

    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="w-full -mt-10 mb-20 px-4 md:py-10" ref={containerRef}>
      <div className="mx-auto max-w-7xl">
        <div 
          ref={backgroundRef}
          className="relative overflow-hidden rounded-2xl md:rounded-3xl"
          style={{
            backgroundImage: `
              url('${backgroundImage}')
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-4 px-6 py-12 md:gap-6 md:py-16 lg:py-20">
            <h2 
              ref={headingRef}
              className="text-center text-xl font-semibold text-white md:text-2xl lg:text-3xl"
            >
              {heading}
            </h2>
            <Link href="/getAOffer">
              <Button
              ref={buttonRef}
              onClick={onButtonClick}
              size="lg"
              className="rounded-full cursor-pointer bg-linear-to-r from-red-500 to-red-600 px-8 py-3 text-base font-medium text-white shadow-lg transition-all hover:from-red-600 hover:to-red-700 hover:scale-105 hover:shadow-xl md:px-10 md:text-lg"
            >
              {buttonText}
            </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}