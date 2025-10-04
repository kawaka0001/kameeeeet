import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import type { ErrorResponse } from "@/types";

/**
 * API route handler wrapper with automatic logging and error handling
 */
export function withApiHandler<T = unknown>(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>,
  options?: {
    endpoint?: string;
    method?: string;
  }
) {
  return async (req: NextRequest, context?: any): Promise<NextResponse> => {
    const requestId = logger.generateRequestId();
    const stopTimer = logger.startTimer();
    const endpoint = options?.endpoint || req.nextUrl.pathname;
    const method = options?.method || req.method;

    try {
      logger.info(`API Request started`, {
        requestId,
        endpoint,
        method,
        url: req.url,
      });

      const response = await handler(req, context);
      const duration = stopTimer();

      logger.info(`API Request completed`, {
        requestId,
        endpoint,
        method,
        statusCode: response.status,
        duration,
      });

      return response;
    } catch (error) {
      const duration = stopTimer();

      logger.error(
        `API Request failed`,
        error as Error,
        {
          requestId,
          endpoint,
          method,
          duration,
        }
      );

      return NextResponse.json<ErrorResponse>(
        {
          error: "Internal server error",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Standardized error response builder
 */
export function createErrorResponse(
  message: string,
  statusCode: number = 400,
  details?: string
): NextResponse<ErrorResponse> {
  return NextResponse.json<ErrorResponse>(
    {
      error: message,
      details,
    },
    { status: statusCode }
  );
}

/**
 * Database error handler with detailed logging
 */
export function handleDbError(
  operation: string,
  error: unknown,
  context?: Record<string, unknown>
): NextResponse<ErrorResponse> {
  const err = error as Error;

  logger.error(
    `Database operation failed: ${operation}`,
    err,
    {
      operation,
      ...context,
    }
  );

  // Check for specific database errors
  if (err.message?.includes("unique constraint")) {
    return createErrorResponse(
      "Resource already exists",
      409,
      err.message
    );
  }

  if (err.message?.includes("not found")) {
    return createErrorResponse(
      "Resource not found",
      404,
      err.message
    );
  }

  return createErrorResponse(
    "Database operation failed",
    500,
    err.message
  );
}

/**
 * Validation error helper
 */
export function validateRequired<T>(
  data: Record<string, unknown>,
  fields: string[]
): { valid: true; data: T } | { valid: false; error: NextResponse<ErrorResponse> } {
  const missing = fields.filter((field) => !data[field]);

  if (missing.length > 0) {
    return {
      valid: false,
      error: createErrorResponse(
        `Missing required fields: ${missing.join(", ")}`,
        400
      ),
    };
  }

  return { valid: true, data: data as T };
}
