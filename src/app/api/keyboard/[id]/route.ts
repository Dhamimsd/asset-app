import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { Keyboard, Employee } from "@/lib/model";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await req.json();
    const keyboardId = params.id;
    const { assigned_to } = body;

    /* ---------------- 1️⃣ Get existing keyboard ---------------- */
    const oldKeyboard = await Keyboard.findById(keyboardId);
    if (!oldKeyboard) {
      return NextResponse.json({ error: "Keyboard not found" }, { status: 404 });
    }

    /* ---------------- 2️⃣ Remove from old employee (if changed) ---------------- */
    if (
      oldKeyboard.assigned_to &&
      oldKeyboard.assigned_to !== assigned_to
    ) {
      await Employee.findByIdAndUpdate(oldKeyboard.assigned_to, {
        $unset: { keyboard_id: "" },
        $set: { keyboard_status: "STORE" },
      });
    }

    /* ---------------- 3️⃣ Update keyboard ---------------- */
    const updatedKeyboard = await Keyboard.findByIdAndUpdate(
      keyboardId,
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
            keyboard_id: keyboardId,
            keyboard_status: "USED",
          },
        },
        { new: true }
      );
    }

    return NextResponse.json(updatedKeyboard, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/keyboard/[id] error:", error);
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

    const keyboard = await Keyboard.findById(params.id);
    if (!keyboard) {
      return NextResponse.json({ error: "Keyboard not found" }, { status: 404 });
    }

    // Cleanup employee if assigned
    if (keyboard.assigned_to) {
      await Employee.findByIdAndUpdate(keyboard.assigned_to, {
        $unset: { keyboard_id: "" },
        $set: { keyboard_status: "STORE" },
      });
    }

    await Keyboard.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/keyboard/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
