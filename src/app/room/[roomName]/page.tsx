"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { getClientEnv } from "@/lib/env";
import { logger } from "@/lib/logger";
import { JoinForm } from "@/components/JoinForm";
import { VideoRoom } from "@/components/VideoRoom";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import type { TokenResponse } from "@/types";

/**
 * Room page component
 * Handles the join flow and video conference room
 */
export default function RoomPage() {
  const params = useParams();
  const roomName = params.roomName as string;
  const [token, setToken] = useState("");

  /**
   * Handles participant joining the room
   */
  const handleJoin = async (participantName: string) => {
    try {
      logger.info("Attempting to join room", { roomName, participantName });

      const response = await fetch(
        `/api/token?roomName=${encodeURIComponent(
          roomName
        )}&participantName=${encodeURIComponent(participantName)}`
      );

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

  // Show join form if not yet joined
  if (!token) {
    return <JoinForm roomName={roomName} onJoin={handleJoin} />;
  }

  // Show video room
  return <VideoRoom token={token} serverUrl={livekitUrl} />;
}
