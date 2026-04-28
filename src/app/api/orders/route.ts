import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { apiLimiter } from "@/lib/rate-limit";
import { sanitizeObject } from "@/lib/sanitize";

/** Generate a random unique order number */
function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const hex = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `GG-${year}-${hex}`;
}

/** Extract userId from JWT cookie if present */
function getUserIdFromToken(req: NextRequest): string | null {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  try {
    const decoded = jwt.verify(token, secret) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const limited = apiLimiter(req);
  if (limited) return limited;

  try {
    await connectDB();
    const body = await req.json();
    const {
      items,
      address,
      paymentMethod,
      paymentStatus,
      razorpayOrderId,
      razorpayPaymentId,
      subtotal,
      tax,
      shippingFee,
      total,
    } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    if (!address || !address.name || !address.phone || !address.line1 || !address.city || !address.state || !address.pincode) {
      return NextResponse.json(
        { error: "Complete shipping address is required" },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Payment method is required" },
        { status: 400 }
      );
    }

    if (typeof total !== "number" || total <= 0) {
      return NextResponse.json(
        { error: "Invalid order total" },
        { status: 400 }
      );
    }

    // Prevent duplicate orders for the same razorpay payment
    if (razorpayPaymentId) {
      const existingOrder = await Order.findOne({ razorpayPaymentId });
      if (existingOrder) {
        console.error("Duplicate razorpayPaymentId order detected", {
          orderId: existingOrder._id,
          orderNumber: existingOrder.orderNumber,
          status: existingOrder.status,
        });
        return NextResponse.json(
          {
            error: "Order already exists for this payment",
            order: {
              id: existingOrder._id,
              orderNumber: existingOrder.orderNumber,
              status: existingOrder.status,
            },
          },
          { status: 409 }
        );
      }
    }

    const userId = getUserIdFromToken(req);

    if (!paymentStatus) {
      return NextResponse.json(
        { error: "Payment status is required." },
        { status: 400 }
      );
    }

    const validPaymentStatuses = ["pending", "paid", "failed"];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        { error: "Invalid payment status." },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();
    const sanitizedItems = items.map((item: Record<string, unknown>) => sanitizeObject(item));
    const sanitizedAddress = sanitizeObject(address);

    let order: any = null;
    let currentOrderNumber = orderNumber;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        order = await Order.create({
          user: userId || undefined,
          orderNumber: currentOrderNumber,
          items: sanitizedItems,
          shippingAddress: sanitizedAddress,
          paymentMethod,
          paymentStatus,
          razorpayOrderId,
          razorpayPaymentId,
          subtotal: subtotal || total,
          tax: tax || 0,
          shippingFee: shippingFee || 0,
          total,
          status: "processing",
        });
        break;
      } catch (error) {
        const err = error as any;
        if (
          err?.code === 11000 &&
          attempt < 2 &&
          (err?.keyPattern?.orderNumber || String(err?.message).includes("orderNumber"))
        ) {
          currentOrderNumber = generateOrderNumber();
          continue;
        }
        throw error;
      }
    }

    if (!order) {
      return NextResponse.json(
        { error: "Unable to create a unique order number. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        order: {
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.status,
          id: order._id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
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

    // Authenticated user's orders
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).limit(20);
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
