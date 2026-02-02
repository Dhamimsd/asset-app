import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { Phone, Employee } from "@/lib/model";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const body = await req.json();
    const phoneId = params.id;

    // Validate status if provided
    if (body.status && !["STORE", "USED", "REPAIR"].includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // 1️⃣ Update the asset (Phone)
    const updatedPhone = await Phone.findOneAndUpdate(
      { _id: phoneId },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedPhone) {
      return NextResponse.json({ error: "Phone not found" }, { status: 404 });
    }

    // 2️⃣ If assigned_to is provided, update the employee
    if (body.assigned_to) {
      const employeeId = body.assigned_to;

      await Employee.findByIdAndUpdate(
        employeeId,
        {
          $set: {
            phone_id: phoneId,
            phone_status: "USED",
          },
        },
        { new: true }
      );
    }

    return NextResponse.json(updatedPhone, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/phone/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE remains unchanged
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deleted = await Phone.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Phone not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/phone/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
