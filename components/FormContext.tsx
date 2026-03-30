"use client";
import React, { createContext, useContext, useState } from "react";
import { validateCurrentStep } from "@/lib/validation";

export interface FormData {
  // Step 1
  assetType: string;
  asset_id: number | null;
  // Step 2
  year: string;
  make: string;
  model: string;
  mileage: string;
  vin: string;
  // Step 3
  condition: string;
  condition_id: number | null;
  // Step 4
  titleSituation: string;
  title_id: number | null;
  // Step 5
  images: File[];
  // Step 6
  mainGoal: string;
  // Step 7
  sellerUpside: string;
  // Step 8
  fullName: string;
  phone: string;
  email: string;
  notes: string;
  // Legacy
  features: string[];
  firstName: string;
  lastName: string;
  zip: string;
  contactMethod: string;
}

interface FormContextType {
  currentStep: number;
  formData: FormData;
  goNext: () => void;
  goBack: () => void;
  goToStep: (step: number) => void;
  updateFormData: (data: Partial<FormData>) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

const TOTAL_STEPS = 9;

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    assetType:    "",
    asset_id:     null,
    year:         "",
    make:         "",
    model:        "",
    mileage:      "",
    vin:          "",
    condition:    "",
    condition_id: null,
    titleSituation: "",
    title_id:     null,
    images:       [],
    mainGoal:     "",
    sellerUpside: "",
    fullName:     "",
    phone:        "",
    email:        "",
    notes:        "",
    features:     [],
    firstName:    "",
    lastName:     "",
    zip:          "",
    contactMethod: "Phone Call",
  });

  const goNext = () => {
    const validation = validateCurrentStep(currentStep, formData);
    if (!validation.isValid) {
      alert(validation.errors.join("\n"));
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));
  const goToStep = (step: number) => setCurrentStep(step);
  const updateFormData = (data: Partial<FormData>) =>
    setFormData((prev) => ({ ...prev, ...data }));

  return (
    <FormContext.Provider
      value={{ currentStep, formData, goNext, goBack, goToStep, updateFormData }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useFormContext must be used within FormProvider");
  return ctx;
}