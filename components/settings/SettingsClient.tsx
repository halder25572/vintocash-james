"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import clsx from "clsx";
import { useAuthStore } from "@/store/useAuthStore";

type DealerInfoResponse = {
  success: boolean;
  message?: string;
  data?: {
    name: string;
    dealership_name: string;
    contact_name: string;
    contact_number: string;
    license_number: string;
    website_url: string | null;
    email: string;
    city: string;
    state: string;
    profile_image: string | null;
  };
};

type DealerInfoUpdateResponse = {
  success: boolean;
  message?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://backend.vintocash.com/api";

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");
const STORAGE_ORIGIN =
  (process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend.vintocash.com/api").replace(
    /\/api\/?$/,
    ""
  );

const FALLBACK_PROFILE_IMAGE = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face";

const addCacheBuster = (url: string, version: number) => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${version}`;
};

const isDataUrl = (value: string | null | undefined) =>
  Boolean(value && value.startsWith("data:"));
const DEALER_PROFILE_IMAGE_KEY = "dealer-profile-image-path";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const buildImageCandidates = (imagePath: string | null | undefined) => {
  if (!imagePath) return [];
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    const version = new Date().getTime();
    return [addCacheBuster(imagePath, version)];
  }

  const normalized = imagePath.replace(/^\/+/, "");
  const storageNormalized = normalized.replace(/^storage\//, "");
  const timestamp = new Date().getTime();
  const candidates = [
    `${API_ORIGIN}/${normalized}?v=${timestamp}`,
    `${API_ORIGIN}/storage/${storageNormalized}?v=${timestamp}`,
    `${STORAGE_ORIGIN}/${normalized}?v=${timestamp}`,
    `${STORAGE_ORIGIN}/storage/${storageNormalized}?v=${timestamp}`,
  ];

  return [...new Set(candidates)];
};

const readFileAsDataURL = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read selected image."));
    reader.readAsDataURL(file);
  });

const profileSchema = z.object({
  dealershipName: z.string().min(2, "Dealership name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  phoneNumber: z.string().min(10, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email address"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  licenseNumber: z.string().min(3, "License number is required"),
  websiteUrl: z.string().optional(),
  profileImage: z.any().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmNewPassword: z.string().optional(),
}).refine(
  (data) => {
    if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
      return false;
    }
    return true;
  },
  {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  }
);

type FormData = z.infer<typeof profileSchema>;

const profileFields: {
  label: string;
  name: keyof FormData;
  placeholder: string;
}[] = [
  { label: "Dealership Name", name: "dealershipName", placeholder: "e.g. Prestige Motors" },
  { label: "Contact Name", name: "contactName", placeholder: "John Doe" },
  { label: "Phone Number", name: "phoneNumber", placeholder: "(555) 000-0000" },
  { label: "Email Address", name: "email", placeholder: "john@dealership.com" },
  { label: "City", name: "city", placeholder: "Austin" },
  { label: "State", name: "state", placeholder: "TX" },
  { label: "License Number", name: "licenseNumber", placeholder: "(555) 000-0000" },
  { label: "Website URL", name: "websiteUrl", placeholder: "https://..." },
];

const passwordFields: {
  label: string;
  name: keyof FormData;
}[] = [
  { label: "Current Password", name: "currentPassword" },
  { label: "New Password", name: "newPassword" },
  { label: "Confirm New Password", name: "confirmNewPassword" },
];

export default function SettingsClient() {
  const token = useAuthStore((state) => state.token);
  const [isEditing, setIsEditing] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [profileName, setProfileName] = useState("-");
  const [profileEmail, setProfileEmail] = useState("-");
  const [profileImageCandidates, setProfileImageCandidates] = useState<string[]>([]);
  const [profileImageIndex, setProfileImageIndex] = useState(0);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      dealershipName: "",
      contactName: "John Doe",
      phoneNumber: "(555) 000-0000",
      email: "john@dealership.com",
      city: "Austin",
      state: "TX",
      licenseNumber: "(555) 000-0000",
      websiteUrl: "https://...",
      profileImage: undefined,
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const selectedProfileImage = watch("profileImage") as FileList | undefined;
  const activeProfileImage =
    profileImagePreview || profileImageCandidates[profileImageIndex] || FALLBACK_PROFILE_IMAGE;

  const handleAvatarLoadError = () => {
    if (profileImagePreview) {
      setProfileImagePreview(null);
      return;
    }
    setProfileImageIndex((prev) => prev + 1);
  };

  useEffect(() => {
    const selectedFile = selectedProfileImage?.[0];
    if (!selectedFile) {
      setProfileImagePreview(null);
      return;
    }

    let cancelled = false;

    void readFileAsDataURL(selectedFile)
      .then((dataUrl) => {
        if (!cancelled) {
          setProfileImagePreview(dataUrl);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProfileImagePreview(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedProfileImage]);

  const fetchDealerInfoSnapshot = async (authToken: string) => {
    const response = await fetch(`${API_BASE_URL}/dealer/info`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    const result: DealerInfoResponse = await response.json();

    if (!response.ok || !result.success || !result.data) {
      throw new Error(result.message || "Failed to load dealer info.");
    }

    const dealer = result.data;

    setProfileName(dealer.name || dealer.contact_name || "-");
    setProfileEmail(dealer.email || "-");
    setProfileImageCandidates(buildImageCandidates(dealer.profile_image));
    setProfileImageIndex(0);

    reset({
      dealershipName: dealer.dealership_name || "",
      contactName: dealer.contact_name || "",
      phoneNumber: dealer.contact_number || "",
      email: dealer.email || "",
      city: dealer.city || "",
      state: dealer.state || "",
      licenseNumber: dealer.license_number || "",
      websiteUrl: dealer.website_url || "",
      profileImage: undefined,
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });

    return dealer;
  };

  const refreshDealerInfoUntilImageChanges = async (
    authToken: string,
    currentImagePath: string | null | undefined
  ) => {
    let latestDealer: DealerInfoResponse["data"] | undefined;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      latestDealer = await fetchDealerInfoSnapshot(authToken);
      const latestImagePath = latestDealer?.profile_image || null;

      if (latestImagePath && latestImagePath !== currentImagePath && !isDataUrl(latestImagePath)) {
        window.localStorage.setItem(DEALER_PROFILE_IMAGE_KEY, latestImagePath);
        return latestDealer;
      }

      await wait(600);
    }

    return latestDealer;
  };

  const onSubmit = async (data: FormData) => {
    if (!token) {
      setSaveError("Please login to update dealer info.");
      return;
    }

    setSaveError("");
    setSaveMessage("");
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("dealership_name", data.dealershipName);
      formData.append("contact_name", data.contactName);
      formData.append("contact_number", data.phoneNumber);
      formData.append("license_number", data.licenseNumber);
      formData.append("website_url", data.websiteUrl || "");
      formData.append("email", data.email);
      formData.append("city", data.city);
      formData.append("state", data.state);

      const profileImageFile = selectedProfileImage?.[0];
      if (profileImageFile) {
        formData.append("profile_image", profileImageFile);
      }

      if (data.currentPassword) {
        formData.append("current_password", data.currentPassword);
      }

      if (data.newPassword) {
        formData.append("new_password", data.newPassword);
      }

      if (data.confirmNewPassword) {
        formData.append("new_password_confirmation", data.confirmNewPassword);
      }

      const response = await fetch(`${API_BASE_URL}/dealer/info/update`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result: DealerInfoUpdateResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update dealer information.");
      }

      setSaveMessage(result.message || "Dealer information updated successfully.");
      const previousImagePath = window.localStorage.getItem(DEALER_PROFILE_IMAGE_KEY);
      const updatedDealer = await refreshDealerInfoUntilImageChanges(token, previousImagePath);
      const safeBroadcastImage =
        updatedDealer?.profile_image && !isDataUrl(updatedDealer.profile_image)
          ? updatedDealer.profile_image
          : previousImagePath || undefined;
      window.dispatchEvent(
        new CustomEvent("dealer-profile-updated", {
          detail: {
            name: data.contactName || data.dealershipName,
            image: safeBroadcastImage,
            previewImage: profileImagePreview || undefined,
          },
        })
      );
      setIsEditing(false);
    } catch (submitError: unknown) {
      setSaveError(submitError instanceof Error ? submitError.message : "Failed to update dealer information.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (!token) {
      setIsLoadingProfile(false);
      setProfileError("Please login to load dealer info.");
      return;
    }

    const fetchDealerInfo = async () => {
      setIsLoadingProfile(true);
      setProfileError("");

      try {
        await fetchDealerInfoSnapshot(token);
      } catch (fetchError: unknown) {
        setProfileError(fetchError instanceof Error ? fetchError.message : "Failed to load dealer info.");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchDealerInfo();
  }, [hydrated, token, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-4xl">
      {isLoadingProfile && (
        <div className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
          Loading dealer info...
        </div>
      )}

      {!isLoadingProfile && profileError && (
        <div className="w-full rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {profileError}
        </div>
      )}

      {!!saveError && (
        <div className="w-full rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {saveError}
        </div>
      )}

      {!!saveMessage && (
        <div className="w-full rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {saveMessage}
        </div>
      )}

      {/* ── Profile Card ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Card Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-bold text-gray-800">Profile</p>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-[#D93E39] hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Edit Profile
          </button>
        </div>

        {/* Avatar Row */}
        <div className="flex items-center justify-between px-5 py-4 bg-red-50 border-b border-red-100/60">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-200 shrink-0">
              <Image
                src={activeProfileImage}
                alt={profileName}
                fill
                sizes="56px"
                className="object-cover"
                onError={handleAvatarLoadError}
              />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{profileName}</p>
              <p className="text-xs text-gray-400 mt-0.5">{profileEmail}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 border border-[#D93E39] text-[#D93E39] text-sm font-semibold rounded-xl hover:bg-white transition-colors bg-white/60 cursor-pointer"
          >
            Upload Photo
          </button>
          <input
            type="file"
            accept="image/*"
            {...register("profileImage")}
            ref={(el) => {
              register("profileImage").ref(el);
              fileInputRef.current = el;
            }}
            className="hidden"
          />
        </div>

        {!!selectedProfileImage?.[0] && (
          <p className="px-5 pb-4 text-xs text-gray-500">
            Selected image: {selectedProfileImage[0].name}
          </p>
        )}

        {/* Profile Form Grid */}
        <div className="px-5 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {profileFields.map((field) => (
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
                      ? "border-[#D93E39] bg-red-50 text-red-600"
                      : isEditing
                      ? "border-gray-200 bg-white text-gray-700 focus:border-[#D93E39]"
                      : "border-gray-200 bg-white text-gray-600 cursor-default"
                  )}
                />
                {errors[field.name] && (
                  <p className="text-xs text-[#D93E39] mt-1">
                    {String(errors[field.name]?.message || "")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Change Password Card ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-bold text-gray-800">Change Password</p>
        </div>

        <div className="px-5 py-5">
          <div className="flex flex-col gap-4">
            {passwordFields.map((field) => (
              <div key={field.name}>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">
                  {field.label}
                </label>
                <input
                  {...register(field.name)}
                  type="password"
                  disabled={!isEditing}
                  className={clsx(
                    "w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all",
                    errors[field.name]
                      ? "border-[#D93E39] bg-red-50 text-red-600"
                      : isEditing
                      ? "border-gray-200 bg-white text-gray-700 focus:border-[#D93E39]"
                      : "border-gray-200 bg-white text-gray-600 cursor-default"
                  )}
                />
                {errors[field.name] && (
                  <p className="text-xs text-[#D93E39] mt-1">
                    {String(errors[field.name]?.message || "")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Cancel / Save ── */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="py-3.5 rounded-xl border border-[#D93E39] text-[#D93E39] text-sm font-bold hover:bg-red-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isEditing || isSaving}
          className="py-3.5 rounded-xl bg-[#D93E39] hover:bg-red-600 text-white text-sm font-bold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}