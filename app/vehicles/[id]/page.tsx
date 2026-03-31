"use client";

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import VehicleDetailClient from "@/components/vehicles/VehicleDetailClient";
import MainLayout from "@/components/layout/MainLayout";
import { useAuthStore } from "@/store/useAuthStore";
import type { Vehicle } from "@/types";

type ApiVehicleDetail = {
  id: number;
  name: string;
  price: string;
  category: string | null;
  mileage: number;
  mileage_text: string;
  max_bid_amount: number | null;
  description: string;
  condition: string;
  location: string;
  status: string;
  images: string[];
  features: Array<{ name: string }>;
  specifications: {
    year: number;
    make: string;
    model: string;
    trim: string;
    fuel_type: string;
    transmission: string;
    drivetrain: string;
    color: string;
  };
};

type ApiResponse = {
  status: boolean;
  message: string;
  data: ApiVehicleDetail;
};

export default function VehicleDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = useAuthStore((state) => state.token);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL_DEAL ||
    "https://secondbackend.vintocash.com/api";

  useEffect(() => {
    if (token && id) {
      fetchVehicleDetail();
    }
  }, [token, id]);

  const fetchVehicleDetail = async () => {
    setLoading(true);
    setError("");

    try {
      const vehicleUrl = `${API_BASE_URL}/vehicle/data/details/${id}`;
      console.log("📍 Fetching vehicle details from:", vehicleUrl);

      const response = await fetch(vehicleUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("🔗 Response Status:", response.status, response.statusText);

      let result: ApiResponse;
      try {
        result = await response.json();
      } catch (parseErr) {
        console.error("❌ Failed to parse JSON:", parseErr);
        setError("Server returned invalid response.");
        setLoading(false);
        return;
      }

      console.log("📦 API Response:", result);

      if (!result.status) {
        const errorMsg = result?.message || "Failed to fetch vehicle details.";
        console.error("❌ Fetch vehicle details failed:", errorMsg);
        setError(errorMsg);
        setLoading(false);
        return;
      }

      const v = result.data;

      // Images are already strings in this API response
      const imageUrls = Array.isArray(v.images) ? v.images : [];

      // Extract feature names
      const features = v.features?.map((f) => f.name) || [];

      // Transform to Vehicle type
      // const transformedVehicle: Vehicle = {
      //   id: v.id.toString(),
      //   name: v.name,
      //   price: parseFloat(v.price),
      //   mileage: v.mileage || parseInt(v.mileage_text || "0"),
      //   condition: v.condition as Vehicle["condition"],
      //   location: v.location,
      //   image: imageUrls.length > 0 ? imageUrls[0] : "/images/placeholder-car.jpg",
      //   images: imageUrls,
      //   description: v.description,
      //   features: features,
      //   specs: {
      //     year: v.specifications.year.toString(),
      //     make: v.specifications.make,
      //     model: v.specifications.model,
      //     trim: v.specifications.trim,
      //     fuelType: v.specifications.fuel_type,
      //     transmission: v.specifications.transmission,
      //     drivetrain: v.specifications.drivetrain,
      //     exteriorColor: v.specifications.color,
      //   },
      //   estimatedValue: parseFloat(v.price),
      //   currentHighBid: v.max_bid_amount || 0,
      // };

      const transformedVehicle: Vehicle = {
        id: v.id.toString(),
        name: v.name || "",
        price: parseFloat(v.price || "0"),
        mileage: v.mileage || parseInt(v.mileage_text || "0"),
        condition: (v.condition || "Good") as Vehicle["condition"],
        location: v.location || "",
        image: imageUrls.length > 0 ? imageUrls[0] : "/images/placeholder-car.jpg",
        images: imageUrls,
        description: v.description || "",
        features: features,
        specs: {
          year: (v.specifications?.year || "").toString(),
          make: v.specifications?.make || "",
          model: v.specifications?.model || "",
          trim: v.specifications?.trim || "",
          fuelType: v.specifications?.fuel_type || "",
          transmission: v.specifications?.transmission || "",
          drivetrain: v.specifications?.drivetrain || "",
          exteriorColor: v.specifications?.color || "",
        },
        estimatedValue: parseFloat(v.price || "0"),
        currentHighBid: v.max_bid_amount || 0,
      };

      setVehicle(transformedVehicle);
      setLoading(false);
    } catch (err) {
      console.error("❌ Network/Catch error:", err);
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[#D93E39] rounded-full animate-spin"></div>
          <p className="text-gray-500 mt-3">Loading vehicle details...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-red-500 bg-red-50 px-4 py-3 rounded-xl inline-block">
            {error}
          </p>
        </div>
      </MainLayout>
    );
  }

  if (!vehicle) {
    return notFound();
  }

  return (
    <MainLayout>
      <VehicleDetailClient vehicle={vehicle} />
    </MainLayout>
  );
}