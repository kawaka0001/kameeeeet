"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CreateRoomRequest, CreateRoomResponse, ErrorResponse } from "@/types";

export default function CreateRoomForm() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const [usePassword, setUsePassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsCreating(true);

    try {
      const requestBody: CreateRoomRequest = {
        roomName: roomName.trim(),
      };

      if (usePassword && password) {
        requestBody.password = password;
      }

      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as ErrorResponse;
        throw new Error(errorData.error || "Failed to create room");
      }

      const roomData = data as CreateRoomResponse;

      // Store creator token in localStorage
      localStorage.setItem(`creator_${roomName}`, roomData.creatorToken);

      // Redirect to the room
      router.push(`/room/${roomName}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room");
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Create a New Room</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="roomName" className="block text-sm font-medium mb-2">
            Room Name
          </label>
          <input
            id="roomName"
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="my-awesome-room"
            pattern="[a-zA-Z0-9-_]{3,50}"
            title="3-50 characters, letters, numbers, hyphens, and underscores only"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            3-50 characters, letters, numbers, hyphens, and underscores only
          </p>
        </div>

        <div className="flex items-center">
          <input
            id="usePassword"
            type="checkbox"
            checked={usePassword}
            onChange={(e) => setUsePassword(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="usePassword" className="ml-2 block text-sm">
            Protect with password
          </label>
        </div>

        {usePassword && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Enter password"
              minLength={4}
              required={usePassword}
            />
            <p className="text-xs text-gray-500 mt-1">
              At least 4 characters
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isCreating}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? "Creating..." : "Create Room"}
        </button>
      </form>
    </div>
  );
}
