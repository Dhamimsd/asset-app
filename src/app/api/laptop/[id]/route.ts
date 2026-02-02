import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { Laptop, Employee } from "@/lib/model";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await req.json();
    const laptopId = params.id;
    const { assigned_to } = body;

    /* ---------------- 1️⃣ Get existing laptop ---------------- */
    const oldLaptop = await Laptop.findById(laptopId);
    if (!oldLaptop) {
      return NextResponse.json({ error: "Laptop not found" }, { status: 404 });
    }

    /* ---------------- 2️⃣ Remove from old employee (if changed) ---------------- */
    if (
      oldLaptop.assigned_to &&
      oldLaptop.assigned_to !== assigned_to
    ) {
      await Employee.findByIdAndUpdate(oldLaptop.assigned_to, {
        $unset: { laptop_id: "" },
        $set: { laptop_status: "STORE" },
      });
    }

    /* ---------------- 3️⃣ Update laptop ---------------- */
    const updatedLaptop = await Laptop.findByIdAndUpdate(
      laptopId,
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
            laptop_id: laptopId,
            laptop_status: "USED",
          },
        },
        { new: true }
      );
    }

    return NextResponse.json(updatedLaptop, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/laptop/[id] error:", error);
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

    const laptop = await Laptop.findById(params.id);
    if (!laptop) {
      return NextResponse.json({ error: "Laptop not found" }, { status: 404 });
    }

    // Cleanup employee if assigned
    if (laptop.assigned_to) {
      await Employee.findByIdAndUpdate(laptop.assigned_to, {
        $unset: { laptop_id: "" },
        $set: { laptop_status: "STORE" },
      });
    }

    await Laptop.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/laptop/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
