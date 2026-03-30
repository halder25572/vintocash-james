// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Info } from "lucide-react";
// import { useFormContext } from "@/components/FormContext";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";

// const schema = z.object({
//   fullName: z.string().min(1, "Please enter your full name."),
//   phone: z.string().min(1, "Please enter your phone number."),
//   email: z.string().email("Please enter a valid email.").or(z.literal("")),
//   notes: z.string().optional(),
// });

// type FormValues = z.infer<typeof schema>;

// export default function Step8() {
//   const { formData, updateFormData, goNext, goBack } = useFormContext();

//   const {
//     register,
//     handleSubmit,
//     setError,
//     formState: { errors, isSubmitting },
//   } = useForm<FormValues>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       fullName: formData.fullName || "",
//       phone: formData.phone || "",
//       email: formData.email || "",
//       notes: formData.notes || "",
//     },
//   });

//   async function onSubmit(values: FormValues) {
//     updateFormData(values);

//     // ✅ Debug log
//     console.log("formData:", {
//       asset_id: formData.asset_id,
//       condition_id: formData.condition_id,
//       title_id: formData.title_id,
//       year: formData.year,
//       make: formData.make,
//       model: formData.model,
//     });

//     const baseUrl =
//       process.env.NEXT_PUBLIC_API_URL ||
//       "https://jameshughes.thenightowl.team/api";

//     const body = new FormData();
//     body.append("asset_id", String(formData.asset_id ?? ""));
//     body.append("condition_id", String(formData.condition_id ?? ""));
//     body.append("title_id", String(formData.title_id ?? ""));
//     body.append("year", formData.year);
//     body.append("make", formData.make);
//     body.append("model", formData.model);
//     body.append("mileage", formData.mileage);
//     body.append("vin", formData.vin);
//     body.append("mainGoal", formData.mainGoal);
//     body.append("sellerUpside", formData.sellerUpside);
//     body.append("fullName", values.fullName);
//     body.append("phone", values.phone);
//     body.append("email", values.email ?? "");
//     body.append("notes", values.notes ?? "");
//     body.append("source", "Website");

//     (formData.images ?? []).forEach((file) => {
//       body.append("images[]", file);
//     });
//     console.log("images count:", formData.images?.length);
//     try {
//       const response = await fetch(`${baseUrl}/create/lead`, {
//         method: "POST",
//         body,
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`${response.status} — ${errorText}`);
//       }

//       const data = await response.json();
//       console.log("✅ Lead created successfully:", data);
//       goNext();
//     } catch (err) {
//       console.error("❌ Error creating lead:", err);
//       setError("root", {
//         message: "Something went wrong. Please check your connection and try again.",
//       });
//     }
//   }

//   return (
//     <Card className="max-w-7xl mx-auto animate-scale-in">
//       <CardContent className="pt-8">
//         <div className="mb-6">
//           <h2 className="font-display text-[20px] sm:text-[22px] font-bold text-foreground mb-1">
//             How should we reach you?
//           </h2>
//           <p className="text-sm text-muted-foreground">
//             We&apos;ll use this to discuss your offer and options.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} noValidate>
//           <div className="flex flex-col gap-4 mb-5">

//             <div className="flex flex-col gap-1.5">
//               <label className="text-[13px] font-medium text-gray-800">
//                 Full Name <span className="text-[#D72638]">*</span>
//               </label>
//               <input
//                 type="text"
//                 placeholder="John Smith"
//                 {...register("fullName")}
//                 aria-invalid={!!errors.fullName}
//                 className="h-11 w-full rounded-lg border-[1.5px] border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-[#D72638] focus:ring-[3px] focus:ring-[#D72638]/10 aria-invalid:border-red-400"
//               />
//               {errors.fullName && <p className="text-[12px] text-red-500">{errors.fullName.message}</p>}
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label className="text-[13px] font-medium text-gray-800">
//                 Phone Number <span className="text-[#D72638]">*</span>
//               </label>
//               <input
//                 type="tel"
//                 placeholder="(555) 123-4567"
//                 {...register("phone")}
//                 aria-invalid={!!errors.phone}
//                 className="h-11 w-full rounded-lg border-[1.5px] border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-[#D72638] focus:ring-[3px] focus:ring-[#D72638]/10 aria-invalid:border-red-400"
//               />
//               {errors.phone && <p className="text-[12px] text-red-500">{errors.phone.message}</p>}
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label className="text-[13px] font-medium text-gray-800">
//                 Email <span className="text-muted-foreground font-normal">(optional)</span>
//               </label>
//               <input
//                 type="email"
//                 placeholder="john@example.com"
//                 {...register("email")}
//                 aria-invalid={!!errors.email}
//                 className="h-11 w-full rounded-lg border-[1.5px] border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-[#D72638] focus:ring-[3px] focus:ring-[#D72638]/10 aria-invalid:border-red-400"
//               />
//               {errors.email && <p className="text-[12px] text-red-500">{errors.email.message}</p>}
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label className="text-[13px] font-medium text-gray-800">
//                 Additional Notes <span className="text-muted-foreground font-normal">(optional)</span>
//               </label>
//               <textarea
//                 placeholder="Any additional details you'd like us to know..."
//                 rows={4}
//                 {...register("notes")}
//                 className="w-full rounded-lg border-[1.5px] border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-[#D72638] focus:ring-[3px] focus:ring-[#D72638]/10 resize-none"
//               />
//             </div>
//           </div>

//           {errors.root && (
//             <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
//               <p className="text-[13px] text-red-600">{errors.root.message}</p>
//             </div>
//           )}

