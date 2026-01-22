// app/api/mouse/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import mongoose from "mongoose";
import { Mouse } from "@/lib/model";

// Counter schema for custom IDs
const CounterSchema = new mongoose.Schema({
  _id: String,
  sequence_value: Number,
});
const Counter = mongoose.models.Counter || mongoose.model("Counter", CounterSchema, "counters");

// Generate next M-xxxx ID
async function getNextMouseId() {
  await connectDB();
  const result = await Counter.findOneAndUpdate(
    { _id: "mouse_id" },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return "M-" + result.sequence_value.toString().padStart(4, "0");
}

// GET all mice OR filter by status
export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const status = url.searchParams.get("status"); // e.g., ?status=STORE

    let filter: any = {};
    if (status) {
      filter = { status };
    }

    // Fetch mice and populate assigned_to with employee info
    const mice = await Mouse.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: "assigned_to",
        select: "_id employee_name department", // only include necessary fields
      })
      .lean(); // converts Mongoose documents to plain JS objects

    return NextResponse.json(mice, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: add new mouse
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newId = await getNextMouseId();

    const newMouse = new Mouse({ _id: newId, ...body });
    await newMouse.save();

    // Populate assigned_to before returning
    const populatedMouse = await newMouse.populate({
      path: "assigned_to",
      select: "_id employee_name department",
    });

    return NextResponse.json(populatedMouse, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
