"is client";

import { Room } from "@prisma/client";
import * as Ably from "ably";
import { useChannel, useConnectionStateListener } from "ably/react";
import { use, useEffect, useState } from "react";
import Board from "./Board";
import { GameMessageType } from "./messageTypes";

type AblyConnectionProps = {
  lobby_id: string;
  username: string;
  room: Room;
  updateRoom: (newData: Partial<Room>) => void;
};

export default function AblyConnection({
  lobby_id,
  username,
  room,
  updateRoom,
}: AblyConnectionProps) {
  const [messages, setMessages] = useState<Ably.Message[]>([]);

  const [localRoom, setLocalRoom] = useState<Room>(room);

  useEffect(() => {
    console.log(room);
    if (room.roomCreator == null && room.roomCreatorName == username) {
      const message: GameMessageType = {
        claimRoom: username,
      };
      channel.publish("game", JSON.stringify(message));
      return;
    }
    if (room.roomOccupant == null && room.roomOccupantName == username) {
      const message: GameMessageType = {
        joinRoom: username,
      };
      channel.publish("game", JSON.stringify(message));
      return;
    }
  }, []);

  useConnectionStateListener("connected", () => {
    console.log("Connected to Ably!");
  });

  function onMessageReceived(message: Ably.Message) {
    const parsed = JSON.parse(message.data as string) as Object;
    if ("claimRoom" in parsed && parsed.claimRoom == username) {
      updateRoom({ roomCreator: message.connectionId });
      setLocalRoom((prev) => ({
        ...prev,
        roomCreator: message.connectionId || null,
      }));
      return;
    }
    if ("joinRoom" in parsed && parsed.joinRoom == username) {
      updateRoom({
        roomOccupant: message.connectionId,
        roomOccupantName: username,
      });
      setLocalRoom((prev) => ({
        ...prev,
        roomOccupant: message.connectionId || null,
        roomOccupantName: username,
      }));
      return;
    }
  }

  function fireMessage(message: GameMessageType) {
    channel.publish("game", JSON.stringify(message));
  }

  // Create a channel called 'get-started' and subscribe to all messages with the name 'first' using the useChannel hook

  const { channel } = useChannel(lobby_id, "game", (message) => {
    console.log(message);
    setMessages((previousMessages) => [...previousMessages, message]);
    onMessageReceived(message);
  });
  return (
    // Publish a message with the name 'first' and the contents 'Here is my first message!' when the 'Publish' button is clicked
    <div>
      <Board fireMessage={fireMessage} />
      {messages.map((message) => {
        return <p key={message.id}>{message.data}</p>;
      })}
    </div>
  );
}
