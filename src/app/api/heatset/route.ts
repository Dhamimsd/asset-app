// app/api/mouse/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import mongoose from "mongoose";
import { Heatset} from "@/lib/model";

// Counter schema for custom IDs
const CounterSchema = new mongoose.Schema({
  _id: String,
  sequence_value: Number,
});
const Counter = mongoose.models.Counter || mongoose.model("Counter", CounterSchema, "counters");

// Generate next H-xxxx ID
async function getNextHeatsetId() {
  await connectDB();
  const result = await Counter.findOneAndUpdate(
    { _id: "heatset_id" },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return "H-" + result.sequence_value.toString().padStart(4, "0");
}

// GET all heatset OR filter by status
export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const status = url.searchParams.get("status"); // e.g., ?status=STORE

    let filter = {};
    if (status) {
      filter = { status };
    }

    const heatsets = await Heatset.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(heatsets, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: add new laptop
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newId = await getNextHeatsetId();

    const newHeatset = new Heatset({ _id: newId, ...body });
    await newHeatset.save();

    return NextResponse.json(newHeatset, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
