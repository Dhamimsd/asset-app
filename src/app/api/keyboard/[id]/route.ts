import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { Keyboard, Employee } from "@/lib/model";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const body = await req.json();
    const keyboardId = params.id;

    // Validate status if provided
    if (body.status && !["STORE", "USED", "REPAIR"].includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // 1️⃣ Update the asset (Keyboard)
    const updatedKeyboard = await Keyboard.findOneAndUpdate(
      { _id: keyboardId },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedKeyboard) {
      return NextResponse.json({ error: "Keyboard not found" }, { status: 404 });
    }

    // 2️⃣ If assigned_to is provided, update the employee
    if (body.assigned_to) {
      const employeeId = body.assigned_to;

      await Employee.findByIdAndUpdate(
        employeeId,
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

// DELETE remains unchanged
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deleted = await Keyboard.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Keyboard not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/keyboard/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
