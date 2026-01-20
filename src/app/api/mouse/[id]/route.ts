// app/api/mouse/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { Mouse } from "@/lib/model";

// PUT: update mouse by _id
// PUT: update mouse by _id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    // Grab everything from request body
    const body = await req.json();

    // Optional: validate status
    if (body.status && !["STORE", "USED", "REPAIR"].includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Update mouse with all fields sent in body
    const updatedMouse = await Mouse.findOneAndUpdate(
      { _id: params.id },
      { $set: body },   // <--- important: $set updates only sent fields
      { new: true, runValidators: true }
    );

    if (!updatedMouse) {
      return NextResponse.json({ error: "Mouse not found" }, { status: 404 });
    }

    return NextResponse.json(updatedMouse, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/mouse/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// DELETE: remove mouse by _id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deleted = await Mouse.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ error: "Mouse not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/mouse/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
