"use client";

import Board from "@/components/Board";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { GameMessageType } from "../../components/messageTypes";
import { staticPieces } from "@/components/StaticPieces";

const defaultBoardState = ["", "", "", "", "", "", "", "", ""];

export default function SandboxGame() {
  const [scores, setScores] = useState({ w: 0, b: 0 });
  const [turn, setTurn] = useState<"w" | "b" | null>("w");
  const [boardState, setBoardState] = useState([...defaultBoardState]);
  const [winner, setWinner] = useState<"w" | "b" | null>(null);

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

  async function fireMessage(message: GameMessageType) {
    if ("playMove" in message) {
      setBoardState(message.playMove);
      setTurn(turn == "w" ? "b" : "w");
    }
    if ("reset" in message) {
      setScores((prev) => ({
        ...prev,
        [message.reset as "a" | "b"]: prev[message.reset as "w" | "b"] + 1,
      }));
      setBoardState([...defaultBoardState]);
      setWinner(null);
      setTurn(null);
    }
  }
  async function handleReset() {
    fireMessage({ reset: winner });
  }

  return (
    <div>
      <div className="flex justify-between mb-4 mr-2 ml-2 text-xl">
        <h3 className="flex align-middle">
          White {scores.w > 0 && `(${scores.w})`}
          {turn == "w" && <ArrowLeft color={"red"} />}
        </h3>
        <h3 className="flex align-middle">
          {turn == "b" && <ArrowRight color={"red"} />} Black:{" "}
          {scores.b > 0 && `(${scores.b})`}
        </h3>
      </div>

      <Board
        boardState={boardState}
        setBoardState={setBoardState}
        fireMessage={fireMessage}
        pieceList={staticPieces}
        turn={turn}
        myColor={turn}
        enabled={winner == null}
      />
      {winner && (
        <div className="flex flex-col items-center justify-center gap-2">
          <h2 className="text-2xl">
            {winner == "w" ? "White" : "Black"} Wins!
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
