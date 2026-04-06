"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import VehicleFilters from "@/components/vehicles/VehicleFilters";
import Pagination from "@/components/vehicles/Pagination";
import { useAuthStore } from "@/store/useAuthStore";
import type { Vehicle } from "@/types";
import VehicleCard from "@/components/dashboard/VehicleCard";

type ApiVehicle = {
  id: number;
  name: string;
  price: string;
  category: string | null;
  mileage: string | null;
  year: number;
  max_bid_amount: number;
  make: string;
  model: string;
  trim: string;
  fuel_type: string;
  transmission: string;
  drivetrain: string;
  color: string;
  description: string;
  condition: string;
  location: string;
  images: Array<{ id: number; url: string }> | [];
};

type ApiResponse = {
  status: boolean;
  message: string;
  data: ApiVehicle[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
};

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = useAuthStore((state) => state.token);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://backend.vintocash.com/api";

  // useEffect(() => {
  //   // Wait for token to load from localStorage
  //   if (token !== null) {
  //     fetchVehicles(currentPage);
  //   }
  // }, [currentPage, token]);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Zustand persist hydration
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    // Already hydrated
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (token) {
      fetchVehicles(currentPage);
    } else {
      setLoading(false);
    }
  }, [currentPage, token, hydrated]);

  const fetchVehicles = async (page: number = 1) => {
    // if (!token) {
    //   setLoading(false);
    //   return;
    // }

    // setLoading(true);
    // setError("");
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(""); //

    try {
      const vehicleUrl = `${API_BASE_URL}/vehicle/data/index`;
      console.log("📍 Fetching vehicles from:", vehicleUrl);

      const response = await fetch(vehicleUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          page: page,
          per_page: 6,
          status: "active",
          // Try without filters first
        }),
      });

      console.log("🔗 Response Status:", response);

      let result: ApiResponse;
      try {
        result = await response.json();
      } catch (parseErr) {
        console.error("❌ Failed to parse JSON:", parseErr);
        setError("Server returned invalid response.");
        setLoading(false);
        return;
      }

      console.log("📦 API Response:", result.data);
      console.log("📊 Total:", result.pagination?.total);
      console.log("📊 Last page:", result.pagination?.last_page);
      console.log("📊 Total vehicles in response:", result.data?.length);

      if (!result.status) {
        const errorMsg = result?.message || "Failed to fetch vehicles.";
        console.error("❌ Fetch vehicles failed:", errorMsg);
        setError(errorMsg);
        setLoading(false);
        return;
      }

      // Transform API data to match Vehicle type
      const transformedVehicles: Vehicle[] = result.data.map((v) => {
        console.log("🚗 Processing vehicle:", v.id, v.name, "Images:", v.images);

        // Extract image URLs from array of objects
        const imageUrls = Array.isArray(v.images)
          ? v.images.map(img => typeof img === 'string' ? img : img.url)
          : [];

        // return {
        //   id: v.id.toString(),
        //   name: v.name,
        //   price: parseFloat(v.price),
        //   mileage: parseInt(v.mileage || "0"),
        //   condition: v.condition as Vehicle["condition"],
        //   location: v.location,
        //   image: imageUrls.length > 0 ? imageUrls[0] : "/images/placeholder-car.jpg",
        //   images: imageUrls,
        //   description: v.description,
        //   specs: {
        //     year: v.year.toString(),
        //     make: v.make,
        //     model: v.model,
        //     trim: v.trim,
        //     fuelType: v.fuel_type,
        //     transmission: v.transmission,
        //     drivetrain: v.drivetrain,
        //     exteriorColor: v.color,
        //   },
        //   estimatedValue: parseFloat(v.price),
        //   currentHighBid: v.max_bid_amount,
        // };

        return {
          id: v.id.toString(),
          name: v.name || "",
          price: parseFloat(v.price || "0"),
          mileage: parseInt(v.mileage || "0"),
          condition: (v.condition || "Good") as Vehicle["condition"],
          location: v.location || "",
          image: imageUrls.length > 0 ? imageUrls[0] : "/images/placeholder-car.jpg",
          images: imageUrls,
          description: v.description || "",
          specs: {
            year: (v.year || "").toString(),
            make: v.make || "",
            model: v.model || "",
            trim: v.trim || "",
            fuelType: v.fuel_type || "",
            transmission: v.transmission || "",
            drivetrain: v.drivetrain || "",
            exteriorColor: v.color || "",
          },
          estimatedValue: parseFloat(v.price || "0"),
          currentHighBid: v.max_bid_amount || 0,
        };
      });

      console.log("✅ Transformed vehicles:", transformedVehicles.length, transformedVehicles);
      setVehicles(transformedVehicles);
      setTotalPages(result.pagination.last_page);
      setLoading(false);
    } catch (err) {
      console.error("❌ Network/Catch error:", err);
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="mt-6">
        <VehicleFilters />
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[#D93E39] rounded-full animate-spin"></div>
          <p className="text-gray-500 mt-3">Loading vehicles...</p>
        </div>
      )}

      {!token && !loading && (
        <div className="text-center py-12">
          <p className="text-red-500 bg-red-50 px-4 py-3 rounded-xl inline-block">
            Please login to view vehicles.
          </p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-500 bg-red-50 px-4 py-3 rounded-xl inline-block">
            {error}
          </p>
        </div>
      )}

      {!loading && !error && token && vehicles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No vehicles found.</p>
        </div>
      )}

      {!loading && !error && token && vehicles.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} showPlaceBid={true} />
            ))}
          </div>
          <Pagination
            total={totalPages}
            current={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </MainLayout>
  );
};

export default VehiclesPage;