import MainLayout from '@/components/layout/MainLayout';
import SettingsClient from '@/components/settings/SettingsClient';
import React from 'react';

const settingsPage = () => {
    return (
        <MainLayout>
            <SettingsClient />
        </MainLayout>
    );
};

export default settingsPage;