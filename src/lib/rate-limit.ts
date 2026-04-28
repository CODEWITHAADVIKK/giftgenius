import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Simple in-memory rate limiter for Next.js API routes.
 * Uses a fixed-window counter that resets when the window expires.
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

let cleanupTimer: ReturnType<typeof setInterval> | null = null;
if (typeof setInterval !== "undefined") {
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
  cleanupTimer.unref?.();
}

interface RateLimitOptions {
  windowMs?: number; // Window in milliseconds
  max?: number; // Max requests per window
}

export function rateLimit(options: RateLimitOptions = {}) {
  const { windowMs = 15 * 60 * 1000, max = 100 } = options;

  return function checkRateLimit(req: NextRequest): NextResponse | null {
    const trustedProxy = process.env.TRUST_PROXY === "true";
    const connection = req as unknown as {
      socket?: { remoteAddress?: string };
      connection?: { remoteAddress?: string };
    };
    const remoteAddress =
      connection.socket?.remoteAddress || connection.connection?.remoteAddress;

    const forwardedIp = trustedProxy
      ? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      : null;

    const ip =
      remoteAddress ||
      forwardedIp ||
      req.headers.get("x-real-ip") ||
      crypto.randomUUID();

    const key = `${ip}:${req.nextUrl.pathname}`;
    const now = Date.now();

    const record = rateLimitMap.get(key);

    if (!record || now > record.resetTime) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return null; // Allow
    }

    if (record.count >= max) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter: Math.ceil((record.resetTime - now) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((record.resetTime - now) / 1000)),
            "X-RateLimit-Limit": String(max),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(record.resetTime / 1000)),
          },
        }
      );
    }

    record.count++;
    return null; // Allow
  };
}

// Pre-configured limiters
export const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
export const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
export const chatLimiter = rateLimit({ windowMs: 60 * 1000, max: 15 });
