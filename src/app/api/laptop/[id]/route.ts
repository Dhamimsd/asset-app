
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { Laptop } from "@/lib/model";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    // Grab everything from request body
    const body = await req.json();

    // Optional: validate status
    if (body.status && !["STORE", "USED", "REPAIR"].includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Update laptop with all fields sent in body
    const updatedLaptop = await Laptop.findOneAndUpdate(
      { _id: params.id },
      { $set: body },   // <--- important: $set updates only sent fields
      { new: true, runValidators: true }
    );

    if (!updatedLaptop) {
      return NextResponse.json({ error: "Laptop not found" }, { status: 404 });
    }

    return NextResponse.json(updatedLaptop, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/laptop/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// DELETE: remove laptop by _id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deleted = await Laptop.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ error: "Laptop not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/laptop/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
