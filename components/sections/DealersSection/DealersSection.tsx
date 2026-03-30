import CallToActionDealer from "./CallToAction";
import DealerNetwork from "./DealerNetwork";
import DealerRegistrationForm from "./Dealerregistrationform";
import DealersHero from "./DealersHero";
import TrustedByDealer from "./TrustedByDealer";
import WhyDealers from "./WhyDealers";


const DealersSection = () => {
    return (
        <section className="">
            {/* banner section */}
            <div className="bg-[#F9FAFB]">
                <div className="max-w-7xl mx-auto">
                    <DealersHero/>
                </div>
            </div>
            {/* TRUSTED BY DEALERS & PARTNERS Section */}
            <div className="pt-15">
                <TrustedByDealer/>
            </div>
            {/* Dealer Network */}
            <div className="py-11">
                <DealerNetwork/>
            </div>
            {/* why dealers*/}
            <div className="max-w-7xl mx-auto">
                <WhyDealers/>
            </div>
            {/* Dealer Registration Form */}
            <div>
                <DealerRegistrationForm/>
            </div>
            {/* Call To Action Dealer */}
            <div className="pt-25">
                <CallToActionDealer/>
            </div>
        </section>
    );
};

export default DealersSection;