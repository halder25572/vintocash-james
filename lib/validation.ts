
// export interface ValidationResult {
//   isValid: boolean;
//   errors: string[];
// }

// export function validateStep1(data: any): ValidationResult {
//   const errors: string[] = [];
  
//   if (!data.assetType) {
//     errors.push("Please select an asset type");
//   }
  
//   return {
//     isValid: errors.length === 0,
//     errors
//   };
// }

// export function validateStep2(data: any): ValidationResult {
//   const errors: string[] = [];
  
//   if (!data.year || data.year.trim() === "") {
//     errors.push("Year is required");
//   }
  
//   if (!data.make || data.make.trim() === "") {
//     errors.push("Make is required");
//   }
  
//   if (!data.model || data.model.trim() === "") {
//     errors.push("Model is required");
//   }
  
//   // Optional: Year validation (must be 4 digits, reasonable range)
//   if (data.year && !/^\d{4}$/.test(data.year)) {
//     errors.push("Year must be a 4-digit number");
//   }
  
//   const yearNum = parseInt(data.year);
//   const currentYear = new Date().getFullYear();
//   if (data.year && (yearNum < 1900 || yearNum > currentYear + 1)) {
//     errors.push(`Year must be between 1900 and ${currentYear + 1}`);
//   }
  
//   return {
//     isValid: errors.length === 0,
//     errors
//   };
// }

// export function validateStep3(data: any): ValidationResult {
//   const errors: string[] = [];
  
//   if (!data.condition) {
//     errors.push("Please select a condition");
//   }
  
//   return {
//     isValid: errors.length === 0,
//     errors
//   };
// }

// export function validateStep4(data: any): ValidationResult {
//   const errors: string[] = [];
  
//   if (!data.titleSituation) {
//     errors.push("Please select a title situation");
//   }
  
//   return {
//     isValid: errors.length === 0,
//     errors
//   };
// }

// export function validateStep5(data: any): ValidationResult {
//   // Photos are optional, so always valid
//   return {
//     isValid: true,
//     errors: []
//   };
// }

// export function validateStep6(data: any): ValidationResult {
//   const errors: string[] = [];
  
//   if (!data.mainGoal) {
//     errors.push("Please select your main goal");
//   }
  
//   return {
//     isValid: errors.length === 0,
//     errors
//   };
// }

// export function validateStep7(data: any): ValidationResult {
//   const errors: string[] = [];
  
//   if (!data.sellerUpside) {
//     errors.push("Please select an option for Seller Upside");
//   }
  
//   return {
//     isValid: errors.length === 0,
//     errors
//   };
// }

// export function validateStep8(data: any): ValidationResult {
//   const errors: string[] = [];
  
//   if (!data.fullName || data.fullName.trim() === "") {
//     errors.push("Full name is required");
//   }
  
//   if (!data.phone || data.phone.trim() === "") {
//     errors.push("Phone number is required");
//   }
  
//   // Optional: Phone validation (basic)
// //   if (data.phone && !/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(data.phone.replace(/\s/g, ''))) {
// //     errors.push("Please enter a valid phone number");
// //   }
  
//   // Optional: Email validation (if provided)
//   if (data.email && data.email.trim() !== "") {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(data.email)) {
//       errors.push("Please enter a valid email address");
//     }
//   }
  
//   return {
//     isValid: errors.length === 0,
//     errors
//   };
// }

// export function validateCurrentStep(step: number, data: any): ValidationResult {
//   switch (step) {
//     case 1: return validateStep1(data);
//     case 2: return validateStep2(data);
//     case 3: return validateStep3(data);
//     case 4: return validateStep4(data);
//     case 5: return validateStep5(data);
//     case 6: return validateStep6(data);
//     case 7: return validateStep7(data);
//     case 8: return validateStep8(data);
//     default: return { isValid: true, errors: [] };
//   }
// }

import { FormData } from "@/components/FormContext";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateStep1(data: Partial<FormData>): ValidationResult {
  const errors: string[] = [];
  if (!data.assetType) errors.push("Please select an asset type");
  return { isValid: errors.length === 0, errors };
}

export function validateStep2(data: Partial<FormData>): ValidationResult {
  const errors: string[] = [];

  // if (!data.year?.trim()) errors.push("Year is required");
  // if (!data.make?.trim()) errors.push("Make is required");
  // if (!data.model?.trim()) errors.push("Model is required");

  if (data.year && !/^\d{4}$/.test(data.year)) {
    errors.push("Year must be a 4-digit number");
  }

  const yearNum = parseInt(data.year ?? "");
  const currentYear = new Date().getFullYear();
  if (data.year && (yearNum < 1900 || yearNum > currentYear + 1)) {
    errors.push(`Year must be between 1900 and ${currentYear + 1}`);
  }

  return { isValid: errors.length === 0, errors };
}

export function validateStep3(data: Partial<FormData>): ValidationResult {
  const errors: string[] = [];
  if (!data.condition) errors.push("Please select a condition");
  return { isValid: errors.length === 0, errors };
}

export function validateStep4(data: Partial<FormData>): ValidationResult {
  const errors: string[] = [];
  if (!data.titleSituation) errors.push("Please select a title situation");
  return { isValid: errors.length === 0, errors };
}

export function validateStep5(_data: Partial<FormData>): ValidationResult {
  // Photos are optional
  return { isValid: true, errors: [] };
}

export function validateStep6(data: Partial<FormData>): ValidationResult {
  const errors: string[] = [];
  if (!data.mainGoal) errors.push("Please select your main goal");
  return { isValid: errors.length === 0, errors };
}

export function validateStep7(data: Partial<FormData>): ValidationResult {
  const errors: string[] = [];
  if (!data.sellerUpside) errors.push("Please select an option for Seller Upside");
  return { isValid: errors.length === 0, errors };
}

export function validateStep8(data: Partial<FormData>): ValidationResult {
  const errors: string[] = [];

  // if (!data.fullName?.trim()) errors.push("Full name is required");
  // if (!data.phone?.trim()) errors.push("Phone number is required");

  if (data.email?.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push("Please enter a valid email address");
    }
  }

  return { isValid: errors.length === 0, errors };
}

export function validateCurrentStep(
  step: number,
  data: Partial<FormData>
): ValidationResult {
  switch (step) {
    case 1: return validateStep1(data);
    case 2: return validateStep2(data);
    case 3: return validateStep3(data);
    case 4: return validateStep4(data);
    case 5: return validateStep5(data);
    case 6: return validateStep6(data);
    case 7: return validateStep7(data);
    case 8: return validateStep8(data);
    default: return { isValid: true, errors: [] };
  }
}