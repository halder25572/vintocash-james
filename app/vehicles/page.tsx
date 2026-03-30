import MainLayout from "@/components/layout/MainLayout";
import VehicleCard from "@/components/dashboard/VehicleCard";
import VehicleFilters from "@/components/vehicles/VehicleFilters";
import Pagination from "@/components/vehicles/Pagination";
import { allVehicles } from "@/lib/data";

const vehiclesPage = () => {
    return (
        <MainLayout>
            <div className="mt-6">
                <VehicleFilters />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allVehicles.map((v) => (
                    <VehicleCard key={v.id} vehicle={v} />
                ))}
            </div>
            <Pagination total={12} />
        </MainLayout>
    );
};

export default vehiclesPage;