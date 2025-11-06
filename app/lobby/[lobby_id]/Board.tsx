"use client";

import { GameMessageType } from "./messageTypes";
import Piece from "./Piece";

type BoardProps = {
  fireMessage: (message: GameMessageType) => void;
};

export default function Board({ fireMessage }: BoardProps) {
  const boardState = ["wb", "wr", "wn", "", "", "", "bb", "br", "bn"];

  function handleMove(square: string) {
    const message: GameMessageType = {
      playMove: square,
    };
    fireMessage(message);
  }
  return (
    <div>
      <div className="grid grid-cols-3 grid-rows-3 aspect-square">
        {boardState.map((cell, index) => (
          <div
            onClick={() => handleMove(cell)}
            className={`box-border flex justify-center items-center text-black  hover:border-red-400 hover:border-2 ${
              index % 2 ? "bg-green-400" : "bg-green-200"
            }`}
            key={index}
          >
            <Piece piece={cell} />
          </div>
        ))}
      </div>
    </div>
  );
}
