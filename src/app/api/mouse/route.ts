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

// GET all mouse OR filter by status
export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const status = url.searchParams.get("status"); // e.g., ?status=STORE

    let filter = {};
    if (status) {
      filter = { status };
    }

    const mice = await Mouse.find(filter).sort({ createdAt: -1 });
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

    return NextResponse.json(newMouse, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
