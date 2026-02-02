// app/api/employee/available/[assetType]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { Employee } from "@/lib/model";

/**
 * GET /api/employee/available/[assetType]
 * Returns employees who do NOT already have that asset assigned
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { assetType: string } }
) {
  try {
    await connectDB();

    const { assetType } = params;

    // Map assetType to the field that stores assigned asset ID
    const assetFieldMap: Record<string, string> = {
      mouse: "mouse_id",
      keyboard: "keyboard_id",
      pc: "pc_id",
      heatset: "heatset_id",
      laptop: "laptop_id",
      phone: "phone_id",
      monitor: "monitor_id",
    };

    const field = assetFieldMap[assetType.toLowerCase()];

    if (!field) {
      return NextResponse.json({ error: "Invalid asset type" }, { status: 400 });
    }

    // Find employees where this asset ID does NOT exist (null or missing)
    const employees = await Employee.find({
      [field]: { $exists: false }, // field does not exist
      status: "ACTIVE",             // only active employees
    }).select("_id employee_name department").lean();

    return NextResponse.json(employees, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch employees" },
      { status: 500 }
    );
  }
}
