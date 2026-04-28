import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

function isTransientError(error: unknown): boolean {
  const err = error as any;
  if (!err || typeof err !== "object") return false;

  const transientNames = [
    "MongoNetworkError",
    "MongoNetworkTimeoutError",
    "MongooseServerSelectionError",
    "MongooseTimeoutError",
    "TimeoutError",
  ];

  if (transientNames.includes(err.name)) return true;
  if (typeof err.message === "string") {
    return /timeout|timed out|ECONNRESET|EHOSTUNREACH|ENETUNREACH|ECONNREFUSED/i.test(err.message);
  }

  return false;
}

function isValidationError(error: unknown): boolean {
  const err = error as any;
  if (!err || typeof err !== "object") return false;
  if (err instanceof SyntaxError) return true;
  if (typeof err.message !== "string") return false;
  return /Unexpected token|JSON|signature|invalid/i.test(err.message);
}

/**
 * Razorpay Webhook endpoint for automated payment status updates.
 * This handles events like payment.captured, payment.failed, etc.
 *
 * In production, configure this URL in your Razorpay Dashboard:
 * https://yourdomain.com/api/razorpay/webhook
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not configured");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    const signatureBuffer = Buffer.from(signature, "utf8");
    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      console.error("Webhook signature verification failed");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    const eventType = event.event;

    console.log(`[Razorpay Webhook] Received event: ${eventType}`);

    await connectDB();

    switch (eventType) {
      case "payment.captured": {
        const paymentId = event.payload?.payment?.entity?.id;
        const orderId = event.payload?.payment?.entity?.order_id;

        if (orderId) {
          await Order.findOneAndUpdate(
            { razorpayOrderId: orderId },
            {
              paymentStatus: "paid",
              razorpayPaymentId: paymentId,
              status: "processing",
            }
          );
          console.log(`[Webhook] Payment captured for order: ${orderId}`);
        }
        break;
      }

      case "payment.failed": {
        const failedOrderId = event.payload?.payment?.entity?.order_id;

        if (failedOrderId) {
          await Order.findOneAndUpdate(
            { razorpayOrderId: failedOrderId },
            {
              paymentStatus: "failed",
              status: "cancelled",
            }
          );
          console.log(`[Webhook] Payment failed for order: ${failedOrderId}`);
        }
        break;
      }

      case "refund.created": {
        const refundOrderId = event.payload?.refund?.entity?.payment_id;
        if (refundOrderId) {
          await Order.findOneAndUpdate(
            { razorpayPaymentId: refundOrderId },
            { paymentStatus: "refunded" }
          );
          console.log(`[Webhook] Refund created: ${refundOrderId}`);
        }
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${eventType}`);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Razorpay Webhook] Error:", error);
    if (isValidationError(error)) {
      return NextResponse.json({ received: true });
    }
    if (isTransientError(error)) {
      return NextResponse.json(
        { error: "Transient webhook processing error" },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
