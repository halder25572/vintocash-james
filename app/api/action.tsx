import { Step3 } from "@/components/steps/Step3";


async function getConditions() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/condition/data/get`,  // server-side env (no NEXT_PUBLIC_)
    {
      cache: "no-store", // always fresh data
    }
  );

  if (!res.ok) return [];

  const json = await res.json();
  return json.status ? json.data : [];
}

export default async function Page() {
  return <Step3 />;
}