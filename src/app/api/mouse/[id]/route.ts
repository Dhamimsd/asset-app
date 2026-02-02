import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { Mouse, Employee } from "@/lib/model";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await req.json();
    const mouseId = params.id;
    const { assigned_to } = body;

    /* ---------------- 1️⃣ Get existing mouse ---------------- */
    const oldMouse = await Mouse.findById(mouseId);
    if (!oldMouse) {
      return NextResponse.json({ error: "Mouse not found" }, { status: 404 });
    }

    /* ---------------- 2️⃣ Remove from old employee (if changed) ---------------- */
    if (
      oldMouse.assigned_to &&
      oldMouse.assigned_to !== assigned_to
    ) {
      await Employee.findByIdAndUpdate(oldMouse.assigned_to, {
        $unset: { mouse_id: "" },
        $set: { mouse_status: "STORE" },
      });
    }

    /* ---------------- 3️⃣ Update mouse ---------------- */
    const updatedMouse = await Mouse.findByIdAndUpdate(
      mouseId,
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
            mouse_id: mouseId,
            mouse_status: "USED",
          },
        },
        { new: true }
      );
    }

    return NextResponse.json(updatedMouse, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/mouse/[id] error:", error);
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

    const mouse = await Mouse.findById(params.id);
    if (!mouse) {
      return NextResponse.json({ error: "Mouse not found" }, { status: 404 });
    }

    // Cleanup employee if assigned
    if (mouse.assigned_to) {
      await Employee.findByIdAndUpdate(mouse.assigned_to, {
        $unset: { mouse_id: "" },
        $set: { mouse_status: "STORE" },
      });
    }

    await Mouse.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/mouse/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
