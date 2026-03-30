// hooks/useSiteData.ts
import { useEffect, useState } from "react";

interface SiteData {
  logo: string; // URL or base64 from API
  siteName?: string;
}

export const useSiteData = () => {
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        // const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/data`);
        const res = await fetch("https://backend.vintocash.com/api/web/data");
        const data = await res.json();
        setSiteData(data);
      } catch (err) {
        console.error("Failed to fetch site data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteData();
  }, []);

  return { siteData, loading };
};