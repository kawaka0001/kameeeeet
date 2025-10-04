import { NextResponse } from "next/server";
import { db } from "@/db";
import { logger } from "@/lib/logger";

/**
 * GET /api/migrate
 * Initialize database schema
 * Only available in development mode
 */
export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Migration endpoint is disabled in production" },
      { status: 403 }
    );
  }

  try {
    await db.init();

    logger.info("Database migration completed successfully");

    return NextResponse.json({
      success: true,
      message: "Database schema initialized successfully",
    });
  } catch (error) {
    logger.error("Database migration failed", error as Error);

    return NextResponse.json(
      {
        error: "Migration failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
