import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import mongoose from "mongoose";
import { Keyboard } from "@/lib/model";

// Counter schema for custom IDs
const CounterSchema = new mongoose.Schema({
  _id: String,
  sequence_value: Number,
});
const Counter = mongoose.models.Counter || mongoose.model("Counter", CounterSchema, "counters");

// Generate next M-xxxx ID
async function getNextKeyboardId() {
  await connectDB();
  const result = await Counter.findOneAndUpdate(
    { _id: "keyboard_id" },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return "K-" + result.sequence_value.toString().padStart(4, "0");
}

// GET all keyboard OR filter by status
export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const status = url.searchParams.get("status"); // e.g., ?status=STORE

    let filter = {};
    if (status) {
      filter = { status };
    }

    const keyboards = await Keyboard.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(keyboards, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: add new keayboard
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newId = await getNextKeyboardId();

    const newKeyboard = new Keyboard({ _id: newId, ...body });
    await newKeyboard.save();

    return NextResponse.json(newKeyboard, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
