"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useFormContext } from "@/components/FormContext";

// ---------------------------------------------------------------------------
// Schema — must define currentYear before schema
// ---------------------------------------------------------------------------
const currentYear = new Date().getFullYear();

const schema = z.object({
  year: z
    .string()
    .min(1, "Year is required")
    .regex(/^\d{4}$/, "Year must be 4 digits")
    .refine(
      (val) => { const n = parseInt(val); return n >= 1900 && n <= currentYear + 1; },
      { message: `Year must be between 1900 and ${currentYear + 1}` }
    ),
  make:    z.string().min(1, "Make is required"),
  model:   z.string().min(1, "Model is required"),
  mileage: z.string().optional(),
  vin:     z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function Step2() {
  const { formData, updateFormData, goNext, goBack } = useFormContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      year:    formData.year    || "",
      make:    formData.make    || "",
      model:   formData.model   || "",
      mileage: formData.mileage || "",
      vin:     formData.vin     || "",
    },
  });

  function onSubmit(values: FormValues) {
    updateFormData(values);
    goNext();
  }

  return (
    <Card className="max-w-7xl mx-auto animate-fade-slide-in">
      <CardHeader>
        <CardTitle>Tell us about your car / truck / SUV</CardTitle>
        <CardDescription>Basic details help us provide an accurate assessment.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>

          {/* Year + Make */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-gray-800">
                Year <span className="text-[#D93E39]">*</span>
              </label>
              <input
                type="text"
                placeholder="2020"
                {...register("year")}
                aria-invalid={!!errors.year}
                className="h-11 w-full rounded-lg border-[1.5px] border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-[#D93E39] focus:ring-[3px] focus:ring-[#D93E39]/10 aria-invalid:border-red-400"
              />
              {errors.year && <p className="text-[12px] text-red-500">{errors.year.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-gray-800">
                Make <span className="text-[#D93E39]">*</span>
              </label>
              <input
                type="text"
                placeholder="Honda"
                {...register("make")}
                aria-invalid={!!errors.make}
                className="h-11 w-full rounded-lg border-[1.5px] border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-[#D93E39] focus:ring-[3px] focus:ring-[#D93E39]/10 aria-invalid:border-red-400"
              />
              {errors.make && <p className="text-[12px] text-red-500">{errors.make.message}</p>}
            </div>
          </div>

          {/* Model */}
          <div className="space-y-1.5 mb-4">
            <label className="text-[13px] font-medium text-gray-800">
              Model <span className="text-[#D93E39]">*</span>
            </label>
            <input
              type="text"
              placeholder="Accord"
              {...register("model")}
              aria-invalid={!!errors.model}
              className="h-11 w-full rounded-lg border-[1.5px] border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-[#D93E39] focus:ring-[3px] focus:ring-[#D93E39]/10 aria-invalid:border-red-400"
            />
            {errors.model && <p className="text-[12px] text-red-500">{errors.model.message}</p>}
          </div>

          {/* Mileage */}
          <div className="space-y-1.5 mb-4">
            <label className="text-[13px] font-medium text-gray-800">
              Mileage{" "}
              <span className="text-muted-foreground font-normal text-xs">(if applicable)</span>
            </label>
            <input
              type="text"
              placeholder="75,000"
              {...register("mileage")}
              className="h-11 w-full rounded-lg border-[1.5px] border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-[#D93E39] focus:ring-[3px] focus:ring-[#D93E39]/10"
            />
          </div>

          {/* VIN */}
          <div className="space-y-1.5 mb-7">
            <label className="text-[13px] font-medium text-gray-800">
              VIN{" "}
              <span className="text-muted-foreground font-normal text-xs">(optional — helps with accuracy)</span>
            </label>
            <input
              type="text"
              placeholder="1HGBH41JXMN109186"
              {...register("vin")}
              className="h-11 w-full rounded-lg border-[1.5px] border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-[#D93E39] focus:ring-[3px] focus:ring-[#D93E39]/10"
            />
            <p className="text-[11.5px] text-muted-foreground mt-1.5">
              VIN helps us provide the most accurate offer. Usually found on dashboard or door jamb.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              className="flex-1 border border-[#D93E39] hover:bg-[#FFF0F1] text-[#D93E39] cursor-pointer"
            >
              Back
            </Button>
            <Button type="submit" className="flex-1 bg-[#D93E39] cursor-pointer text-white">
              Continue
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}