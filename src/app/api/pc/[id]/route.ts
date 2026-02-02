import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { Pc, Employee } from "@/lib/model";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const body = await req.json();
    const pcId = params.id;

    // Validate status if provided
    if (body.status && !["STORE", "USED", "REPAIR"].includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // 1️⃣ Update the asset (Pc)
    const updatedPc = await Pc.findOneAndUpdate(
      { _id: pcId },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedPc) {
      return NextResponse.json({ error: "Pc not found" }, { status: 404 });
    }

    // 2️⃣ If assigned_to is provided, update the employee
    if (body.assigned_to) {
      const employeeId = body.assigned_to;

      await Employee.findByIdAndUpdate(
        employeeId,
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

// DELETE remains unchanged
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deleted = await Pc.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Pc not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/pc/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
