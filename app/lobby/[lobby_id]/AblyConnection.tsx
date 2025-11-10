"is client";

import { Room } from "@prisma/client";
import * as Ably from "ably";
import { useChannel, useConnectionStateListener } from "ably/react";
import { use, useEffect, useState } from "react";
import Board from "../../../components/Board";
import { GameMessageType } from "../../../components/messageTypes";
import { staticPieces } from "../../../components/StaticPieces";
import { ArrowLeft, ArrowRight, Check, Copy } from "lucide-react";

type AblyConnectionProps = {
  lobby_id: string;
  username: string;
  room: Room;
  updateRoom: (newData: Partial<Room>) => void;
};
const defaultBoardState = ["", "", "", "", "", "", "", "", ""];

export default function AblyConnection({
  lobby_id,
  username,
  room,
  updateRoom,
}: AblyConnectionProps) {
  const [messages, setMessages] = useState<Ably.Message[]>([]);

  const [localRoom, setLocalRoom] = useState<
    Room & { whiteScore: number; blackScore: number }
  >({ ...room, whiteScore: 0, blackScore: 0 });
  const [coppied, setCoppied] = useState(false);

  const [turn, setTurn] = useState<"w" | "b" | null>(null);
  const [conType, setConType] = useState<"creator" | "occupant" | null>(null);
  const [winner, setWinner] = useState<"w" | "b" | null>(null);
  const [boardState, setBoardState] = useState([...defaultBoardState]);

  useEffect(() => {
    const toSearch = [
      // Horizontal
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // Vertical
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // Diagonal
      [0, 4, 8],
      [2, 4, 6],
    ];

    toSearch.forEach((bracket) => {
      const streaks = bracket.reduce(
        (r, i) => {
          const cell = boardState[i];
          const color = cell.charAt(0);
          if (color) {
            return { ...r, [color]: r[color as "w" | "b"] + 1 };
          }
          return r;
        },
        { b: 0, w: 0 }
      );
      if (streaks.w == 3) {
        setWinner("w");
      }
      if (streaks.b == 3) {
        setWinner("b");
      }
    });
  }, [boardState]);

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

  function handleCopy() {
    navigator.clipboard.writeText(
      `${window.location.origin}/join-game?lobby=${lobby_id}`
    );
    setCoppied(true);
    setTimeout(() => {
      setCoppied(false);
    }, 1000);
  }

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
      if (
        message.connectionId !== localRoom.roomCreator &&
        message.connectionId !== localRoom.roomOccupant
      ) {
        return;
      }
      const turn = message.connectionId === localRoom.roomCreator ? "b" : "w";
      setBoardState(parsed.playMove);
      setTurn(turn);
    }
    if ("reset" in parsed) {
      if (
        message.connectionId !== localRoom.roomCreator &&
        message.connectionId !== localRoom.roomOccupant
      ) {
        return;
      }
      if (parsed.reset == "b") {
        setLocalRoom((prev) => ({ ...prev, blackScore: prev.blackScore + 1 }));
      }
      if (parsed.reset == "w") {
        setLocalRoom((prev) => ({ ...prev, whiteScore: prev.whiteScore + 1 }));
      }
      setBoardState([...defaultBoardState]);
      setWinner(null);
      setTurn(null);
    }
  }

  function fireMessage(message: GameMessageType) {
    channel.publish("game", JSON.stringify(message));
  }

  function handleReset() {
    const resetMessage: GameMessageType = {
      reset: winner,
    };
    fireMessage(resetMessage);
  }

  // Create a channel called 'get-started' and subscribe to all messages with the name 'first' using the useChannel hook

  const { channel } = useChannel(lobby_id, "game", (message) => {
    console.log(message);
    setMessages((previousMessages) => [...previousMessages, message]);
    onMessageReceived(message);
  });

  const boardEnabled =
    (winner == null &&
      turn == null &&
      conType != null &&
      localRoom.roomCreator != null &&
      localRoom.roomOccupant != null) ||
    (turn == "w" && conType == "creator") ||
    (turn == "b" && conType == "occupant");

  return (
    // Publish a message with the name 'first' and the contents 'Here is my first message!' when the 'Publish' button is clicked
    <div>
      <div className="flex justify-between mb-4 mr-2 ml-2 text-xl">
        <h3 className="flex align-middle">
          White: {localRoom.roomCreatorName || "Waiting for player..."}{" "}
          {localRoom.whiteScore > 0 && `(${localRoom.whiteScore})`}
          {turn == "w" && <ArrowLeft color={"red"} />}
        </h3>
        <h3 className="flex align-middle">
          {turn == "b" && <ArrowRight color={"red"} />} Black:{" "}
          {localRoom.roomOccupantName || "Waiting for player..."}{" "}
          {localRoom.blackScore > 0 && `(${localRoom.blackScore})`}
        </h3>
      </div>
      <h4
        onClick={handleCopy}
        className={`flex align-middle justify-center gap-2 hover:text-blue-200 cursor-pointer transition-colors sm:absolute sm:top-[66px] sm:left-[calc(50vw-43px)] ${
          coppied ? "text-green-300" : ""
        }`}
      >
        {coppied ? (
          <>
            Copied
            <Check />
          </>
        ) : (
          <>
            Get link
            <Copy />
          </>
        )}
      </h4>
      <Board
        boardState={boardState}
        setBoardState={setBoardState}
        fireMessage={fireMessage}
        pieceList={staticPieces}
        turn={turn}
        myColor={
          conType == "creator" ? "w" : conType == "occupant" ? "b" : null
        }
        inverted={conType == "occupant" ? true : false}
        enabled={boardEnabled}
      />
      {winner && (
        <div className="flex flex-col items-center justify-center gap-2">
          <h2 className="text-2xl">
            {winner == "w"
              ? localRoom.roomCreatorName
              : localRoom.roomOccupantName}{" "}
            Wins!
          </h2>
          <button
            onClick={handleReset}
            className="border rounded-md p-1 pl-2 pr-2 bg-blue-500 hover:bg-blue-600 cursor-pointer"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
