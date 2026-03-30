'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

const HeroSection = () => {
    const headingRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Set initial states
            gsap.set([headingRef.current, descRef.current, buttonsRef.current], {
                opacity: 0,
                y: 30
            });

            gsap.set(imageRef.current, {
                opacity: 0,
                scale: 0.95,
                x: 50
            });

            gsap.set(badgeRef.current, {
                opacity: 0,
                y: 20
            });

            // Main timeline
            const tl = gsap.timeline({
                defaults: {
                    ease: 'power3.out',
                    duration: 1
                }
            });

            // Animate left content
            tl.to(headingRef.current, {
                opacity: 1,
                y: 0,
                duration: 1.2
            })
                .to(descRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 1
                }, '-=0.8')
                .to(buttonsRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 1
                }, '-=0.7')
                // Animate right image
                .to(imageRef.current, {
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    duration: 1.2
                }, '-=0.9')
                // Animate badge
                .to(badgeRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8
                }, '-=0.5');

            // Continuous floating animation for image
            // gsap.to(imageRef.current, {
            //     y: -10,
            //     duration: 2.5,
            //     repeat: -1,
            //     yoyo: true,
            //     ease: 'power1.inOut',
            //     delay: 1.5
            // });

        });

        return () => ctx.revert();
    }, []);

    return (
        <section className="py-10 md:py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">

                {/* LEFT CONTENT */}
                <div className="order-2 lg:order-1 text-center lg:text-left">
                    <h1
                        ref={headingRef}
                        className="text-[45px] sm:text-4xl lg:text-5xl font-bold leading-tight"
                    >
                        Turn Your Vehicle, <br /> Power Sports, or <br /> Commercial Assets <br /> To Cash
                    </h1>

                    <p
                        ref={descRef}
                        className="mt-4 text-[#6D717F] max-w-xl mx-auto lg:mx-0"
                    >
                        A professional, transparent way to sell with cash options and <br /> optional
                        upside for qualifying vehicles.
                    </p>

                    <div
                        ref={buttonsRef}
                        className="flex flex-wrap justify-center lg:justify-start gap-4 mt-6"
                    >
                        <Link href="/getAOffer">
                            <Button className="bg-red-500 cursor-pointer hover:bg-red-600 text-white rounded-full py-2.5 px-6">
                                Get A Offer
                            </Button>
                        </Link>

                        <Link href="/SellerUpsides">
                            <Button
                                variant="outline"
                                className="border-red-400 cursor-pointer text-red-500 rounded-full py-2.5 px-6"
                            >
                                How Seller Upside Works
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* RIGHT IMAGE */}
                <div className="order-1 lg:order-2 relative" ref={imageRef}>
                    <Image
                        src="/images/Hero.jpg"
                        alt="car"
                        width={639}
                        height={473}
                        priority
                        className="rounded-2xl w-full h-auto"
                    />

                    {/* Overlay Badge */}
                    <div
                        ref={badgeRef}
                        className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs md:text-sm p-3 rounded-xl flex flex-wrap gap-3 justify-center lg:justify-start"
                    >
                        <span>✔ Licensed dealer</span>
                        <span>✔ Nearly 20 years experience</span>
                        <span>✔ No pressure</span>
                        <span>✔ No obligation</span>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default HeroSection;