//           <div className="flex items-start gap-2.5 rounded-lg bg-muted/50 px-4 py-3 mb-7">
//             <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
//             <p className="text-[12.5px] text-muted-foreground leading-relaxed">
//               Your information is kept confidential and never shared. A VinToCash
//               specialist will contact you to discuss your options—no pressure, no obligation.
//             </p>
//           </div>

//           <div className="flex gap-3">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={goBack}
//               disabled={isSubmitting}
//               className="flex-1 h-12 rounded-full border-[1.5px] border-[#D72638] bg-white text-[#D72638] text-[15px] font-semibold transition-all duration-200 hover:bg-red-50 cursor-pointer focus:outline-none"
//             >
//               Back
//             </Button>
//             <Button
//               type="submit"
//               disabled={isSubmitting}
//               className="flex-1 h-12 rounded-full bg-[#D72638] text-white text-[15px] font-semibold transition-all duration-200 hover:bg-[#b81e2e] hover:shadow-[0_4px_16px_rgba(215,38,56,0.35)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
//             >
//               {isSubmitting ? "Submitting…" : "Submit"}
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }


"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Info } from "lucide-react";
import { useFormContext } from "@/components/FormContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const schema = z.object({
  fullName: z.string().min(1, "Please enter your full name."),
  phone:    z.string().min(1, "Please enter your phone number."),
  email:    z.string().email("Please enter a valid email.").or(z.literal("")),
  notes:    z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function Step8() {
  const { formData, updateFormData, goNext, goBack } = useFormContext();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: formData.fullName || "",
      phone:    formData.phone    || "",
      email:    formData.email    || "",
      notes:    formData.notes    || "",
    },
  });

  async function onSubmit(values: FormValues) {
    updateFormData(values);

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://backend.vintocash.com/api";

    const body = new FormData();
    body.append("asset_id",     String(formData.asset_id     ?? ""));
    body.append("condition_id", String(formData.condition_id ?? ""));
    body.append("title_id",     String(formData.title_id     ?? ""));
    body.append("year",         formData.year);
    body.append("make",         formData.make);
    body.append("model",        formData.model);
    body.append("mileage",      formData.mileage);
    body.append("vin",          formData.vin);
    body.append("mainGoal",     formData.mainGoal);
    body.append("sellerUpside", formData.sellerUpside);
    body.append("fullName",     values.fullName);
    body.append("phone",        values.phone);
    body.append("email",        values.email ?? "");
    body.append("notes",        values.notes ?? "");
    body.append("source",       "Website");

    (formData.images ?? []).forEach((file) => {
      body.append("images[]", file);
    });

    try {
      const response = await fetch(`${baseUrl}/create/lead`, {
        method: "POST",
        body,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status} — ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Lead created successfully:", data);
      goNext();
    } catch (err) {
      console.error("❌ Error creating lead:", err);
      setError("root", {
        message: "Something went wrong. Please check your connection and try again.",
      });
    }
  }

  return (
    <Card className="max-w-7xl mx-auto animate-scale-in">
      <CardContent className="pt-8">
        <div className="mb-6">
          <h2 className="font-display text-[20px] sm:text-[22px] font-bold text-foreground mb-1">
            How should we reach you?
          </h2>
          <p className="text-sm text-muted-foreground">
            We&apos;ll use this to discuss your offer and options.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-4 mb-5">

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gray-800">
                Full Name <span className="text-[#D72638]">*</span>
              </label>
              <input
                type="text"
                placeholder="John Smith"
                {...register("fullName")}
                aria-invalid={!!errors.fullName}
                className="h-11 w-full rounded-lg border-[1.5px] border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-[#D72638] focus:ring-[3px] focus:ring-[#D72638]/10 aria-invalid:border-red-400"
              />
              {errors.fullName && <p className="text-[12px] text-red-500">{errors.fullName.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gray-800">
                Phone Number <span className="text-[#D72638]">*</span>
              </label>
              <input
                type="tel"
                placeholder="(555) 123-4567"
                {...register("phone")}
                aria-invalid={!!errors.phone}
                className="h-11 w-full rounded-lg border-[1.5px] border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-[#D72638] focus:ring-[3px] focus:ring-[#D72638]/10 aria-invalid:border-red-400"
              />
              {errors.phone && <p className="text-[12px] text-red-500">{errors.phone.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gray-800">
                Email <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                {...register("email")}
                aria-invalid={!!errors.email}
                className="h-11 w-full rounded-lg border-[1.5px] border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-[#D72638] focus:ring-[3px] focus:ring-[#D72638]/10 aria-invalid:border-red-400"
              />
              {errors.email && <p className="text-[12px] text-red-500">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gray-800">
                Additional Notes <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <textarea
                placeholder="Any additional details you'd like us to know..."
                rows={4}
                {...register("notes")}
                className="w-full rounded-lg border-[1.5px] border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-[#D72638] focus:ring-[3px] focus:ring-[#D72638]/10 resize-none"
              />
            </div>
          </div>

          {errors.root && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-[13px] text-red-600">{errors.root.message}</p>
            </div>
          )}

          <div className="flex items-start gap-2.5 rounded-lg bg-muted/50 px-4 py-3 mb-7">
            <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-[12.5px] text-muted-foreground leading-relaxed">
              Your information is kept confidential and never shared. A VinToCash
              specialist will contact you to discuss your options—no pressure, no obligation.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={isSubmitting}
              className="flex-1 h-12 rounded-full border-[1.5px] border-[#D72638] bg-white text-[#D72638] text-[15px] font-semibold transition-all duration-200 hover:bg-red-50 cursor-pointer focus:outline-none"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 rounded-full bg-[#D72638] text-white text-[15px] font-semibold transition-all duration-200 hover:bg-[#b81e2e] hover:shadow-[0_4px_16px_rgba(215,38,56,0.35)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting…" : "Submit"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}