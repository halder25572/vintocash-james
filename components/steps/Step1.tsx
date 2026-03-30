"use client";

import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useFormContext } from "@/components/FormContext";
import { ReactNode, useEffect, useState } from "react";

// types
interface AssetProperty {
  id: number;
  asset_id: number;
  property_name: string;
}

interface Asset {
  desc: ReactNode;
  label: string;
  id: number;
  assetType: string;
  description: string;
  image: string;
  property: AssetProperty[];
}

interface Condition {
  id: number;
  condition: string;
  describtion: string;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://backend.vintocash.com/api";

export function Step1() {
  const { formData, updateFormData, goNext } = useFormContext();

  // ✅ MUST be inside component
  const [assets, setAssets] = useState<Asset[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [assetRes, conditionRes] = await Promise.all([
          fetch(`${BASE_URL}/asset/data/get`),
          fetch(`${BASE_URL}/condition/data/get`),
        ]);

        const [assetJson, conditionJson] = await Promise.all([
          assetRes.json(),
          conditionRes.json(),
        ]);

        if (assetJson?.status && Array.isArray(assetJson.data)) {
          setAssets(assetJson.data);
        }

        if (conditionJson?.status && Array.isArray(conditionJson.data)) {
          setConditions(conditionJson.data);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <Card className="max-w-7xl mx-auto animate-fade-slide-in">
      <CardHeader>
        <CardTitle>What type of asset are you selling?</CardTitle>
        <CardDescription>
          Select the category that best describes your vehicle or asset.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {loading ? (
            <p className="col-span-2 text-center text-sm text-muted-foreground">
              Loading...
            </p>
          ) : (
            assets.map((type) => {
              const selected =
                formData.assetType === type.assetType;

              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() =>
                    updateFormData({
                      assetType: type.assetType,
                      asset_id: type.id, // ✅ fixed
                    })
                  }
                  className={cn(
                    "relative text-left cursor-pointer rounded-lg border-[1.5px] px-4 py-4 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                    selected
                      ? "border-[#D93E39] bg-[#FFF0F1]"
                      : "border-border bg-white hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  {selected && (
                    <span className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#D93E39] text-white text-[10px] font-bold">
                      ✓
                    </span>
                  )}

                  <p className="text-[13.5px] font-semibold text-foreground mb-0.5">
                    {type.assetType}
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    {type.description}
                  </p>
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-start gap-2.5 rounded-lg bg-muted px-4 py-3 mb-7">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-[12.5px] text-muted-foreground leading-relaxed">
            Your information is kept confidential. No obligation to proceed.
          </p>
        </div>

        <Button
          className="w-full bg-[#D93E39] cursor-pointer text-white"
          onClick={goNext}
          disabled={!formData.assetType}
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}