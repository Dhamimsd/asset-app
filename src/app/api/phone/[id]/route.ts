import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { Phone, Employee, PhoneHistory } from "@/lib/model";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const phoneId = params.id;

    if (!phoneId) {
      return NextResponse.json({ error: "Missing phone id" }, { status: 400 });
    }

    // Fetch phone details
    const phone = await Phone.findById(phoneId).lean();
    if (!phone) {
      return NextResponse.json({ error: "Phone not found" }, { status: 404 });
    }

    // Fetch phone assignment history and populate employee
    const historyRaw = await PhoneHistory.find({ phone_id: phoneId })
      .populate<{ employee: any }>("employee_id", "_id employee_name department")
      .lean();

    const history = historyRaw.map((h) => ({
      employee: h.employee
        ? {
            _id: h.employee._id,
            employee_name: h.employee.employee_name,
            department: h.employee.department,
          }
        : null,
      assigned_at: h.assigned_at.toISOString(),
    }));

    // Return phone with history
    return NextResponse.json({ ...phone, history }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/phone/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const phoneId = params.id;
    const body = await req.json();
    const { assigned_to } = body;

    // Get existing phone
    const oldPhone = await Phone.findById(phoneId);
    if (!oldPhone) {
      return NextResponse.json({ error: "Phone not found" }, { status: 404 });
    }

    // Remove from old employee if reassigned
    if (oldPhone.assigned_to && oldPhone.assigned_to !== assigned_to) {
      await Employee.findByIdAndUpdate(oldPhone.assigned_to, {
        $unset: { phone_id: "" },
        $set: { phone_status: "STORE" },
      });
    }

    // Update phone
    const updatedPhone = await Phone.findByIdAndUpdate(
      phoneId,
      {
        $set: {
          brand: body.brand,
          serial_no: body.serial_no,
          phone_no: body.phone_no,
          assigned_to: assigned_to || null,
          status: body.status,
        },
      },
      { new: true, runValidators: true }
    );

    // Assign to new employee
    if (assigned_to) {
      await Employee.findByIdAndUpdate(
        assigned_to,
        { $set: { phone_id: phoneId, phone_status: "USED" } },
        { new: true }
      );
    }

    return NextResponse.json(updatedPhone, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/phone/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const phoneId = params.id;

    const phone = await Phone.findById(phoneId);
    if (!phone) {
      return NextResponse.json({ error: "Phone not found" }, { status: 404 });
    }

    // Cleanup employee assignment
    if (phone.assigned_to) {
      await Employee.findByIdAndUpdate(phone.assigned_to, {
        $unset: { phone_id: "" },
        $set: { phone_status: "STORE" },
      });
    }

    await Phone.findByIdAndDelete(phoneId);

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/phone/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}