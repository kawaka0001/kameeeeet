import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { logger } from "@/lib/logger";
import { withApiHandler, createErrorResponse, handleDbError } from "@/lib/api-utils";
import type { RoomInfoResponse } from "@/types";

/**
 * GET /api/rooms/[roomName]
 * Get room information
 */
export const GET = withApiHandler<RoomInfoResponse>(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ roomName: string }> }
  ) => {
    const requestId = logger.generateRequestId();
    const { roomName } = await params;

    if (!roomName) {
      logger.warn("Room info request missing room name", { requestId });
      return createErrorResponse("Room name is required", 400);
    }

    try {
      // Get room from database
      const room = await db.getRoomByName(roomName);

      if (!room) {
        logger.warn("Room not found", { requestId, roomName });
        return createErrorResponse("Room not found", 404);
      }

      // Check if room is expired
      if (room.expires_at && new Date(room.expires_at) < new Date()) {
        logger.info("Room has expired, deactivating", {
          requestId,
          roomName,
          expiresAt: room.expires_at
        });
        await db.deactivateRoom(roomName, room.creator_token);
        return createErrorResponse("Room has expired", 410);
      }

      logger.info("Room info retrieved successfully", {
        requestId,
        roomName,
        hasPassword: !!room.password_hash,
        isActive: room.is_active
      });

      const response: RoomInfoResponse = {
        roomName: room.room_name,
        hasPassword: !!room.password_hash,
        maxParticipants: room.max_participants,
        isActive: room.is_active,
      };

      return NextResponse.json(response);
    } catch (error) {
      return handleDbError("getRoomInfo", error, { requestId, roomName });
    }
  },
  { endpoint: "/api/rooms/[roomName]", method: "GET" }
);
