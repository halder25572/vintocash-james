'use client';

import {
  Car,
  Truck,
  Bike,
  Mountain,
  Caravan,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const items = [
  { icon: Car, title: "Cars" },
  { icon: Truck, title: "Trucks & SUVs" },
  { icon: Bike, title: "Motorcycles" },
  { icon: Mountain, title: "ATVs & Power Sports" },
  { icon: Caravan, title: "Campers & RVs" },
  { icon: Package, title: "Commercial Assets" },
];

export default function WhatWeBuy() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([titleRef.current, subtitleRef.current], {
        opacity: 0,
        y: 30
      });

      gsap.set(buttonRef.current, {
        opacity: 0,
        y: 20
      });

      const cards = gridRef.current?.querySelectorAll('.category-card');
      if (cards) {
        gsap.set(cards, {
          opacity: 0,
          y: 40,
          scale: 0.8
        });
      }

      // Create timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 75%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      });

      // Animate title and subtitle
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      })
        .to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out'
        }, '-=0.5');

      // Animate cards with stagger
      if (cards) {
        tl.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'back.out(1.4)'
        }, '-=0.3');
      }

      // Animate button
      tl.to(buttonRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.4');

      // Icon hover-like animation on each card
      if (cards) {
        cards.forEach((card, index) => {
          const icon = card.querySelector('.icon-wrapper');
          if (icon) {
            gsap.to(icon, {
              y: -5,
              duration: 2 + (index * 0.15),
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
              delay: 2 + (index * 0.2)
            });
          }
        });
      }

    });

    return () => ctx.revert();
  }, []);

  return (
    <section className=" py-12 md:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">

        {/* Title */}
        <h2
          ref={titleRef}
          className="text-3xl md:text-2xl font-semibold"
        >
          WHAT WE BUY
        </h2>

        <p
          ref={subtitleRef}
          className="mt-2 text-gray-500 text-[20px] md:text-base"
        >
          From everyday vehicles to specialized commercial assets
        </p>

        {/* Grid */}
        <div
          ref={gridRef}
          className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
        >
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="category-card bg-white rounded-xl py-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition"
              >
                <div className="icon-wrapper">
                  <Icon
                    className="text-[#D93E39] mb-3"
                    size={40}
                  />
                </div>
                <p className="text-sm text-[#6D717F]">
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>

        {/* Button */}
        <div
          ref={buttonRef}
          className="mt-8"
        >
          <Link href="/whatWeBuy">
            <Button
              variant="outline"
              className="rounded-full cursor-pointer mt-9 py-2.5 px-6 border-[#D93E39] text-red-500"
            >
              See Full List
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
