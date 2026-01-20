// app/api/employee/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { Employee, Mouse, Keyboard, Pc, Heatset, Laptop, Phone } from "@/lib/model";
import mongoose from "mongoose";

// ---------------- Counter for Employee ID ----------------
const CounterSchema = new mongoose.Schema({
  _id: String,
  sequence_value: Number,
});
const Counter = mongoose.models.Counter || mongoose.model("Counter", CounterSchema, "counters");

async function getNextEmployeeId() {
  await connectDB();
  const result = await Counter.findOneAndUpdate(
    { _id: "employee_id" },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return "E-" + result.sequence_value.toString().padStart(4, "0");
}

// ---------------- GET: fetch all employees with asset statuses ----------------
export async function GET() {
  try {
    await connectDB();

    const employees = await Employee.find().sort({ createdAt: -1 });

    const result = await Promise.all(
      employees.map(async (emp) => {
        // Default statuses
        const assetStatuses = {
          mouse_status: "STORE",
          keyboard_status: "STORE",
          pc_status: "STORE",
          heatset_status: "STORE",
          laptop_status: "STORE",
          phone_status: "STORE",
        };

        try {
          // Only fetch status if asset exists
          if (emp.mouse_id) {
            const mouse = await Mouse.findById(emp.mouse_id).select("status");
            if (mouse) assetStatuses.mouse_status = mouse.status;
          }
          if (emp.keyboard_id) {
            const keyboard = await Keyboard.findById(emp.keyboard_id).select("status");
            if (keyboard) assetStatuses.keyboard_status = keyboard.status;
          }
          if (emp.pc_id) {
            const pc = await Pc.findById(emp.pc_id).select("status");
            if (pc) assetStatuses.pc_status = pc.status;
          }
          if (emp.heatset_id) {
            const heatset = await Heatset.findById(emp.heatset_id).select("status");
            if (heatset) assetStatuses.heatset_status = heatset.status;
          }
          if (emp.laptop_id) {
            const laptop = await Laptop.findById(emp.laptop_id).select("status");
            if (laptop) assetStatuses.laptop_status = laptop.status;
          }
          if (emp.phone_id) {
            const phone = await Phone.findById(emp.phone_id).select("status");
            if (phone) assetStatuses.phone_status = phone.status;
          }
        } catch (err) {
          console.error("Error fetching asset for employee:", emp._id, err);
        }

        return {
          ...emp.toObject(),
          ...assetStatuses,
        };
      })
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/employee failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ---------------- POST: add new employee ----------------
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Generate new employee ID
    const newId = await getNextEmployeeId();

    // Remove empty optional fields to avoid storing empty strings
    const optionalFields = ["keyboard_id","mouse_id","pc_id","heatset_id","laptop_id","phone_id"];
    optionalFields.forEach((key) => {
      if (!body[key]) delete body[key];
    });

    const newEmployee = new Employee({ _id: newId, ...body });
    await newEmployee.save();

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/employee failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
