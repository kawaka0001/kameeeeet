import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env";
import { logger } from "@/lib/logger";
import type { TokenResponse, ErrorResponse } from "@/types";

/**
 * GET /api/token
 * Generates a LiveKit access token for a participant to join a room
 */
export async function GET(request: NextRequest) {
  try {
    const roomName = request.nextUrl.searchParams.get("roomName");
    const participantName = request.nextUrl.searchParams.get("participantName");

    // Validate parameters
    if (!roomName || !participantName) {
      logger.warn("Missing required parameters", {
        roomName: !!roomName,
        participantName: !!participantName,
      });

      return NextResponse.json<ErrorResponse>(
        { error: "Missing roomName or participantName" },
        { status: 400 }
      );
    }

    // Get validated environment variables
    const env = getServerEnv();

    // Create access token
    const at = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
      identity: participantName,
      ttl: "10h",
    });

    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    logger.info("Token generated successfully", {
      roomName,
      participantName,
    });

    return NextResponse.json<TokenResponse>({ token });
  } catch (error) {
    logger.error("Failed to generate token", error as Error);

    return NextResponse.json<ErrorResponse>(
      {
        error: "Failed to generate token",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
