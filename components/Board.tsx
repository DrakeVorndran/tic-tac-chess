"use client";

import { use, useEffect, useState } from "react";
import { GameMessageType } from "./messageTypes";
import Piece from "./Piece";
import { PieceStruct } from "./StaticPieces";

type BoardProps = {
  fireMessage: (message: GameMessageType) => void;
  pieceList: PieceStruct[];
  turn: "w" | "b" | null;
  enabled: boolean;
  myColor?: "w" | "b" | null;
  boardState: string[];
  setBoardState: (newState: string[]) => void;
};

export default function Board({
  fireMessage,
  pieceList,
  turn,
  enabled,
  myColor,
  boardState,
  setBoardState,
}: BoardProps) {
  const [selectedPiece, setSelectedPiece] = useState<number | string | null>(
    null
  );

  const [avalibleMoves, setAvailableMoves] = useState<number[]>([]);

  function selectPiece(square: number) {
    if (!enabled || (turn != null && turn != myColor)) return;

    if (selectedPiece != null && avalibleMoves.includes(square)) {
      if (avalibleMoves.includes(square)) {
        const newBoardState = [...boardState];
        if (typeof selectedPiece == "string") {
          newBoardState[square] = `${myColor}${selectedPiece}`;
        } else {
          newBoardState[square] = newBoardState[selectedPiece];
          newBoardState[selectedPiece] = "";
        }
        fireMessage({
          playMove: newBoardState,
        });
      }
      setSelectedPiece(null);
    }

    if (boardState[square].charAt(0) === myColor) {
      setSelectedPiece(square);
    }
  }

  function addPiece(pieceRepr: string) {
    if (!enabled || (turn != null && turn != myColor)) return;
    setSelectedPiece(pieceRepr);
  }

  useEffect(() => {
    if (selectedPiece == null) {
      setAvailableMoves([]);
      return;
    }
    if (typeof selectedPiece == "number") {
      const repr = boardState[selectedPiece].charAt(1);
      const piece =
        pieceList.find((p) => p.repersentationChar === repr) || null;

      const search = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(
        (index) =>
          boardState[index] === "" || boardState[index].charAt(0) !== myColor
      );
      setAvailableMoves(search);
    } else {
      if (myColor == "w") {
        const search = [0, 1, 2].filter((index) => boardState[index] === "");
        setAvailableMoves(search);
      } else {
        const search = [6, 7, 8].filter((index) => boardState[index] === "");
        setAvailableMoves(search);
      }
    }
  }, [selectedPiece]);

  return (
    <div className={`sm:flex sm:justify-center sm:items-stretch`}>
      <div className="grid grid-cols-3 grid-rows-3 aspect-square sm:w-xl">
        {boardState.map((cell, index) => (
          <div
            onClick={() => selectPiece(index)}
            className={`box-border flex justify-center items-center text-black  hover:border-red-400 hover:border-2 ${
              avalibleMoves.includes(index)
                ? index % 2
                  ? "bg-amber-200"
                  : "bg-amber-100"
                : index % 2
                ? "bg-green-400"
                : "bg-green-200 "
            } ${selectedPiece === index ? "border-4 border-yellow-400" : ""}`}
            key={index}
          >
            <Piece pieceList={pieceList} repr={cell} />
          </div>
        ))}
      </div>
      <div className="flex justify-around mt-4 sm:w-xl sm:flex-col sm:mt-0 sm:flex-0 sm:ml-4 sm:mr-4">
        {myColor &&
          pieceList.map((piece, index) => (
            <div
              onClick={() => addPiece(`${piece.repersentationChar}`)}
              className={`sm:w-40 bg-green-300 w-1/4 flex justify-center border-2 rounded-sm aspect-square hover:border-blue-400 ${
                typeof selectedPiece == "string" &&
                selectedPiece == piece.repersentationChar
                  ? "border-4 border-yellow-400"
                  : ""
              }`}
              key={index}
            >
              <Piece
                pieceList={pieceList}
                repr={`${myColor}${piece.repersentationChar}`}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
