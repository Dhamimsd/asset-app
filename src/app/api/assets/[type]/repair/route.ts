import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import {
  Mouse,
  Keyboard,
  Pc,
  Laptop,
  Heatset,
  Phone,
  Monitor,
} from "@/lib/model";

const MODEL_MAP: any = {
  mouse: Mouse,
  keyboard: Keyboard,
  pc: Pc,
  laptop: Laptop,
  heatset: Heatset,
  phone: Phone,
  monitor: Monitor,
};

export async function GET(
  req: Request,
  { params }: { params: { type: string } }
) {
  try {
    await connectDB();

    const Model = MODEL_MAP[params.type];
    if (!Model) {
      return NextResponse.json(
        { error: "Invalid asset type" },
        { status: 400 }
      );
    }

    const assets = await Model.find({ status: "REPAIR" })
      .select("_id brand model assigned_to updatedAt")
      .sort({ updatedAt: -1 });

    return NextResponse.json(
      assets.map((a: any) => ({
        id: a._id,
        name: `${a.brand} ${a.model}`,
        updatedAt: a.updatedAt,
        assigned_to: a.assigned_to,
      }))
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch repair assets" },
      { status: 500 }
    );
  }
}
