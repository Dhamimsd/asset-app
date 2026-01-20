import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
// import { Asset } from "@/lib/model";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDB();

    // Create new asset
    // const newAsset = await Asset.create(body);

    // return NextResponse.json(newAsset);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create asset" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;
    await connectDB();

    // const updatedAsset = await Asset.findByIdAndUpdate(id, updateData, { new: true });

    // if (!updatedAsset) {
    //   return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    // }

    // return NextResponse.json(updatedAsset);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update asset" }, { status: 500 });
  }
}
