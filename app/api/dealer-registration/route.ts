import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Here you can send email / save to database if you want.
    console.log("Dealer Registration:", data);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Submission failed. Please try again." },
      { status: 500 }
    );
  }
}