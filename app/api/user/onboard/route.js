import { NextResponse } from "next/server";
import { updateUser } from "@/actions/user";

export async function POST(request) {
  try {
    const body = await request.json();
    
    const result = await updateUser(body);
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Onboarding API error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
