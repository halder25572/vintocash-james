import Image from "next/image";

const benefits = [
  "Access off-market inventory",
  "Vehicles sourced directly from sellers",
  "Opportunities before auction lanes",
  "Match alerts based on buying criteria",
  "Clean, professional communication",
];

const WhyDealers = () => {
  return (
    <section className="w-full bg-white px-4 py-8 sm:px-6 sm:py-12 md:px-10 md:py-16 lg:px-16 lg:py-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 sm:gap-10 lg:gap-16">

        {/* Left side */}
        <div className="w-full lg:w-1/2 flex flex-col gap-5 sm:gap-7">

          {/* Heading */}
          <h2 className="text-[#1A1A2E] font-bold leading-tight
            text-xl sm:text-2xl md:text-3xl lg:text-4xl">
            Why Dealers Join
          </h2>

          {/* List */}
          <ul className="flex flex-col gap-3 sm:gap-4">
            {benefits.map((item, i) => (
              <li key={i} className="flex items-center gap-3">

                {/* Check icon */}
                <svg
                  className="shrink-0 text-[#D93E39]"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  <path d="M8 12l3 3 5-5" />
                </svg>

                <span className="text-[#6D717F] font-medium
                  text-[13px] sm:text-[14px] md:text-[18px]">
                  {item}
                </span>

              </li>
            ))}
          </ul>
        </div>
        {/* Right side */}
        <div className="w-full sm:w-[90%] md:w-[75%] lg:w-1/2 shrink-0">
          <Image
            className="rounded-[24px] w-full h-auto object-cover"
            src="/images/whydealers.jpg"
            width={650}
            height={329}
            alt="Why Dealers Join"
          />
        </div>
      </div>
    </section>
  );
};

export default WhyDealers;