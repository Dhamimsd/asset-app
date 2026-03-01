import { NextResponse } from "next/server";
import { PhoneHistory, Employee } from "@/lib/model";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const phoneId = params.id?.trim();
    console.log("Fetching phone_id:", phoneId);

    if (!phoneId) {
      return NextResponse.json(
        { error: "Missing phone_id" },
        { status: 400 }
      );
    }

    // ✅ Fetch history directly from phone_history collection
    const history = await PhoneHistory.find({ phone_id: phoneId })
      .sort({ assigned_at: -1 })
      .lean();

    if (!history.length) {
      return NextResponse.json(
        { error: "No history found" },
        { status: 404 }
      );
    }

    // ✅ Fetch employees using employee_id (NOT _id)
    const employeeIds = history.map((h) => h.employee_id).filter(Boolean);

    const employees = await Employee.find({
  _id: { $in: employeeIds },
}).lean();

    // ✅ Attach employee details
    const historyWithEmployee = history.map((h) => ({
  assigned_at: h.assigned_at,
  employee:
    employees.find((e) => e._id === h.employee_id) || null,
}));

    return NextResponse.json(historyWithEmployee);
  } catch (err) {
    console.error("Error fetching phone history:", err);
    return NextResponse.json(
      { error: "Failed to fetch phone history" },
      { status: 500 }
    );
  }
}