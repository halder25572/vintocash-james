"use client";
import { CircleCheckBig } from "lucide-react";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import CallToActionBanner from "../CallToActionBanner/CallToActionBanner";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────
interface AssetProperty {
  id: number;
  asset_id: number;
  property_name: string;
}

interface Asset {
  id: number;
  assetType: string;
  description: string;
  image: string;
  property: AssetProperty[];
}

interface Condition {
  id: number;
  condition: string;
  describtion: string;
}

// ─── Card background colors (same order as original) ─────────────────────────
const CARD_COLORS = ["#FDECEC", "#DBFFF2", "#DFF0FF", "#F3F3E0", "#DEE6FF"];

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend.vintocash.com/api";

// ─── Main Component ───────────────────────────────────────────────────────────
const WhatWeBuySection = () => {
    const heroImgRef = useRef<HTMLDivElement>(null);
    const heroTitleRef = useRef<HTMLHeadingElement>(null);
    const heroSubRef = useRef<HTMLParagraphElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);
    const card5Ref = useRef<HTMLDivElement>(null);
    const anyConditionArticleRef = useRef<HTMLElement>(null);
    const conditionCardsRef = useRef<HTMLDivElement>(null);
    const professionalReviewRef = useRef<HTMLDivElement>(null);

    const [assets, setAssets] = useState<Asset[]>([]);
    const [conditions, setConditions] = useState<Condition[]>([]);
    const [loading, setLoading] = useState(true);

    // ── Fetch APIs ─────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [assetRes, conditionRes] = await Promise.all([
                    fetch(`${BASE_URL}/asset/data/get`),
                    fetch(`${BASE_URL}/condition/data/get`),
                ]);
                const [assetJson, conditionJson] = await Promise.all([
                    assetRes.json(),
                    conditionRes.json(),
                ]);
                if (assetJson.status) setAssets(assetJson.data);
                if (conditionJson.status) setConditions(conditionJson.data);
            } catch (err) {
                console.error("Failed to fetch data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    // ── GSAP (exactly same as original) ───────────────────────────────────
    useEffect(() => {
        if (loading) return;

        const ctx = gsap.context(() => {

            gsap.from(heroImgRef.current, {
                opacity: 0,
                scale: 0.95,
                duration: 1,
                ease: "power3.out",
            });

            gsap.from(heroTitleRef.current, {
                opacity: 0,
                y: 50,
                duration: 0.8,
                delay: 0.3,
                ease: "power3.out",
            });

            gsap.from(heroSubRef.current, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                delay: 0.5,
                ease: "power3.out",
            });

            if (cardsRef.current) {
                const cards = cardsRef.current.querySelectorAll(":scope > div");
                cards.forEach((card, index) => {
                    const fromX = index % 2 === 0 ? -120 : 120;
                    gsap.from(card, {
                        scrollTrigger: {
                            trigger: card,
                            start: "top 88%",
                            toggleActions: "play none none none",
                        },
                        opacity: 0,
                        x: fromX,
                        duration: 0.8,
                        delay: (index % 2 === 0 ? 0 : 0.1),
                        ease: "power3.out",
                    });
                });
            }

            gsap.from(card5Ref.current, {
                scrollTrigger: {
                    trigger: card5Ref.current,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
                opacity: 0,
                y: 60,
                duration: 0.7,
                ease: "power3.out",
            });

            gsap.from(anyConditionArticleRef.current, {
                scrollTrigger: {
                    trigger: anyConditionArticleRef.current,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: "power3.out",
            });

            if (conditionCardsRef.current) {
                const condCards = conditionCardsRef.current.querySelectorAll(":scope > div");
                gsap.from(condCards, {
                    scrollTrigger: {
                        trigger: conditionCardsRef.current,
                        start: "top 85%",
                        toggleActions: "play none none none",
                    },
                    opacity: 0,
                    y: 40,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out",
                });
            }

            gsap.from(professionalReviewRef.current, {
                scrollTrigger: {
                    trigger: professionalReviewRef.current,
                    start: "top 90%",
                    toggleActions: "play none none none",
                },
                opacity: 0,
                y: 30,
                duration: 0.7,
                ease: "power2.out",
            });

        });

        return () => ctx.revert();
    }, [loading]);

    // first 4 → 2-col grid, 5th → full width (same as original layout)
    const gridAssets = assets.slice(0, 4);
    const lastAsset = assets[4] ?? null;

    return (
        <section className="bg-gray-100 py-10 mt-10">
            <div className="max-w-7xl mx-auto">

                {/* ── hero banner ── */}
                <div
                    ref={heroImgRef}
                    className="relative w-full h-78 mb-15 px-4 lg:px-0"
                >
                    <Image
                        src="/images/buy.jpg"
                        alt="this is car"
                        fill
                        priority
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
                            What We Buy?
                        </h1>
                        <p
                            ref={heroSubRef}
                            className="mt-4 text-[18px] lg:text-[20px] text-[#6D717F]"
                        >
                            From everyday vehicles to specialized commercial assets, we purchase a wide <br /> range of vehicles and equipment in all conditions.
                        </p>
                    </article>
                </div>

                {/* ── card section ── */}
                <div>
                    {/* 2-col grid (first 4 assets) */}
                    <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-9.25 mt-15 px-4 lg:px-0">
                        {loading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="bg-gray-200 animate-pulse rounded-[30px] h-64" />
                            ))
                            : gridAssets.map((asset, index) => (
                                <div
                                    key={asset.id}
                                    className="grid grid-cols-1 lg:grid-cols-2 items-center rounded-[30px]"
                                    style={{ backgroundColor: CARD_COLORS[index] }}
                                >
                                    <div className="px-5 pt-5 lg:pt-0">
                                        <img
                                            className="h-75 w-full object-cover rounded-4xl"
                                            src={asset.image}
                                            alt={asset.assetType}
                                        />
                                    </div>
                                    <div className="py-5 px-4 lg:px-0">
                                        <h1 className="text-2xl font-semibold text-[#131927] capitalize">{asset.assetType}</h1>
                                        <p className="text-[16px] text-[#6D717F] mt-4 whitespace-pre-line">{asset.description}</p>
                                        <div className="mt-6 space-y-3">
                                            {asset.property?.map((p) => (
                                                <div key={p.id} className="flex gap-2">
                                                    <CircleCheckBig className="text-[#D93E39]" />
                                                    <h2 className="text-[14px] text-[#6D717F]">{p.property_name}</h2>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    {/* 5th card — full width */}
                    {!loading && lastAsset && (
                        <div
                            ref={card5Ref}
                            className="mx-4 lg:flex items-center rounded-[30px] mt-6"
                            style={{ backgroundColor: CARD_COLORS[4] }}
                        >
                            <div className="p-5 pt-5">
                                <img
                                    className="h-75 w-full object-cover rounded-4xl"
                                    src={lastAsset.image}
                                    alt={lastAsset.assetType}
                                />
                            </div>
                            <div className="py-5 px-4 lg:px-0">
                                <h1 className="text-2xl font-semibold text-[#131927] capitalize">{lastAsset.assetType}</h1>
                                <p className="text-[16px] text-[#6D717F] mt-4 whitespace-pre-line">{lastAsset.description}</p>
                                <div className="mt-6 space-y-3">
                                    {lastAsset.property?.map((p) => (
                                        <div key={p.id} className="flex gap-2">
                                            <CircleCheckBig className="text-[#D93E39]" />
                                            <h2 className="text-[14px] text-[#6D717F]">{p.property_name}</h2>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── article ── */}
                <article ref={anyConditionArticleRef} className="text-center mt-40">
                    <h1 className="text-[44px] lg:text-[60px] font-bold">Any Condition Accepted</h1>
                    <p className="mt-4 text-[17px] lg:text-[20px] text-[#6D717F]">
                        Whether your vehicle is in pristine condition or needs significant work, we&apos;ll <br /> provide a fair offer based on its current state.
                    </p>
                </article>

                {/* ── condition cards ── */}
                <div>
                    <div ref={conditionCardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12 px-4">
                        {loading
                            ? Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="bg-gray-200 animate-pulse rounded-[14px] h-24" />
                            ))
                            : conditions.map((c) => (
                                <div key={c.id} className="p-6 bg-white rounded-[14px]">
                                    <h1 className="text-[18px] font-bold">{c.condition}</h1>
                                    <p className="text-[14px] text-[#6D717F]">{c.describtion}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* ── professional review ── */}
                <div ref={professionalReviewRef} className="mt-12">
                    <div className="bg-[#EFF6FF] border border-[#BEDBFF] p-6 rounded-[14px]">
                        <h1 className="text-[18px] font-medium">Professional Review Process</h1>
                        <p className="text-[#6D717F] text-[16px]">Every asset receives a professional review. We assess condition, market demand, and potential value. Even if your vehicle needs significant work or isn&apos;t running, it may still have value—submit it and let us provide an honest assessment.</p>
                    </div>
                </div>

                {/* ── call to action ── */}
                <div className="mt-27.5">
                    <CallToActionBanner />
                </div>

            </div>
        </section>
    );
};

export default WhatWeBuySection;