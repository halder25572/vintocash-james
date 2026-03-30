'use client';

import {
  Handshake,
  MessageCircleMore,
  FileText,
  GitBranch,
} from "lucide-react";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Handshake,
    title: "Direct buyer",
  },
  {
    icon: MessageCircleMore,
    title: "Clear communication & documented outcomes",
  },
  {
    icon: FileText,
    title: "We handle paperwork and logistics",
  },
  {
    icon: GitBranch,
    title: "Multiple exit options, not just one number",
  },
];

export default function WhyVintoCash() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([titleRef.current, subtitleRef.current], {
        opacity: 0,
        y: 30
      });

      const cards = cardsRef.current?.querySelectorAll('.feature-card');
      if (cards) {
        gsap.set(cards, {
          opacity: 0,
          y: 50,
          rotateY: -15
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

      // Animate cards with 3D rotation effect
      if (cards) {
        tl.to(cards, {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'back.out(1.3)'
        }, '-=0.3');
      }

      // Icon bounce animation on each card
      if (cards) {
        cards.forEach((card, index) => {
          const icon = card.querySelector('.icon-wrapper');
          if (icon) {
            gsap.to(icon, {
              y: -8,
              duration: 1.8 + (index * 0.2),
              repeat: -1,
              yoyo: true,
              ease: 'power1.inOut',
              delay: 2 + (index * 0.25)
            });
          }
        });
      }

      // Card hover effect
      if (cards) {
        cards.forEach((card) => {
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              y: -10,
              scale: 1.03,
              duration: 0.3,
              ease: 'power2.out'
            });
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              duration: 0.3,
              ease: 'power2.out'
            });
          });
        });
      }

    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-gray-100 py-12 md:py-16 lg:py-20 mb-30">
      <div className="max-w-6xl mx-auto px-4 text-center">

        {/* Title */}
        <h2 
          ref={titleRef}
          className="text-2xl md:text-3xl font-semibold"
        >
          Why VinToCash
        </h2>

        <p 
          ref={subtitleRef}
          className="mt-2 text-gray-500 text-sm md:text-base"
        >
          Professional service built on trust and transparency
        </p>

        {/* Cards */}
        <div 
          ref={cardsRef}
          className="mt-10 grid gap-14 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="feature-card bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition"
              >
                <div className="icon-wrapper">
                  <Icon
                    size={28}
                    className="text-red-500 mb-3"
                  />
                </div>

                <p className="text-sm font-medium text-gray-700 max-w-45">
                  {feature.title}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}