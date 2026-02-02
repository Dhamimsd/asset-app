import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { Monitor, Employee } from "@/lib/model";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const body = await req.json();
    const monitorId = params.id;

    // Validate status if provided
    if (body.status && !["STORE", "USED", "REPAIR"].includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // 1️⃣ Update the asset (Monitor)
    const updatedMonitor = await Monitor.findOneAndUpdate(
      { _id: monitorId },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedMonitor) {
      return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
    }

    // 2️⃣ If assigned_to is provided, update the employee
    if (body.assigned_to) {
      const employeeId = body.assigned_to;

      await Employee.findByIdAndUpdate(
        employeeId,
        {
          $set: {
            monitor_id: monitorId,
            monitor_status: "USED",
          },
        },
        { new: true }
      );
    }

    return NextResponse.json(updatedMonitor, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/monitor/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE remains unchanged
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deleted = await Monitor.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/monitor/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
