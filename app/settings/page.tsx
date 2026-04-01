import MainLayout from "@/components/layout/MainLayout";
import SettingsClient from "@/components/settings/SettingsClient";

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="flex justify-center">
        <div className="w-full max-w-7xl mt-5">
          <SettingsClient />
        </div>
      </div>
    </MainLayout>
  );
}