import { NextResponse } from "next/server";

/**
 * Global error handler for API routes.
 * Wraps route handlers with consistent error handling.
 */
export function withErrorHandler(
  handler: (req: Request, ctx?: unknown) => Promise<NextResponse>
) {
  return async (req: Request, ctx?: unknown): Promise<NextResponse> => {
    try {
      return await handler(req, ctx);
    } catch (error: unknown) {
      console.error(`[API Error] ${req.method} ${new URL(req.url).pathname}:`, error);

      // Mongoose validation errors
      if (error && typeof error === "object" && "name" in error) {
        const err = error as { name: string; message: string; code?: number };

        if (err.name === "ValidationError") {
          return NextResponse.json(
            { error: "Validation error", details: err.message },
            { status: 400 }
          );
        }

        if (err.name === "MongoServerError" && err.code === 11000) {
          return NextResponse.json(
            { error: "Duplicate entry. This record already exists." },
            { status: 409 }
          );
        }

        if (err.name === "JsonWebTokenError") {
          return NextResponse.json(
            { error: "Invalid authentication token" },
            { status: 401 }
          );
        }

        if (err.name === "TokenExpiredError") {
          return NextResponse.json(
            { error: "Authentication token has expired" },
            { status: 401 }
          );
        }
      }

      // Generic error
      const message =
        process.env.NODE_ENV === "development" && error instanceof Error
          ? error.message
          : "Internal server error";

      return NextResponse.json({ error: message }, { status: 500 });
    }
  };
}
