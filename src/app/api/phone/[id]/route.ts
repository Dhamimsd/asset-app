import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { Phone, Employee } from "@/lib/model";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await req.json();
    const phoneId = params.id;
    const { assigned_to } = body;

    /* ---------------- 1️⃣ Get existing phone ---------------- */
    const oldPhone = await Phone.findById(phoneId);
    if (!oldPhone) {
      return NextResponse.json({ error: "Phone not found" }, { status: 404 });
    }

    /* ---------------- 2️⃣ Remove from old employee (if changed) ---------------- */
    if (
      oldPhone.assigned_to &&
      oldPhone.assigned_to !== assigned_to
    ) {
      await Employee.findByIdAndUpdate(oldPhone.assigned_to, {
        $unset: { phone_id: "" },
        $set: { phone_status: "STORE" },
      });
    }

    /* ---------------- 3️⃣ Update phone ---------------- */
    const updatedPhone = await Phone.findByIdAndUpdate(
      phoneId,
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

/* ---------------- DELETE ---------------- */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const phone = await Phone.findById(params.id);
    if (!phone) {
      return NextResponse.json({ error: "Phone not found" }, { status: 404 });
    }

    // Cleanup employee if assigned
    if (phone.assigned_to) {
      await Employee.findByIdAndUpdate(phone.assigned_to, {
        $unset: { phone_id: "" },
        $set: { phone_status: "STORE" },
      });
    }

    await Phone.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/phone/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
