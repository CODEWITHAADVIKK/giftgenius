import { NextResponse } from "next/server";
// import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    // ── Production Verification ──
    // const generated_signature = crypto
    //   .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    //   .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    //   .digest("hex");
    //
    // if (generated_signature !== razorpay_signature) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    // }

    // ── Demo Mode: Always succeeds ──
    return NextResponse.json({
      verified: true,
      orderId: razorpay_order_id || `order_demo_${Date.now()}`,
      paymentId: razorpay_payment_id || `pay_demo_${Date.now()}`,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Payment verification failed:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
