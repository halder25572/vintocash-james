"use client";
import { useEffect, useState } from "react";

interface PrivacyData {
    id: number;
    slug: string;
    title: string;
    content: string;
    status: number;
    created_at: string;
    updated_at: string;
}

const PrivacyPolicy = () => {
    const [privacyData, setPrivacyData] = useState<PrivacyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrivacy = async () => {
            try {
                const res = await fetch(`https://backend.vintocash.com/api/privacy/policy/data`);

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const result = await res.json();
                console.log("API Response:", result);

                // সম্ভাব্য key গুলো handle করা হয়েছে
                const data =
                    result?.data?.privacy_policy ||
                    result?.data?.privacyPolicy ||
                    result?.data?.privacy ||
                    result?.data;

                setPrivacyData(data);

            } catch (err) {
                console.error("Failed to fetch privacy policy:", err);
                setError("Failed to load Privacy Policy");
            } finally {
                setLoading(false);
            }
        };

        fetchPrivacy();
    }, []);

    if (loading) {
        return (
            <section className="bg-[#F9FAFB] mt-5 py-10">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-[20px] text-[#6D717F]">Loading...</p>
                </div>
            </section>
        );
    }

    if (error || !privacyData) {
        return (
            <section className="bg-[#F9FAFB] mt-5 py-10">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-[20px] text-red-500">{error ?? "No data found"}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#F9FAFB] mt-5 py-10">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-[60px] font-bold text-center">
                    <span className="text-[#D93E39]">Privacy</span> & Policy
                </h1>

                {/* content */}
                <div className="mt-15 px-4 lg:px-0">
                    <div className="mt-5">
                        {/* <h2 className="text-[30px] font-medium">{privacyData.title}</h2> */}
                        <div
                            className="text-[20px] text-[#6D717F] mt-3"
                            dangerouslySetInnerHTML={{ __html: privacyData.content }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PrivacyPolicy;