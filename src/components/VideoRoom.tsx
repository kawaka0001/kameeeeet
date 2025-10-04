"use client";

import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";

interface VideoRoomProps {
  token: string;
  serverUrl: string;
}

/**
 * Video conference room component
 */
export function VideoRoom({ token, serverUrl }: VideoRoomProps) {
  return (
    <div className="h-screen">
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={serverUrl}
        data-lk-theme="default"
        style={{ height: "100vh" }}
      >
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}
