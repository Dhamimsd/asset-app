import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { Mouse, Keyboard, Pc, Laptop, Heatset, Phone } from "@/lib/model";

const MODEL_MAP: any = {
  mouse: Mouse,
  keyboard: Keyboard,
  pc: Pc,
  laptop: Laptop,
  heatset: Heatset,
    phone: Phone,
};

export async function GET(
  req: Request,
  { params }: { params: { type: string } }
) {
  await connectDB();

  const Model = MODEL_MAP[params.type];
  if (!Model) {
    return NextResponse.json({ error: "Invalid asset type" }, { status: 400 });
  }

  const total = await Model.countDocuments();
  const store = await Model.countDocuments({ status: "STORE" });
  const used = await Model.countDocuments({ status: "USED" });
  const repair = await Model.countDocuments({ status: "REPAIR" });

  return NextResponse.json({ total, store, used, repair });
}
