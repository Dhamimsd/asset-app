import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { User } from "@/lib/model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { name, password } = await req.json();

    await connectDB();

    const user = await User.findOne({ name }).lean();
    if (!user) {
      return NextResponse.json({ error: "Invalid name or password" }, { status: 401 });
    }

    // Plain text password check (for now)
    if (password !== user.password) {
      return NextResponse.json({ error: "Invalid name or password" }, { status: 401 });
    }

    // Create JWT
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not defined");

    const token = jwt.sign(
      { userId: user._id.toString(), name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set cookie
    cookies().set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
    });

    return NextResponse.json({ message: "Login successful" });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
