// "use client";

// import { useEffect, useState } from "react";
// import { Info } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
// import { useFormContext } from "@/components/FormContext";

// interface Condition {
//   id: number;
//   condition: string;
//   describtion: string;
// }

// export function Step3() {
//   const { formData, updateFormData, goNext, goBack } = useFormContext();
//   const [conditions, setConditions] = useState<Condition[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const baseUrl =
//       process.env.NEXT_PUBLIC_API_URL ||
//       "https://jameshughes.thenightowl.team/api";

//     fetch(`${baseUrl}/condition/data/get`)
//       .then((res) => res.json())
//       .then((json) => {
//         if (json.status) setConditions(json.data);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <Card className="max-w-7xl mx-auto animate-fade-slide-in">
//       <CardHeader>
//         <CardTitle>What&apos;s the current condition?</CardTitle>
//         <CardDescription>Be honest—it helps us give you the best offer possible.</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="flex flex-col gap-2.5 mb-4">
//           {loading ? (
//             Array.from({ length: 4 }).map((_, i) => (
//               <div key={i} className="h-16 rounded-lg border-[1.5px] border-border bg-muted animate-pulse" />
//             ))
//           ) : (
//             conditions.map((cond) => {
//               const selected = formData.condition_id === cond.id;
//               return (
//                 <button
//                   key={cond.id}
//                   type="button"
//                   onClick={() => {
//                     console.log("✅ Selected condition:", cond.condition, "| ID:", cond.id);
//                     updateFormData({
//                       condition:    cond.condition,
//                       condition_id: cond.id,
//                     });
//                   }}
//                   className={cn(
//                     "relative text-left rounded-lg border-[1.5px] px-4 py-4 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
//                     selected
//                       ? "border-[#D93E39] cursor-pointer bg-[#FFF0F1]"
//                       : "border-border bg-white hover:border-slate-300 cursor-pointer hover:bg-slate-50"
//                   )}
//                 >
//                   {selected && (
//                     <span className="absolute top-1/2 right-3.5 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-[#D93E39] text-white text-[10px] font-bold">
//                       ✓
//                     </span>
//                   )}
//                   <p className="text-[13.5px] font-semibold text-foreground mb-0.5 pr-8">
//                     {cond.condition}
//                   </p>
//                   <p className="text-[12px] text-muted-foreground">{cond.describtion}</p>
//                 </button>
//               );
//             })
//           )}
//         </div>

//         <div className="flex items-start gap-2.5 rounded-lg bg-muted px-4 py-3 mb-7">
//           <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
//           <p className="text-[12.5px] text-muted-foreground leading-relaxed">
//             Even non-running vehicles can have value. We buy in all conditions.
//           </p>
//         </div>

//         <div className="flex gap-3">
//           <Button
//             variant="outline"
//             className="flex-1 border-[#D93E39] hover:bg-[#FFF0F1] text-[#D93E39] cursor-pointer"
//             onClick={goBack}
//           >
//             Back
//           </Button>
//           <Button
//             className="flex-1 bg-[#D93E39] cursor-pointer text-white"
//             onClick={goNext}
//             disabled={!formData.condition_id}
//           >
//             Continue
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useFormContext } from "@/components/FormContext";

interface Condition {
  id: number;
  condition: string;
  describtion: string;
}

export function Step3() {
  const { formData, updateFormData, goNext, goBack } = useFormContext();
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://backend.vintocash.com/api";

    fetch(`${baseUrl}/condition/data/get`)
      .then((res) => res.json())
      .then((json) => {
        if (json.status) setConditions(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="max-w-7xl mx-auto animate-fade-slide-in">
      <CardHeader>
        <CardTitle>What&apos;s the current condition?</CardTitle>
        <CardDescription>Be honest—it helps us give you the best offer possible.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2.5 mb-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-lg border-[1.5px] border-border bg-muted animate-pulse" />
            ))
          ) : (
            conditions.map((cond) => {
              const selected = formData.condition_id === cond.id;
              return (
                <button
                  key={cond.id}
                  type="button"
                  onClick={() =>
                    updateFormData({
                      condition:    cond.condition,
                      condition_id: cond.id,
                    })
                  }
                  className={cn(
                    "relative text-left rounded-lg border-[1.5px] px-4 py-4 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                    selected
                      ? "border-[#D93E39] cursor-pointer bg-[#FFF0F1]"
                      : "border-border bg-white hover:border-slate-300 cursor-pointer hover:bg-slate-50"
                  )}
                >
                  {selected && (
                    <span className="absolute top-1/2 right-3.5 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-[#D93E39] text-white text-[10px] font-bold">
                      ✓
                    </span>
                  )}
                  <p className="text-[13.5px] font-semibold text-foreground mb-0.5 pr-8">
                    {cond.condition}
                  </p>
                  <p className="text-[12px] text-muted-foreground">{cond.describtion}</p>
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-start gap-2.5 rounded-lg bg-muted px-4 py-3 mb-7">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-[12.5px] text-muted-foreground leading-relaxed">
            Even non-running vehicles can have value. We buy in all conditions.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-[#D93E39] hover:bg-[#FFF0F1] text-[#D93E39] cursor-pointer"
            onClick={goBack}
          >
            Back
          </Button>
          <Button
            className="flex-1 bg-[#D93E39] cursor-pointer text-white"
            onClick={goNext}
            disabled={!formData.condition_id}
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}