import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { Pc, Employee } from "@/lib/model";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await req.json();
    const pcId = params.id;
    const { assigned_to } = body;

    /* ---------------- 1️⃣ Get existing pc ---------------- */
    const oldPc = await Pc.findById(pcId);
    if (!oldPc) {
      return NextResponse.json({ error: "Pc not found" }, { status: 404 });
    }

    /* ---------------- 2️⃣ Remove from old employee (if changed) ---------------- */
    if (
      oldPc.assigned_to &&
      oldPc.assigned_to !== assigned_to
    ) {
      await Employee.findByIdAndUpdate(oldPc.assigned_to, {
        $unset: { pc_id: "" },
        $set: { pc_status: "STORE" },
      });
    }

    /* ---------------- 3️⃣ Update pc ---------------- */
    const updatedPc = await Pc.findByIdAndUpdate(
      pcId,
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
            pc_id: pcId,
            pc_status: "USED",
          },
        },
        { new: true }
      );
    }

    return NextResponse.json(updatedPc, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/pc/[id] error:", error);
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

    const pc = await Pc.findById(params.id);
    if (!pc) {
      return NextResponse.json({ error: "Pc not found" }, { status: 404 });
    }

    // Cleanup employee if assigned
    if (pc.assigned_to) {
      await Employee.findByIdAndUpdate(pc.assigned_to, {
        $unset: { pc_id: "" },
        $set: { pc_status: "STORE" },
      });
    }

    await Pc.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/pc/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
