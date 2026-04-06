"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import StatsCard from "@/components/dashboard/StatsCard";
import VehicleCard from "@/components/dashboard/VehicleCard";
import { vehicles } from "@/lib/data";
import { useChatListener } from "@/hooks/useChatListener";

type DashboardResponse = {
  success: boolean;
  message?: string;
  data?: {
    vehicles: any[];
    total_vehicles: number;
    total_bids: number;
    won_bids: number;
    onprogress_bids: number;
    lost_bids: number;
  };
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://backend.vintocash.com/api";

export default function DashboardClient() {
  const token = useAuthStore((state) => state.token);
  const authUser = useAuthStore((state) => state.user);

  const [hydrated, setHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboardData, setDashboardData] = useState<DashboardResponse["data"] | null>(null);

  const loadDashboardData = async (showLoadingState: boolean) => {
    if (!hydrated || !token) {
      return;
    }

    if (showLoadingState) {
      setIsLoading(true);
      setError("");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/dealer/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result: DashboardResponse = await response.json();

      if (!response.ok || !result.success || !result.data) {
        if (showLoadingState) {
          throw new Error(result.message || "Failed to load dashboard data.");
        }
        return;
      }

      setDashboardData(result.data);
    } catch (fetchError: unknown) {
      if (showLoadingState) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load dashboard data."
        );
      }
    } finally {
      if (showLoadingState) {
        setIsLoading(false);
      }
    }
  };

  useChatListener({
    token: hydrated ? token : null,
    channelName: "chat-conversation",
    eventName: "ChatEvent",
    enabled: hydrated && !!token,
    isPrivate: true,
    onMessage: () => {
      void loadDashboardData(false);
    },
  });

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
      setIsLoading(false);
      setError("Please login to view dashboard.");
      return;
    }

    void loadDashboardData(true);
  }, [hydrated, token]);

  const dashboardStats = dashboardData
    ? [
        {
          id: "1",
          title: "New Vehicles",
          value: dashboardData.total_vehicles,
          icon2: "/icons/trend.svg",
          badge: "+12%",
          badgeColor: "text-green-500",
          icon: "/icons/car.svg",
        },
        {
          id: "2",
          title: "On Progress Bids",
          value: dashboardData.onprogress_bids,
          icon2: "/icons/live.svg",
          badge: "Live",
          badgeColor: "text-[#00D492]",
          icon: "/icons/hammer.svg",
        },
        {
          id: "3",
          title: "Won Bids",
          value: dashboardData.won_bids,
          icon2: "/icons/plus.svg",
          badge: "2 New",
          badgeColor: "text-[#00D492]",
          icon: "/icons/bookmark.svg",
        },
        {
          id: "4",
          title: "Lost Bids",
          value: dashboardData.lost_bids,
          icon2: "/icons/Closed.svg",
          badge: "Closed",
          badgeColor: "text-gray-400",
          icon: "/icons/pur.svg",
        },
      ]
    : [];

  return (
    <div>
      {/* Welcome */}
      <div className="mb-5">
        <h1 className="text-lg font-bold text-gray-900">
          Welcome, {authUser?.name || "Dealer"}
        </h1>
        <p className="text-sm text-gray-400">
          Monitoring real-time auction data and high-torque opportunities.
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
          Loading dashboard...
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {dashboardStats.map((s) => (
              <StatsCard
                key={s.id}
                title={s.title}
                value={s.value}
                badge={s.badge}
                badgeColor={s.badgeColor}
                icon={s.icon}
                icon2={s.icon2}
              />
            ))}
          </div>

          {/* Recent Opportunities */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-800">
                Recent Opportunities
              </h2>
              <button className="text-[16px] cursor-pointer font-bold text-gray-400 hover:text-red-500 transition-colors">
                see All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map((v) => (
                <VehicleCard
                  key={v.id}
                  vehicle={v}
                  showViewDetails={true}
                  showPlaceBid={true}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
