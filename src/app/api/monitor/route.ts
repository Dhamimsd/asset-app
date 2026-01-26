import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import mongoose from "mongoose";
import { Monitor } from "@/lib/model";

// Counter schema for custom IDs
const CounterSchema = new mongoose.Schema({
  _id: String,
  sequence_value: Number,
});
const Counter = mongoose.models.Counter || mongoose.model("Counter", CounterSchema, "counters");

// Generate next MO-xxxx ID
async function getNextMonitorId() {
  await connectDB();
  const result = await Counter.findOneAndUpdate(
    { _id: "monitor_id" },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return "MO-" + result.sequence_value.toString().padStart(4, "0");
}

// GET all monitor OR filter by status
export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const status = url.searchParams.get("status"); // e.g., ?status=STORE

    let filter = {};
    if (status) {
      filter = { status };
    }

    const monitors = await Monitor.find(filter)
          .sort({ createdAt: -1 })
          .populate({
            path: "assigned_to",
            select: "_id employee_name department", 
          })
          .lean();
          return NextResponse.json(monitors, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: add new monitor
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newId = await getNextMonitorId();

    const newMonitor = new Monitor({ _id: newId, ...body });
    await newMonitor.save();

    const populatedMonitor = await newMonitor.populate({
      path: "assigned_to",
      select: "_id employee_name department",
    });


    return NextResponse.json(populatedMonitor, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
