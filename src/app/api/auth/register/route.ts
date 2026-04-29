import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sanitizeString, sanitizeEmail } from "@/lib/sanitize";
import { authLimiter } from "@/lib/rate-limit";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Rate limit
    const limited = authLimiter(req);
    if (limited) return limited;

    await connectDB();
    const body = await req.json();
    const name = sanitizeString(body.name || "");
    const email = sanitizeEmail(body.email || "");
    const password = body.password || "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Please provide all required fields." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    if (Buffer.byteLength(password, "utf8") > 72) {
      return NextResponse.json(
        { error: "Password must be at most 72 bytes to avoid bcrypt truncation." },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: "Name is too long." },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not configured for registration");
      return NextResponse.json(
        { error: "Authentication is not configured." },
        { status: 500 }
      );
    }

    // Generate JWT and set cookie so user is auto-logged in
    const token = jwt.sign(
      { userId: user._id.toString() },
      jwtSecret,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: { id: user._id, name: user.name, email: user.email },
      },
      { status: 201 }
    );

    // Set HTTP-only cookie for auto-login after registration
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration." },
      { status: 500 }
    );
  }
}
