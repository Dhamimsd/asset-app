import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { Mouse, Employee } from "@/lib/model";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const body = await req.json();
    const mouseId = params.id;

    // Validate status if provided
    if (body.status && !["STORE", "USED", "REPAIR"].includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // 1️⃣ Update the asset (Mouse)
    const updatedMouse = await Mouse.findOneAndUpdate(
      { _id: mouseId },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedMouse) {
      return NextResponse.json({ error: "Mouse not found" }, { status: 404 });
    }

    // 2️⃣ If assigned_to is provided, update the employee
    if (body.assigned_to) {
      const employeeId = body.assigned_to;

      await Employee.findByIdAndUpdate(
        employeeId,
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

// DELETE remains unchanged
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
