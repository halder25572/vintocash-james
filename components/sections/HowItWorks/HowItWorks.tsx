// import { ClipboardList, Search, DollarSign } from "lucide-react";

// const steps = [
//   {
//     icon: ClipboardList,
//     title: "Submit Your Info",
//     desc: "Tell us about your vehicle or asset. Photos help but aren't required to start.",
//   },
//   {
//     icon: Search,
//     title: "Review & Options",
//     desc: "A real specialist reviews every submission and explains your options clearly.",
//   },
//   {
//     icon: DollarSign,
//     title: "Get Paid",
//     desc: "Choose a cash option or, when applicable, Seller Upside. Payment is fast and professional.",
//   },
// ];

// export default function HowItWorks() {
//   return (
//     <section className="bg-[#E5E7EA] py-12 md:py-16 lg:py-20">
//       <div className="max-w-6xl mx-auto px-4 text-center">
        
//         {/* Title */}
//         <h2 className="text-2xl md:text-3xl font-semibold">
//           HOW IT WORKS
//         </h2>

//         <p className="mt-2 text-gray-500 text-sm md:text-base">
//           A simple, transparent process from start to finish
//         </p>

//         {/* Steps */}
//         <div className="relative mt-10 grid gap-10 md:grid-cols-3">

//           {/* dotted line desktop */}
//           <div className="hidden md:block absolute top-10 left-0 right-0 border-t border-dashed border-gray-300"></div>

//           {steps.map((step, index) => {
//             const Icon = step.icon;
//             return (
//               <div
//                 key={index}
//                 className="relative flex flex-col items-center text-center px-4"
//               >
//                 {/* Icon Circle */}
//                 <div className="z-10 w-14 h-14 rounded-full bg-black text-white flex items-center justify-center">
//                   <Icon size={24} />
//                 </div>

//                 {/* Title */}
//                 <h3 className="mt-4 text-lg font-semibold">
//                   {step.title}
//                 </h3>

//                 {/* Description */}
//                 <p className="mt-2 text-gray-500 text-sm max-w-xs">
//                   {step.desc}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }

'use client';

import { ClipboardList, Search, DollarSign } from "lucide-react";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: ClipboardList,
    title: "Submit Your Info",
    desc: "Tell us about your vehicle or asset. Photos help but aren't required to start.",
  },
  {
    icon: Search,
    title: "Review & Options",
    desc: "A real specialist reviews every submission and explains your options clearly.",
  },
  {
    icon: DollarSign,
    title: "Get Paid",
    desc: "Choose a cash option or, when applicable, Seller Upside. Payment is fast and professional.",
  },
];

export default function HowItWorks() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([titleRef.current, subtitleRef.current], {
        opacity: 0,
        y: 30
      });

      gsap.set(lineRef.current, {
        scaleX: 0,
        transformOrigin: 'left center'
      });

      const stepCards = stepsRef.current?.querySelectorAll('.step-card');
      if (stepCards) {
        gsap.set(stepCards, {
          opacity: 0,
          y: 50,
          scale: 0.9
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

      // Animate dotted line
      tl.to(lineRef.current, {
        scaleX: 1,
        duration: 1.2,
        ease: 'power2.inOut'
      }, '-=0.3');

      // Animate step cards with stagger
      if (stepCards) {
        tl.to(stepCards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'back.out(1.3)'
        }, '-=0.8');
      }

      // Icon pulse animation on each step
      if (stepCards) {
        stepCards.forEach((card, index) => {
          const icon = card.querySelector('.icon-circle');
          if (icon) {
            gsap.to(icon, {
              scale: 1.1,
              duration: 1.5,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
              delay: 2 + (index * 0.3)
            });
          }
        });
      }

    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-[#E5E7EA] py-12 md:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        
        {/* Title */}
        <h2 
          ref={titleRef}
          className="text-2xl md:text-3xl font-semibold"
        >
          HOW IT WORKS
        </h2>

        <p 
          ref={subtitleRef}
          className="mt-2 text-gray-500 text-sm md:text-base"
        >
          A simple, transparent process from start to finish
        </p>

        {/* Steps */}
        <div 
          ref={stepsRef}
          className="relative mt-10 grid gap-10 md:grid-cols-3"
        >

          {/* dotted line desktop */}
          <div 
            ref={lineRef}
            className="hidden md:block absolute top-10 left-0 right-0 border-t border-dashed border-gray-300"
          ></div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="step-card relative flex flex-col items-center text-center px-4"
              >
                {/* Icon Circle */}
                <div className="icon-circle z-10 w-14 h-14 rounded-full bg-black text-white flex items-center justify-center">
                  <Icon size={24} />
                </div>

                {/* Title */}
                <h3 className="mt-4 text-lg font-semibold">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-gray-500 text-sm max-w-xs">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
