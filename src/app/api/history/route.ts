import { NextResponse } from "next/server";
import { PhoneHistory } from "@/lib/model";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { phone_id, employee_id, assigned_at } = body;

    if (!phone_id || !employee_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newHistory = await PhoneHistory.create({
      phone_id,
      employee_id,
      assigned_at: assigned_at || new Date(),
    });

    return NextResponse.json(newHistory, { status: 201 });
  } catch (err) {
    console.error("History POST error:", err);
    return NextResponse.json(
      { error: "Failed to save history" },
      { status: 500 }
    );
  }
}