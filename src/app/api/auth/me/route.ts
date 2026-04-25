import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    // Read from cookie correctly in App Router
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_for_dev_only"
    ) as { userId: string };

    await connectDB();
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    return NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
