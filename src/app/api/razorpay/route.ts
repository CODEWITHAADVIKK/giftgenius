import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Guard against placeholder / missing credentials
    if (
      !keyId ||
      !keySecret ||
      keyId === "rzp_test_placeholder" ||
      keySecret === "rzp_secret_placeholder"
    ) {
      console.error(
        "[Razorpay] Real API keys are not configured. " +
        "Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local"
      );
      return NextResponse.json(
        {
          error:
            "Payment gateway is not configured. Please add your Razorpay API keys to .env.local",
        },
        { status: 503 }
      );
    }

    // Instantiate inside the handler so the module never crashes on import
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const body = await req.json();
    const { amount, currency = "INR", receipt, notes } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects paise (integer)
      currency,
      receipt: receipt || `GG-${Date.now()}`,
      notes: notes || {},
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
