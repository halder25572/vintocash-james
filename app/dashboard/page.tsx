import MainLayout from "@/components/layout/MainLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import VehicleCard from "@/components/dashboard/VehicleCard";
import { vehicles } from "@/lib/data";

const dashboardStats = [
  {
    id: "1",
    title: "New Vehicles",
    value: 24,
    icon2: "/icons/trend.svg",
    badge: "+12%",
    badgeColor: "text-green-500",
    icon: "/icons/car.svg",
  },
  {
    id: "2",
    title: "On Progress Bids",
    value: 7,
    icon2: "/icons/live.svg",
    badge: "Live",
    badgeColor: "text-[#00D492]",
    icon: "/icons/hammer.svg",
  },
  {
    id: "3",
    title: "Won Bids",
    value: 3,
    icon2: "/icons/plus.svg",
    badge: "2 New",
    badgeColor: "text-[#00D492]",
    icon: "/icons/bookmark.svg",
  },
  {
    id: "4",
    title: "Los Bids",
    value: 5,
    icon2: "/icons/Closed.svg",
    badge: "Closed",
    badgeColor: "text-gray-400",
    icon: "/icons/pur.svg",
  },
];

export default function DashboardPage() {
  return (
    <MainLayout>
      {/* Welcome */}
      <div className="mb-5">
        <h1 className="text-lg font-bold text-gray-900">Welcome, Daniel</h1>
        <p className="text-sm text-gray-400">
          Monitoring real-time auction data and high-torque opportunities.
        </p>
      </div>

      {/* Stats */}
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
          <h2 className="text-sm font-bold text-gray-800">Recent Opportunities</h2>
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

      {/* Bottom */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentActivity items={activities} />
        <MessagesPanel />
      </div> */}
    </MainLayout>
  );
}