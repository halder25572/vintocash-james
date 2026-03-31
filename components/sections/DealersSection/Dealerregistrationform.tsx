"use client";

import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";

type ContactMethod = "phone" | "text" | "email";

type VehicleCategory = {
  id: number;
  category_name: string;
  status: string;
};

type PriceRange = {
  id: number;
  min_price: number;
  max_price: number;
};

type BuyingVolume = {
  id: number;
  min_volume: number;
  max_volume: number;
};

type MileagePreference = {
  id: number;
  mileage: string;
};

type FormData = {
  dealershipName: string;
  contactName: string;
  phoneNumber: string;
  emailAddress: string;
  city: string;
  state: string;
  licenseNumber: string;
  websiteUrl: string;
  bestContactMethod: ContactMethod;
  vehicleCategories: number[];
  priceRange: string;
  mileagePreference: string;
  titleTolerance: string;
  buyingVolume: string;
  additionalNotes: string;
};

const titleToleranceOptions = [
  { id: 1, label: "Clean Only" },
  { id: 2, label: "Clean or Salvage" },
  { id: 3, label: "Any Title" },
  { id: 4, label: "Rebuilt Accepted" },
];

export default function DealerRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [vehicleCategories, setVehicleCategories] = useState<VehicleCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [priceRanges, setPriceRanges] = useState<PriceRange[]>([]);
  const [priceRangesLoading, setPriceRangesLoading] = useState(true);
  const [buyingVolumes, setBuyingVolumes] = useState<BuyingVolume[]>([]);
  const [buyingVolumesLoading, setBuyingVolumesLoading] = useState(true);
  const [mileagePreferences, setMileagePreferences] = useState<MileagePreference[]>([]);
  const [mileagePreferencesLoading, setMileagePreferencesLoading] = useState(true);

  // Fetch all dropdown data from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_DEAL}/dealer/vehicle/category`
        );
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setVehicleCategories(result.data.filter((cat: VehicleCategory) => cat.status === "active"));
        }
      } catch (error) {
        console.error("Failed to fetch vehicle categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    const fetchPriceRanges = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_DEAL}/dealer/vehicle/pricerange`
        );
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setPriceRanges(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch price ranges:", error);
      } finally {
        setPriceRangesLoading(false);
      }
    };

    const fetchBuyingVolumes = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_DEAL}/dealer/vehicle/buyingvolume`
        );
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setBuyingVolumes(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch buying volumes:", error);
      } finally {
        setBuyingVolumesLoading(false);
      }
    };

    const fetchMileagePreferences = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_DEAL}/dealer/vehicle/mileagepreference`
        );
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setMileagePreferences(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch mileage preferences:", error);
      } finally {
        setMileagePreferencesLoading(false);
      }
    };

    fetchCategories();
    fetchPriceRanges();
    fetchBuyingVolumes();
    fetchMileagePreferences();
  }, []);

  // Helper to format price range label
  const formatPriceRange = (range: PriceRange) => {
    const formatPrice = (price: number) => {
      if (price >= 1000) {
        return `$${(price / 1000).toFixed(0)}k`;
      }
      return `$${price}`;
    };
    return `${formatPrice(range.min_price)} - ${formatPrice(range.max_price)}`;
  };

  // Helper to format buying volume label
  const formatBuyingVolume = (volume: BuyingVolume) => {
    return `${volume.min_volume}-${volume.max_volume} units/mo`;
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      bestContactMethod: "phone",
      vehicleCategories: [],
      priceRange: "",
      mileagePreference: "",
      titleTolerance: "1",
      buyingVolume: "",
    },
  });

  // Set default values when API data loads
  useEffect(() => {
    if (priceRanges.length > 0) {
      setValue("priceRange", String(priceRanges[0].id));
    }
  }, [priceRanges, setValue]);

  useEffect(() => {
    if (mileagePreferences.length > 0) {
      setValue("mileagePreference", String(mileagePreferences[0].id));
    }
  }, [mileagePreferences, setValue]);

  useEffect(() => {
    if (buyingVolumes.length > 0) {
      setValue("buyingVolume", String(buyingVolumes[0].id));
    }
  }, [buyingVolumes, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Map form data to API payload
      const payload = {
        dealership_name: data.dealershipName,
        contact_name: data.contactName,
        email: data.emailAddress,
        contact_number: data.phoneNumber,
        website_url: data.websiteUrl || null,
        city: data.city,
        state: data.state,
        best_contact_method: data.bestContactMethod,
        additional_notes: data.additionalNotes || null,
        license_number: data.licenseNumber,
        price_range_id: parseInt(data.priceRange),
        buying_volume_id: parseInt(data.buyingVolume),
        mileage_preference_id: parseInt(data.mileagePreference),
        title_situation_id: parseInt(data.titleTolerance),
        categories: data.vehicleCategories,
      };

      console.log("Submitting payload:", payload);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_DEAL}/dealer/info/store`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.status) {
        throw new Error(result?.message || "Submission failed. Please try again.");
      }

      reset();
      setShowModal(true);
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">

      {/* ── Success Modal ─────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal Card */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl mx-auto px-8 py-10 flex flex-col items-center text-center overflow-hidden">
            {/* Decorative top-right blob */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-50 rounded-full opacity-60 pointer-events-none" />

            {/* Check icon */}
            <div className="w-14 h-14 bg-[#D93E39] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-200 z-10">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Thank You!</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Thank you for your submission. We review all dealer registrations
              manually. If approved, you may begin receiving opportunities that
              match your buying preferences.
            </p>

            {/* What happens next */}
            <div className="w-full bg-gray-50 rounded-2xl px-5 py-4 mb-7 text-left">
              <p className="text-xs font-semibold text-[#D93E39] mb-3">What happens next?</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Identity &amp; dealer license verification by our compliance team.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Confirmation email will be sent to your primary contact.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h8" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Access to the bidding dashboard within 24–48 business hours.
                  </p>
                </li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <a
                href="/"
                className="flex-1 bg-[#D93E39] text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Return to Homepage
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border cursor-pointer border-gray-200 hover:border-gray-300 text-gray-700 text-sm font-semibold px-5 py-3 rounded-xl transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-md w-full max-w-2xl px-6 py-8 sm:px-10 sm:py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Dealer Registration
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Complete the form below to tell us what you actively buy. Approved
            dealers may receive vehicle opportunities that match their criteria.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* Row 1: Dealership Name + Contact Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Dealership Name
              </label>
              <input
                {...register("dealershipName", { required: "Required" })}
                placeholder="e.g. Prestige Motors"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition ${errors.dealershipName ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                  }`}
              />
              {errors.dealershipName && (
                <p className="text-xs text-[#D93E39] mt-1">{errors.dealershipName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Contact Name
              </label>
              <input
                {...register("contactName", { required: "Required" })}
                placeholder="John Doe"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition ${errors.contactName ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                  }`}
              />
              {errors.contactName && (
                <p className="text-xs text-[#D93E39] mt-1">{errors.contactName.message}</p>
              )}
            </div>
          </div>

          {/* Row 2: Phone + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Phone Number
              </label>
              <input
                {...register("phoneNumber", {
                  required: "Required",
                  pattern: { value: /^[\d\s\-().+]+$/, message: "Invalid phone" },
                })}
                placeholder="(555) 000-0000"
                type="tel"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition ${errors.phoneNumber ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                  }`}
              />
              {errors.phoneNumber && (
                <p className="text-xs text-[#D93E39] mt-1">{errors.phoneNumber.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Email Address
              </label>
              <input
                {...register("emailAddress", {
                  required: "Required",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
                })}
                placeholder="john@dealership.com"
                type="email"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition ${errors.emailAddress ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                  }`}
              />
              {errors.emailAddress && (
                <p className="text-xs text-[#D93E39] mt-1">{errors.emailAddress.message}</p>
              )}
            </div>
          </div>

          {/* Row 3: City + State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
              <input
                {...register("city", { required: "Required" })}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition ${errors.city ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                  }`}
              />
              {errors.city && (
                <p className="text-xs text-[#D93E39] mt-1">{errors.city.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">State</label>
              <input
                {...register("state", { required: "Required" })}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition ${errors.state ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                  }`}
              />
              {errors.state && (
                <p className="text-xs text-[#D93E39] mt-1">{errors.state.message}</p>
              )}
            </div>
          </div>

          {/* Row 4: License + Website */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                License Number
              </label>
              <input
                {...register("licenseNumber", { required: "Required" })}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition ${errors.licenseNumber ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                  }`}
              />
              {errors.licenseNumber && (
                <p className="text-xs text-[#D93E39] mt-1">{errors.licenseNumber.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Website URL
              </label>
              <input
                {...register("websiteUrl")}
                placeholder="https://"
                type="url"
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              />
            </div>
          </div>

          {/* Best Contact Method */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Best Contact Method
            </label>
            <div className="flex flex-wrap gap-4">
              {(["phone", "text", "email"] as ContactMethod[]).map((method) => (
                <label key={method} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value={method}
                    {...register("bestContactMethod")}
                    className="w-4 h-4 accent-[#D93E39]"
                  />
                  <span className="text-sm text-gray-700 capitalize">{method}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Vehicle Categories */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Vehicle Categories Interested In
            </label>
            <Controller
              name="vehicleCategories"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2.5 gap-x-4">
                  {categoriesLoading ? (
                    <span className="text-sm text-gray-500">Loading categories...</span>
                  ) : vehicleCategories.length === 0 ? (
                    <span className="text-sm text-gray-500">No categories available</span>
                  ) : (
                    vehicleCategories.map((category) => (
                      <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          value={category.id}
                          checked={field.value.includes(category.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...field.value, category.id]);
                            } else {
                              field.onChange(field.value.filter((v) => v !== category.id));
                            }
                          }}
                          className="w-4 h-4 accent-[#D93E39] rounded"
                        />
                        <span className="text-sm text-gray-700">{category.category_name}</span>
                      </label>
                    ))
                  )}
                </div>
              )}
            />
          </div>

          {/* Row 5: Price Range + Mileage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Price Range
              </label>
              <select
                {...register("priceRange")}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 transition appearance-none cursor-pointer"
                disabled={priceRangesLoading}
              >
                {priceRangesLoading ? (
                  <option value="">Loading...</option>
                ) : priceRanges.length === 0 ? (
                  <option value="">No options available</option>
                ) : (
                  priceRanges.map((range) => (
                    <option key={range.id} value={range.id}>
                      {formatPriceRange(range)}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Mileage Preference
              </label>
              <select
                {...register("mileagePreference")}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 transition appearance-none cursor-pointer"
                disabled={mileagePreferencesLoading}
              >
                {mileagePreferencesLoading ? (
                  <option value="">Loading...</option>
                ) : mileagePreferences.length === 0 ? (
                  <option value="">No options available</option>
                ) : (
                  mileagePreferences.map((pref) => (
                    <option key={pref.id} value={pref.id}>
                      {pref.mileage} miles
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Row 6: Title Tolerance + Buying Volume */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Title Tolerance
              </label>
              <select
                {...register("titleTolerance")}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 transition appearance-none cursor-pointer"
              >
                {titleToleranceOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Buying Volume
              </label>
              <select
                {...register("buyingVolume")}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 transition appearance-none cursor-pointer"
                disabled={buyingVolumesLoading}
              >
                {buyingVolumesLoading ? (
                  <option value="">Loading...</option>
                ) : buyingVolumes.length === 0 ? (
                  <option value="">No options available</option>
                ) : (
                  buyingVolumes.map((volume) => (
                    <option key={volume.id} value={volume.id}>
                      {formatBuyingVolume(volume)}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Additional Notes
            </label>
            <textarea
              {...register("additionalNotes")}
              rows={4}
              placeholder="Tell us more about your specific needs..."
              className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition resize-none"
            />
          </div>

          {/* Submit Error */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-sm text-[#D93E39]">{submitError}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#D93E39] cursor-pointer disabled:bg-red-400 text-white font-semibold py-3 rounded-xl text-sm tracking-wide transition-colors duration-200 flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Submitting...
              </>
            ) : (
              "Apply for Access"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}