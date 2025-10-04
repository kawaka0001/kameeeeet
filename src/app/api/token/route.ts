import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerEnv } from "@/lib/env";
import { logger } from "@/lib/logger";
import { db } from "@/db";
import { withApiHandler, createErrorResponse, handleDbError } from "@/lib/api-utils";
import type { TokenResponse } from "@/types";

/**
 * GET /api/token
 * Generates a LiveKit access token for a participant to join a room
 */
export const GET = withApiHandler<TokenResponse>(
  async (request: NextRequest) => {
    const requestId = logger.generateRequestId();

    const roomName = request.nextUrl.searchParams.get("roomName");
    const participantName = request.nextUrl.searchParams.get("participantName");
    const password = request.nextUrl.searchParams.get("password");

    // Validate parameters
    if (!roomName || !participantName) {
      logger.warn("Token request missing required parameters", {
        requestId,
        roomName: !!roomName,
        participantName: !!participantName,
      });

      return createErrorResponse("Missing roomName or participantName", 400);
    }

    try {
      // Check if room exists and get its info
      const room = await db.getRoomByName(roomName);

      // If room has password, verify it
      if (room?.password_hash) {
        if (!password) {
          logger.warn("Password required but not provided", {
            requestId,
            roomName,
            participantName
          });
          return createErrorResponse("Password required for this room", 401);
        }

        const isPasswordValid = await bcrypt.compare(password, room.password_hash);
        if (!isPasswordValid) {
          logger.warn("Invalid password provided", {
            requestId,
            roomName,
            participantName
          });
          return createErrorResponse("Invalid password", 401);
        }
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
        requestId,
        roomName,
        participantName,
        hasPassword: !!room?.password_hash,
      });

      return NextResponse.json<TokenResponse>({ token });
    } catch (error) {
      return handleDbError("getToken", error, {
        requestId,
        roomName,
        participantName
      });
    }
  },
  { endpoint: "/api/token", method: "GET" }
);
