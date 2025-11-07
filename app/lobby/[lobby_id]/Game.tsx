"use client";

import * as Ably from "ably";
import Board from "../../../components/Board";
import {
  AblyProvider,
  ChannelProvider,
  useChannel,
  useConnectionStateListener,
} from "ably/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Room } from "@prisma/client";
import AblyConnection from "./AblyConnection";

type GameProps = {
  lobby_id: string;
  room: Room;
  updateRoom: (newData: Partial<Room>) => void;
};

export default function Game({ lobby_id, room, updateRoom }: GameProps) {
  const client = new Ably.Realtime({ authUrl: "/api" });

  const [username, setUsername] = useState("");

  function onMessageReceived(message: Ably.Message) {
    console.log("New message received:", message);
  }

  useEffect(() => {
    const storedUsername = localStorage.getItem("myName");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName={lobby_id}>
        {username && (
          <AblyConnection
            lobby_id={lobby_id}
            username={username}
            room={room}
            updateRoom={updateRoom}
          />
        )}
      </ChannelProvider>
    </AblyProvider>
  );
}
