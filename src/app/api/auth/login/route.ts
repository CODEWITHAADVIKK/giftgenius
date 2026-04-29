import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sanitizeEmail } from "@/lib/sanitize";
import { authLimiter } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limit
    const limited = authLimiter(req);
    if (limited) return limited;

    const body = await req.json();
    const email = sanitizeEmail(body.email || "");
    const password = body.password || "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please provide email and password." },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not configured");
      return NextResponse.json(
        { error: "Authentication is not configured." },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      jwtSecret,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
    });

    // Set HTTP-only cookie correctly for App Router
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
