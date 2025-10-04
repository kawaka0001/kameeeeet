import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { logger } from "@/lib/logger";
import { withApiHandler, createErrorResponse, handleDbError } from "@/lib/api-utils";
import type { CreateRoomRequest, CreateRoomResponse } from "@/types";

/**
 * Generate a unique creator token
 */
function generateCreatorToken(): string {
  return `creator_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * POST /api/rooms
 * Create a new room
 */
export const POST = withApiHandler<CreateRoomResponse>(
  async (request: NextRequest) => {
    const requestId = logger.generateRequestId();

    const body: CreateRoomRequest = await request.json();
    const { roomName, password, maxParticipants = 100, expiresIn } = body;

    // Validate room name
    if (!roomName || roomName.trim().length === 0) {
      logger.warn("Room creation failed: missing room name", { requestId });
      return createErrorResponse("Room name is required", 400);
    }

    // Validate room name format
    const roomNameRegex = /^[a-zA-Z0-9-_]{3,50}$/;
    if (!roomNameRegex.test(roomName)) {
      logger.warn("Room creation failed: invalid room name format", {
        requestId,
        roomName,
        reason: "Invalid format"
      });
      return createErrorResponse(
        "Room name must be 3-50 characters and contain only letters, numbers, hyphens, and underscores",
        400
      );
    }

    try {
      // Check if room already exists
      const existingRoom = await db.getRoomByName(roomName);
      if (existingRoom) {
        logger.warn("Room creation failed: room already exists", {
          requestId,
          roomName
        });
        return createErrorResponse("Room with this name already exists", 409);
      }

      // Hash password if provided
      let passwordHash: string | null = null;
      if (password && password.trim().length > 0) {
        if (password.length < 4) {
          logger.warn("Room creation failed: password too short", {
            requestId,
            roomName
          });
          return createErrorResponse("Password must be at least 4 characters", 400);
        }
        passwordHash = await bcrypt.hash(password, 10);
      }

      // Calculate expiration time
      let expiresAt: Date | null = null;
      if (expiresIn && expiresIn > 0) {
        expiresAt = new Date(Date.now() + expiresIn * 60 * 1000);
      }

      // Generate creator token
      const creatorToken = generateCreatorToken();

      // Create room in database
      const room = await db.createRoom(
        roomName,
        passwordHash,
        creatorToken,
        maxParticipants,
        expiresAt
      );

      logger.info("Room created successfully", {
        requestId,
        roomName: room.room_name,
        hasPassword: !!passwordHash,
        maxParticipants: room.max_participants,
      });

      // Return response
      const response: CreateRoomResponse = {
        roomName: room.room_name,
        creatorToken,
        hasPassword: !!passwordHash,
      };

      return NextResponse.json(response, { status: 201 });
    } catch (error) {
      return handleDbError("createRoom", error, { requestId, roomName });
    }
  },
  { endpoint: "/api/rooms", method: "POST" }
);
