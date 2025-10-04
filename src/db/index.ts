import { sql } from "@vercel/postgres";
import { logger } from "@/lib/logger";
import type { Room } from "@/types";

/**
 * Database utility functions for room management with enhanced error logging
 */

export const db = {
  /**
   * Initialize database schema
   */
  async init() {
    try {
      logger.info("Initializing database schema");

      await sql`
        CREATE TABLE IF NOT EXISTS rooms (
          id SERIAL PRIMARY KEY,
          room_name VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255),
          creator_token VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          expires_at TIMESTAMP,
          max_participants INTEGER DEFAULT 100,
          is_active BOOLEAN DEFAULT true
        )
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS idx_room_name ON rooms(room_name)
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS idx_active_rooms ON rooms(is_active, created_at)
      `;

      logger.info("Database schema initialized successfully");
    } catch (error) {
      logger.error("Failed to initialize database schema", error as Error);
      throw error;
    }
  },

  /**
   * Create a new room
   */
  async createRoom(
    roomName: string,
    passwordHash: string | null,
    creatorToken: string,
    maxParticipants: number = 100,
    expiresAt: Date | null = null
  ): Promise<Room> {
    try {
      const expiresAtString = expiresAt ? expiresAt.toISOString() : null;

      logger.debug("Creating room in database", {
        roomName,
        hasPassword: !!passwordHash,
        maxParticipants,
        expiresAt: expiresAtString
      });

      const result = await sql<Room>`
        INSERT INTO rooms (room_name, password_hash, creator_token, max_participants, expires_at)
        VALUES (${roomName}, ${passwordHash}, ${creatorToken}, ${maxParticipants}, ${expiresAtString})
        RETURNING *
      `;

      logger.debug("Room created in database successfully", {
        roomName,
        roomId: result.rows[0].id
      });

      return result.rows[0];
    } catch (error) {
      logger.error("Failed to create room in database", error as Error, {
        roomName,
        maxParticipants
      });
      throw error;
    }
  },

  /**
   * Get room by name
   */
  async getRoomByName(roomName: string): Promise<Room | null> {
    try {
      logger.debug("Fetching room from database", { roomName });

      const result = await sql<Room>`
        SELECT * FROM rooms
        WHERE room_name = ${roomName} AND is_active = true
        LIMIT 1
      `;

      const room = result.rows[0] || null;

      logger.debug(room ? "Room found" : "Room not found", {
        roomName,
        found: !!room
      });

      return room;
    } catch (error) {
      logger.error("Failed to fetch room from database", error as Error, {
        roomName
      });
      throw error;
    }
  },

  /**
   * Check if room exists and is active
   */
  async roomExists(roomName: string): Promise<boolean> {
    try {
      const result = await sql`
        SELECT EXISTS(
          SELECT 1 FROM rooms
          WHERE room_name = ${roomName} AND is_active = true
        ) as exists
      `;

      return result.rows[0]?.exists || false;
    } catch (error) {
      logger.error("Failed to check room existence", error as Error, {
        roomName
      });
      throw error;
    }
  },

  /**
   * Deactivate a room
   */
  async deactivateRoom(roomName: string, creatorToken: string): Promise<boolean> {
    try {
      logger.debug("Deactivating room", { roomName });

      const result = await sql`
        UPDATE rooms
        SET is_active = false
        WHERE room_name = ${roomName} AND creator_token = ${creatorToken}
        RETURNING id
      `;

      const success = (result.rowCount ?? 0) > 0;

      logger.debug(success ? "Room deactivated" : "Room not deactivated (not found or wrong token)", {
        roomName,
        success
      });

      return success;
    } catch (error) {
      logger.error("Failed to deactivate room", error as Error, {
        roomName
      });
      throw error;
    }
  },

  /**
   * Clean up expired rooms
   */
  async cleanupExpiredRooms(): Promise<number> {
    try {
      logger.info("Cleaning up expired rooms");

      const result = await sql`
        UPDATE rooms
        SET is_active = false
        WHERE expires_at IS NOT NULL AND expires_at < NOW() AND is_active = true
        RETURNING id
      `;

      const count = result.rowCount ?? 0;

      logger.info("Expired rooms cleaned up", { count });

      return count;
    } catch (error) {
      logger.error("Failed to clean up expired rooms", error as Error);
      throw error;
    }
  },
};
