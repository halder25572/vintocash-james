// export interface LeadFormValues {
//   // Step 1–early steps
//   asset_id?: number | string;
//   condition_id?: number | string;
//   title_id?: number | string;
//   id?: number | string;           // if really needed
//   year?: string;
//   model?: string;
//   mileage?: string;
//   vin?: string;

//   // Step – goals / upside
//   mainGoal?: string;
//   sellerUpside?: string;

//   // Final step – contact
//   fullName: string;               // required
//   phone: string;                  // required
//   email?: string;
//   notes?: string;

//   // Files (multiple)
//   images?: FileList | File[];     // RHF gives FileList from <input type="file" multiple />
// }

// types/form.ts
import { z } from "zod";

export const leadFormSchema = z.object({
  // Early steps
  asset_id: z.string().default("1"),
  condition_id: z.string().default("1"),
  title_id: z.string().default("1"),
  year: z.string().optional(),
  model: z.string().optional(),
  mileage: z.string().optional(),
  vin: z.string().optional(),

  mainGoal: z.string().optional(),
  sellerUpside: z.string().optional(),

  // Final step – required
  fullName: z.string().min(2, "Full name is required"),
phone: z
  .string()
  .regex(/^01[3-9]\d{8}$/, "Please enter a valid mobile number")
  .transform((val) => val.trim()),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  notes: z.string().optional(),

  // Files – handled specially (RHF gives FileList)
  images: z.any().optional(), // We'll refine this in form config if needed
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;