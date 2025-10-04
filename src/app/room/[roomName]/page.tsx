"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";

export default function RoomPage() {
  const params = useParams();
  const roomName = params.roomName as string;
  const [token, setToken] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    if (!participantName) return;

    setIsJoining(true);
    try {
      const response = await fetch(
        `/api/token?roomName=${encodeURIComponent(
          roomName
        )}&participantName=${encodeURIComponent(participantName)}`
      );
      const data = await response.json();
      setToken(data.token);
    } catch (error) {
      console.error("Failed to get token:", error);
      setIsJoining(false);
    }
  };

  const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!token) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="max-w-md w-full space-y-4">
          <h1 className="text-2xl font-bold text-center">
            Join Room: {roomName}
          </h1>
          <input
            type="text"
            placeholder="Enter your name"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            onKeyPress={(e) => e.key === "Enter" && handleJoin()}
          />
          <button
            onClick={handleJoin}
            disabled={!participantName || isJoining}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {isJoining ? "Joining..." : "Join Room"}
          </button>
        </div>
      </main>
    );
  }

  if (!livekitUrl) {
    return <div>Error: LiveKit URL not configured</div>;
  }

  return (
    <div className="h-screen">
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={livekitUrl}
        data-lk-theme="default"
        style={{ height: "100vh" }}
      >
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}
