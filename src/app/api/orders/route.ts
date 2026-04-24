import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

// For demo purposes if token missing, fallback to guest
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { items, address, paymentMethod, paymentStatus, razorpayOrderId, razorpayPaymentId, subtotal, tax, shippingFee, total } = body;

    // Get user from token if available
    const userId = null;
    // Simplified for this step: user can be passed or we assume guest
    
    const orderNumber = `GG-2026-${Math.floor(Math.random() * 9000 + 1000)}`;

    const order = await Order.create({
      user: userId,
      orderNumber,
      items,
      shippingAddress: address,
      paymentMethod,
      paymentStatus: paymentStatus || "paid",
      razorpayOrderId,
      razorpayPaymentId,
      subtotal,
      tax,
      shippingFee,
      total,
      status: "processing",
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");

    if (orderId) {
      const order = await Order.findOne({ orderNumber: orderId });
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json(order);
    }

    // Get all orders (should be protected by auth in real app)
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
