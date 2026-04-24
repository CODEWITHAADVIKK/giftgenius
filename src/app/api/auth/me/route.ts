import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("cookie");
    if (!authHeader || !authHeader.includes("token=")) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const token = authHeader.split("token=")[1].split(";")[0];
    
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET || "fallback_secret_for_dev_only";
    const decoded = jwt.verify(token, secret) as { userId: string };

    await connectDB();
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
