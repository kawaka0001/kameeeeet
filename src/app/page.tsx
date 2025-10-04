"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CreateRoomForm from "@/components/CreateRoomForm";

/**
 * Home page component
 * Landing page for the Meet application
 */
export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const [joinRoomName, setJoinRoomName] = useState("");

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinRoomName.trim()) {
      router.push(`/room/${joinRoomName.trim()}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Meet</h1>
          <p className="text-xl text-gray-600">
            Secure video conferencing with password protection
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-300 mb-6">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === "create"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Create Room
          </button>
          <button
            onClick={() => setActiveTab("join")}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === "join"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Join Room
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {activeTab === "create" ? (
            <CreateRoomForm />
          ) : (
            <div className="w-full max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-4">Join an Existing Room</h2>
              <form onSubmit={handleJoinRoom} className="space-y-4">
                <div>
                  <label
                    htmlFor="joinRoomName"
                    className="block text-sm font-medium mb-2"
                  >
                    Room Name or URL
                  </label>
                  <input
                    id="joinRoomName"
                    type="text"
                    value={joinRoomName}
                    onChange={(e) => setJoinRoomName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Enter room name"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Join Room
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
