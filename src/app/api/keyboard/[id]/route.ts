import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { Keyboard } from "@/lib/model";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { status, assigned_to } = await req.json();

    // Validate input
    if (!status || !["STORE", "USED", "REPAIR"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedKeyboard = await Keyboard.findOneAndUpdate(
      { _id: params.id },
      { status, assigned_to: assigned_to || null }, // assign employee ID or null
      { new: true, runValidators: true }
    );

    if (!updatedKeyboard) {
      return NextResponse.json({ error: "Keyboard not found" }, { status: 404 });
    }

    return NextResponse.json(updatedKeyboard, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/keyboard/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: remove keyboard by _id
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
