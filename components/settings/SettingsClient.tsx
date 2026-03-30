"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import clsx from "clsx";

const schema = z.object({
  dealershipName: z.string().min(2, "Dealership name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  phoneNumber: z
    .string()
    .min(10, "Enter a valid phone number")
    .regex(/^[\d\s\(\)\-\+]+$/, "Invalid phone number"),
  email: z.string().email("Enter a valid email address"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  licenseNumber: z.string().min(3, "License number is required"),
  websiteUrl: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.startsWith("http"),
      "URL must start with http:// or https://"
    ),
});

type FormData = z.infer<typeof schema>;

type ToggleItem = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

const defaultToggles: ToggleItem[] = [
  {
    id: "email",
    label: "Email Alerts",
    description: "Receive important updates via email",
    enabled: true,
  },
  {
    id: "deal",
    label: "Deal Alerts",
    description: "Get notified about hot deals",
    enabled: true,
  },
  {
    id: "listings",
    label: "New Listings",
    description: "Alerts for vehicles matching your preferences",
    enabled: true,
  },
  {
    id: "bids",
    label: "Bid Updates",
    description: "Notifications about your active bids",
    enabled: false,
  },
];

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={clsx(
        "relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0",
        enabled ? "bg-emerald-400" : "bg-gray-200"
      )}
    >
      <span
        className={clsx(
          "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200",
          enabled ? "translate-x-6" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export default function SettingsClient() {
  const [toggles, setToggles] = useState(defaultToggles);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      dealershipName: "",
      contactName: "John Doe",
      phoneNumber: "(555) 000-0000",
      email: "john@dealership.com",
      city: "Austin",
      state: "TX",
      licenseNumber: "(555) 000-0000",
      websiteUrl: "https://...",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Saved:", data);
    setIsEditing(false);
  };

  const toggleNotification = (id: string) => {
    setToggles((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const fields: {
    label: string;
    name: keyof FormData;
    placeholder: string;
  }[] = [
    {
      label: "Dealership Name",
      name: "dealershipName",
      placeholder: "e.g. Prestige Motors",
    },
    {
      label: "Contact Name",
      name: "contactName",
      placeholder: "John Doe",
    },
    {
      label: "Phone Number",
      name: "phoneNumber",
      placeholder: "(555) 000-0000",
    },
    {
      label: "Email Address",
      name: "email",
      placeholder: "john@dealership.com",
    },
    {
      label: "City",
      name: "city",
      placeholder: "Austin",
    },
    {
      label: "State",
      name: "state",
      placeholder: "TX",
    },
    {
      label: "License Number",
      name: "licenseNumber",
      placeholder: "(555) 000-0000",
    },
    {
      label: "Website URL",
      name: "websiteUrl",
      placeholder: "https://...",
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">

      {/* ── Profile Card ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Card Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <p className="text-sm font-bold text-gray-800">Profile</p>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-[#D93E39] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Edit Profile
          </button>
        </div>

        {/* Avatar Row */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-red-50 border-b border-red-100/60">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-200 shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
                alt="John Doe"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">John Doe</p>
              <p className="text-xs text-gray-400 mt-0.5">john@dealership.com</p>
            </div>
          </div>
          <button
            type="button"
            className="px-4 py-2 border border-[#D93E39] text-[#D93E39] text-sm font-semibold rounded-xl hover:bg-white transition-colors bg-white/60"
          >
            Upload Photo
          </button>
        </div>

        {/* Form Grid */}
        <div className="px-5 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">
                  {field.label}
                </label>
                <input
                  {...register(field.name)}
                  placeholder={field.placeholder}
                  disabled={!isEditing}
                  className={clsx(
                    "w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all",
                    errors[field.name]
                      ? "border-red-400 bg-red-50 text-[#D93E39] focus:border-[#D93E39]"
                      : isEditing
                      ? "border-gray-200 bg-white text-gray-700 focus:border-[#D93E39]"
                      : "border-gray-200 bg-white text-gray-600 cursor-default"
                  )}
                />
                {errors[field.name] && (
                  <p className="text-xs text-[#D93E39] mt-1">
                    {errors[field.name]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Notifications Card ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <p className="text-sm font-bold text-gray-800">Notifications</p>
        </div>
        <div className="divide-y divide-gray-100">
          {toggles.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-5 py-4"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {item.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {item.description}
                </p>
              </div>
              <Toggle
                enabled={item.enabled}
                onChange={() => toggleNotification(item.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Cancel / Save ── */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="py-3.5 rounded-xl border cursor-pointer border-[#D93E39] text-[#D93E39] text-sm font-bold hover:bg-red-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="py-3.5 rounded-xl cursor-pointer bg-[#D93E39] text-white text-sm font-bold transition-colors"
        >
          Save
        </button>
      </div>
    </form>
  );
}