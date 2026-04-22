import { NextResponse } from "next/server";
import { demoOrders } from "@/lib/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("id");

  if (orderId) {
    const order = demoOrders.find((o) => o.id === orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  }

  return NextResponse.json({ orders: demoOrders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, address, paymentMethod, giftWrap, giftMessage, coupon } = body;

    // Generate order
    const orderId = `GG-2026-${Math.floor(Math.random() * 9000 + 1000)}`;

    const order = {
      id: orderId,
      items,
      address,
      paymentMethod,
      giftWrap: giftWrap || false,
      giftMessage: giftMessage || "",
      coupon: coupon || "",
      status: "pending",
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(
        Date.now() + 4 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };

    // In production: Save to database
    // await db.orders.create(order);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
