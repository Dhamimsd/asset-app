import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { Monitor, Employee } from "@/lib/model";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await req.json();
    const monitorId = params.id;
    const { assigned_to } = body;

    /* ---------------- 1️⃣ Get existing monitor ---------------- */
    const oldMonitor = await Monitor.findById(monitorId);
    if (!oldMonitor) {
      return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
    }

    /* ---------------- 2️⃣ Remove from old employee (if changed) ---------------- */
    if (
      oldMonitor.assigned_to &&
      oldMonitor.assigned_to !== assigned_to
    ) {
      await Employee.findByIdAndUpdate(oldMonitor.assigned_to, {
        $unset: { monitor_id: "" },
        $set: { monitor_status: "STORE" },
      });
    }

    /* ---------------- 3️⃣ Update monitor ---------------- */
    const updatedMonitor = await Monitor.findByIdAndUpdate(
      monitorId,
      {
        $set: {
          brand: body.brand,
          serial_no: body.serial_no,
          assigned_to: assigned_to || null,
          status: assigned_to ? "USED" : "STORE",
        },
      },
      { new: true, runValidators: true }
    );

    /* ---------------- 4️⃣ Assign to new employee ---------------- */
    if (assigned_to) {
      await Employee.findByIdAndUpdate(
        assigned_to,
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

/* ---------------- DELETE ---------------- */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const monitor = await Monitor.findById(params.id);
    if (!monitor) {
      return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
    }

    // Cleanup employee if assigned
    if (monitor.assigned_to) {
      await Employee.findByIdAndUpdate(monitor.assigned_to, {
        $unset: { monitor_id: "" },
        $set: { monitor_status: "STORE" },
      });
    }

    await Monitor.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/monitor/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
