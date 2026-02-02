import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { Heatset, Employee } from "@/lib/model";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await req.json();
    const heatsetId = params.id;
    const { assigned_to } = body;

    /* ---------------- 1️⃣ Get existing heatset ---------------- */
    const oldHeatset = await Heatset.findById(heatsetId);
    if (!oldHeatset) {
      return NextResponse.json({ error: "Heatset not found" }, { status: 404 });
    }

    /* ---------------- 2️⃣ Remove from old employee (if changed) ---------------- */
    if (
      oldHeatset.assigned_to &&
      oldHeatset.assigned_to !== assigned_to
    ) {
      await Employee.findByIdAndUpdate(oldHeatset.assigned_to, {
        $unset: { heatset_id: "" },
        $set: { heatset_status: "STORE" },
      });
    }

    /* ---------------- 3️⃣ Update heatset ---------------- */
    const updatedHeatset = await Heatset.findByIdAndUpdate(
      heatsetId,
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
            heatset_id: heatsetId,
            heatset_status: "USED",
          },
        },
        { new: true }
      );
    }

    return NextResponse.json(updatedHeatset, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/heatset/[id] error:", error);
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

    const heatset = await Heatset.findById(params.id);
    if (!heatset) {
      return NextResponse.json({ error: "Heatset not found" }, { status: 404 });
    }

    // Cleanup employee if assigned
    if (heatset.assigned_to) {
      await Employee.findByIdAndUpdate(heatset.assigned_to, {
        $unset: { heatset_id: "" },
        $set: { heatset_status: "STORE" },
      });
    }

    await Heatset.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/heatset/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
