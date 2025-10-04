"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getClientEnv } from "@/lib/env";
import { logger } from "@/lib/logger";
import { JoinForm } from "@/components/JoinForm";
import { VideoRoom } from "@/components/VideoRoom";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import type { TokenResponse, RoomInfoResponse } from "@/types";

/**
 * Room page component
 * Handles the join flow and video conference room
 */
export default function RoomPage() {
  const params = useParams();
  const roomName = params.roomName as string;
  const [token, setToken] = useState("");
  const [hasPassword, setHasPassword] = useState(false);
  const [isLoadingRoom, setIsLoadingRoom] = useState(true);
  const [roomError, setRoomError] = useState<string | null>(null);

  // Fetch room information
  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const response = await fetch(`/api/rooms/${encodeURIComponent(roomName)}`);

        if (response.ok) {
          const data: RoomInfoResponse = await response.json();
          setHasPassword(data.hasPassword);
        } else if (response.status === 404) {
          // Room doesn't exist in DB, but might exist in LiveKit
          // Allow joining without password
          setHasPassword(false);
        } else {
          const error = await response.json();
          throw new Error(error.error || "Failed to get room info");
        }
      } catch (error) {
        logger.error("Failed to fetch room info", error as Error);
        // Continue anyway - room might exist in LiveKit
        setHasPassword(false);
      } finally {
        setIsLoadingRoom(false);
      }
    };

    fetchRoomInfo();
  }, [roomName]);

  /**
   * Handles participant joining the room
   */
  const handleJoin = async (participantName: string, password?: string) => {
    try {
      logger.info("Attempting to join room", { roomName, participantName });

      let url = `/api/token?roomName=${encodeURIComponent(
        roomName
      )}&participantName=${encodeURIComponent(participantName)}`;

      if (password) {
        url += `&password=${encodeURIComponent(password)}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get token");
      }

      const data: TokenResponse = await response.json();
      setToken(data.token);

      logger.info("Successfully joined room", { roomName, participantName });
    } catch (error) {
      logger.error("Failed to join room", error as Error, {
        roomName,
        participantName,
      });
      throw error;
    }
  };

  // Get LiveKit URL
  let livekitUrl: string;
  try {
    const env = getClientEnv();
    livekitUrl = env.NEXT_PUBLIC_LIVEKIT_URL;
  } catch (error) {
    logger.error("Environment configuration error", error as Error);
    return <ErrorDisplay message="LiveKit URL not configured" />;
  }

  // Show loading state
  if (isLoadingRoom) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading room...</div>
      </div>
    );
  }

  // Show join form if not yet joined
  if (!token) {
    return (
      <JoinForm roomName={roomName} hasPassword={hasPassword} onJoin={handleJoin} />
    );
  }

  // Show video room
  return <VideoRoom token={token} serverUrl={livekitUrl} />;
}
