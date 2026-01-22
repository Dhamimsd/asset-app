import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import mongoose from "mongoose";
import { Pc } from "@/lib/model";

// Counter schema for custom IDs
const CounterSchema = new mongoose.Schema({
  _id: String,
  sequence_value: Number,
});
const Counter = mongoose.models.Counter || mongoose.model("Counter", CounterSchema, "counters");

// Generate next P-xxxx ID
async function getNextPcId() {
  await connectDB();
  const result = await Counter.findOneAndUpdate(
    { _id: "pc_id" },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return "P-" + result.sequence_value.toString().padStart(4, "0");
}

// GET all pc OR filter by status
export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const status = url.searchParams.get("status"); // e.g., ?status=STORE

    let filter = {};
    if (status) {
      filter = { status };
    }

    const pc = await Pc.find(filter)
          .sort({ createdAt: -1 })
          .populate({
            path: "assigned_to",
            select: "_id employee_name department", 
          })
          .lean();
          return NextResponse.json(pc, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: add new PC
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newId = await getNextPcId();

    const newPc = new Pc({ _id: newId, ...body });
    await newPc.save();

    const populatedPc = await newPc.populate({
      path: "assigned_to",
      select: "_id employee_name department",
    });


    return NextResponse.json(populatedPc, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
