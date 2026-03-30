import MainLayout from "@/components/layout/MainLayout";
import PreferencesClient from "@/components/preferences/PreferencesClient";


const preferencesPage = () => {
    return (
        <MainLayout>
            <PreferencesClient />
        </MainLayout>
    );
};

export default preferencesPage;