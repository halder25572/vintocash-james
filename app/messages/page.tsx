import MainLayout from "@/components/layout/MainLayout";
import MessagesClient from "@/components/messages/MessagesClient";


const messagesPage = () => {
    return (
        <MainLayout>
            <MessagesClient />
        </MainLayout>
    );
};

export default messagesPage;