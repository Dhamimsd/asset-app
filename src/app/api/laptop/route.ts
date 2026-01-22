import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import mongoose from "mongoose";
import { Laptop } from "@/lib/model";

// Counter schema for custom IDs
const CounterSchema = new mongoose.Schema({
  _id: String,
  sequence_value: Number,
});
const Counter = mongoose.models.Counter || mongoose.model("Counter", CounterSchema, "counters");

// Generate next L-xxxx ID
async function getNextLaptopId() {
  await connectDB();
  const result = await Counter.findOneAndUpdate(
    { _id: "laptop_id" },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return "L-" + result.sequence_value.toString().padStart(4, "0");
}

// GET all laptop OR filter by status
export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const status = url.searchParams.get("status"); // e.g., ?status=STORE

    let filter = {};
    if (status) {
      filter = { status };
    }

    const laptop = await Laptop.find(filter)
          .sort({ createdAt: -1 })
          .populate({
            path: "assigned_to",
            select: "_id employee_name department", 
          })
          .lean();
          return NextResponse.json(laptop, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: add new laptop
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newId = await getNextLaptopId();

    const newLaptop = new Laptop({ _id: newId, ...body });
    await newLaptop.save();

    const populatedLaptop = await newLaptop.populate({
      path: "assigned_to",
      select: "_id employee_name department",
    });


    return NextResponse.json(populatedLaptop, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
