import CallToActionBanner from "@/components/sections/CallToActionBanner/CallToActionBanner";
import HeroSection from "@/components/sections/HeroSection/HeroSection";
import HowItWorks from "@/components/sections/HowItWorks/HowItWorks";
import SellerUpside from "@/components/sections/SellerUpside/SellerUpside";
import TrustedBy from "@/components/sections/TrustedBy/TrustedBy";
import WhatWeBuy from "@/components/sections/WhatWeBuy/WhatWeBuy";
import WhyVintoCash from "@/components/sections/WhyVintoCash/WhyVintoCash";


export default function Home() {
  return (
    <div className="">
      <main className="">
        <HeroSection />
        <div className="mt-10 px-2 lg:px-0">
          <TrustedBy />
        </div>
        <div className="mb-10 mt-4 lg:mt-0 px-2 lg:px-0">
          <HowItWorks />
        </div>
        <div className="">
          <WhatWeBuy/>
        </div>
        <div className="">
          <SellerUpside />
        </div>
        <div className="">
          <WhyVintoCash />
        </div>
        <div className="">
          <CallToActionBanner/>
        </div>
      </main>
    </div>
  );
}
