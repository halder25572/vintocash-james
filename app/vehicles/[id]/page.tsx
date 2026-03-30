import { notFound } from "next/navigation";
import { vehicles, allVehicles } from "@/lib/data";
import VehicleDetailClient from "@/components/vehicles/VehicleDetailClient";
import MainLayout from "@/components/layout/MainLayout";

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const allData = [...vehicles, ...allVehicles];
  const unique = allData.filter(
    (v, index, self) => self.findIndex((x) => x.id === v.id) === index
  );

  const vehicle = unique.find((v) => v.id === id) ?? null;
  if (!vehicle) return notFound();

  return (
    <MainLayout>
      <VehicleDetailClient vehicle={vehicle} />
    </MainLayout>
  );
}