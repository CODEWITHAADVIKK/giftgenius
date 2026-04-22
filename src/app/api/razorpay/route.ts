import { NextResponse } from "next/server";

// Razorpay Order Creation API
// In production, use: const Razorpay = require('razorpay');
// const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency = "INR", receipt, notes } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // ── Production Razorpay Integration ──
    // const order = await instance.orders.create({
    //   amount: amount * 100, // Razorpay accepts paise
    //   currency,
    //   receipt,
    //   notes,
    // });
    // return NextResponse.json(order);

    // ── Demo Mode ──
    const demoOrder = {
      id: `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      entity: "order",
      amount: amount * 100,
      amount_paid: 0,
      amount_due: amount * 100,
      currency,
      receipt: receipt || `GG-${Date.now()}`,
      status: "created",
      notes: notes || {},
      created_at: Math.floor(Date.now() / 1000),
    };

    return NextResponse.json(demoOrder);
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
