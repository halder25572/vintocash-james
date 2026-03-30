import Image from "next/image";

const steps = [
  {
    number: 1,
    title: "We Source Vehicles Directly",
    description:
      "Vehicles are submitted to VinToCash by private sellers and businesses.",
  },
  {
    number: 2,
    title: "We Review & Qualify Units",
    description:
      "If a vehicle does not fit our own inventory strategy, it may be offered to our dealer network.",
  },
  {
    number: 3,
    title: "Dealers Get First Look",
    description:
      "Approved dealers may receive select opportunities based on buying preferences, geography, and vehicle type.",
  },
];

const DealerNetwork = () => {
  return (
    <section className="w-full bg-[#F3F4F6] px-4 py-8 sm:px-6 sm:py-12 md:px-10 md:py-16 lg:px-16 lg:py-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 sm:gap-10 lg:gap-16">

        {/* Left side */}
        <div className="w-full sm:w-[90%] md:w-[75%] lg:w-1/2 shrink-0">
          <Image
            className="rounded-2xl w-full h-auto object-cover"
            src="/images/dealernet.jpg"
            width={650}
            height={450}
            alt="Dealer Network"
          />
        </div>

        {/* Right side */}
        <div className="w-full lg:w-1/2 flex flex-col gap-5 sm:gap-7">

          {/* Heading */}
          <h2 className="text-[#1A1A2E] font-bold leading-tight
            text-xl sm:text-2xl md:text-3xl lg:text-4xl">
            How the Dealer Network Works
          </h2>

          {/* Steps */}
          {steps.map((step) => (
            <div key={step.number} className="flex items-start gap-3 sm:gap-4">

              {/* Number badge */}
              <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-[#D93E39] flex items-center justify-center">
                <span className="text-white text-xs sm:text-sm md:text-base font-bold">
                  {step.number}
                </span>
              </div>

              {/* Text */}
              <div className="flex flex-col gap-0.5 sm:gap-1 pt-0.5">
                <h3 className="text-[#1A1A2E] font-bold leading-snug
                  text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px]">
                  {step.title}
                </h3>
                <p className="text-[#6B7280] leading-relaxed
                  text-[12px] sm:text-[13px] md:text-[14px]">
                  {step.description}
                </p>
              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default DealerNetwork;