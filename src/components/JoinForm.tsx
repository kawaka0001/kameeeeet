"use client";

import { useState } from "react";

interface JoinFormProps {
  roomName: string;
  onJoin: (participantName: string) => Promise<void>;
}

/**
 * Form component for joining a room
 */
export function JoinForm({ roomName, onJoin }: JoinFormProps) {
  const [participantName, setParticipantName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!participantName.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      await onJoin(participantName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join room");
      setIsJoining(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-center">
          Join Room: {roomName}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Enter your name"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              className="w-full px-4 py-2 border rounded text-black"
              disabled={isJoining}
              aria-label="Participant name"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!participantName.trim() || isJoining}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isJoining ? "Joining..." : "Join Room"}
          </button>
        </form>
      </div>
    </main>
  );
}
