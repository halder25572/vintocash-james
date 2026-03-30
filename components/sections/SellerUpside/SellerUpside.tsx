import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function SellerUpside() {
  return (
    <section className="pb-10 md:pb-16">
      <div className="max-w-6xl mx-auto px-4">

        <div className="rounded-2xl overflow-hidden grid md:grid-cols-2">

          {/* LEFT IMAGE */}
          <div className="relative min-h-55 md:min-h-full">
            <Image
              src="/images/car22.png"  // 👉 public/images/red-car.png
              alt="car"
              width={651}
              height={400}
              priority
              className="object-cover"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="bg-black text-white p-6 md:p-10 flex flex-col justify-center">
            <h3 className="text-xl md:text-2xl font-semibold">
              More Than One Way To Sell
            </h3>

            <p className="mt-4 text-gray-300 text-sm md:text-base leading-relaxed">
              Some vehicles qualify for our Seller Upside option allowing you
              to participate in the final sale instead of taking an immediate
              cash offer. It&apos;s optional, transparent, and only offered when it
              makes sense.
            </p>

            <div className="mt-6">
              <Button className="w-full text-[18px] font-bold cursor-pointer bg-[#D93E39] hover:bg-red-600 text-white rounded-full px-6 py-5">
                Learn About Seller Upside
              </Button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

