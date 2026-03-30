import { FormProvider } from "@/components/FormContext";
import { MultiStepForm } from "@/components/MultiStepForm";


export const metadata = {
  title: "VintoCash || Get A Offer"
}


const GetAOfferPage = () => {
  return (
    <main className="w-full bg-[#F9FAFB] flex items-start justify-center">
      <FormProvider>
        <MultiStepForm />
      </FormProvider>
    </main>
  );
};

export default GetAOfferPage;