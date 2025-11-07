"is client";

import { Room } from "@prisma/client";
import * as Ably from "ably";
import { useChannel, useConnectionStateListener } from "ably/react";
import { use, useEffect, useState } from "react";
import Board from "./Board";
import { GameMessageType } from "./messageTypes";
import { staticPieces } from "./StaticPieces";
import { ArrowLeft, ArrowRight } from "lucide-react";

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

  const [turn, setTurn] = useState<"w" | "b" | null>(null);
  const [conType, setConType] = useState<"creator" | "occupant" | null>(null);
  const [boardState, setBoardState] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

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
    const parsed = JSON.parse(message.data as string) as GameMessageType;
    if ("claimRoom" in parsed && parsed.claimRoom == username) {
      updateRoom({ roomCreator: message.connectionId });
      setLocalRoom((prev) => ({
        ...prev,
        roomCreator: message.connectionId || null,
      }));
      setConType("creator");
      return;
    }
    if ("joinRoom" in parsed) {
      if (parsed.joinRoom == username) {
        console.log("firing here");
        updateRoom({
          roomOccupant: message.connectionId,
          roomOccupantName: username,
        });
        setConType("occupant");
      }
      console.log("firing here 2");
      setLocalRoom((prev) => ({
        ...prev,
        roomOccupant: message.connectionId || null,
        roomOccupantName: parsed.joinRoom,
      }));
      return;
    }
    if ("playMove" in parsed) {
      const turn = message.connectionId === localRoom.roomCreator ? "b" : "w";
      setBoardState(parsed.playMove);
      setTurn(turn);
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

  const boardEnabled =
    (turn == null && conType != null) ||
    (turn == "w" && conType == "creator") ||
    (turn == "b" && conType == "occupant");

  return (
    // Publish a message with the name 'first' and the contents 'Here is my first message!' when the 'Publish' button is clicked
    <div>
      <div className="flex justify-between mb-4 mr-2 ml-2 text-xl">
        <h3 className="flex align-middle">
          White: {localRoom.roomCreatorName || "Waiting for player..."}{" "}
          {turn == "w" && <ArrowLeft color={"red"} />}
        </h3>
        <h3 className="flex align-middle">
          {turn == "b" && <ArrowRight color={"red"} />} Black:{" "}
          {localRoom.roomOccupantName || "Waiting for player..."}{" "}
        </h3>
      </div>
      <Board
        boardState={boardState}
        setBoardState={setBoardState}
        fireMessage={fireMessage}
        pieceList={staticPieces}
        turn={turn}
        myColor={
          conType == "creator" ? "w" : conType == "occupant" ? "b" : null
        }
        enabled={boardEnabled}
      />
    </div>
  );
}
