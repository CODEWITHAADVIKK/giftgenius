import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Please provide your email address." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message:
          "If an account with that email exists, we've sent password reset instructions.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Store hashed token and expiry on user document
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // In production, send email with reset link containing resetToken
    // For now, log a development-only marker without leaking the raw token or email.
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[Password Reset] reset flow generated for email ending in ${email.slice(-6)}`
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "If an account with that email exists, we've sent password reset instructions.",
      // Only include token in development for testing
      ...(process.env.NODE_ENV === "development" && { resetToken }),
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
