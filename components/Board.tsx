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
  inverted?: boolean;
};

export default function Board({
  fireMessage,
  pieceList,
  turn,
  enabled,
  myColor,
  boardState,
  setBoardState,
  inverted,
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
      if (piece == null) {
        setAvailableMoves([]);
        return;
      }
      const search = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(
        (index) =>
          boardState[index] === "" || boardState[index].charAt(0) !== myColor
      );

      const row = selectedPiece % 3;
      const col = Math.floor(selectedPiece / 3);

      function getPiece(row: number, col: number) {
        return boardState[getIndex(row, col)];
      }
      function getIndex(row: number, col: number) {
        return row + col * 3;
      }
      const possibleMoves: number[] = [];
      if ("moveDirections" in piece) {
        piece.moveDirections?.forEach((dir) => {
          let testRow = row;
          let testCol = col;
          let pieceFound = false;
          switch (dir) {
            case "e":
              testRow = row + 1;
              testCol = col;
              pieceFound = false;
              while (testRow < 3 && !pieceFound) {
                const testPiece = getPiece(testRow, testCol);
                if (testPiece == "") {
                  possibleMoves.push(getIndex(testRow, testCol));
                } else if (testPiece.charAt(0) == myColor) {
                  pieceFound = true;
                } else {
                  pieceFound = true;
                  possibleMoves.push(getIndex(testRow, testCol));
                }
                testRow++;
              }
              break;

            case "w":
              testRow = row - 1;
              testCol = col;
              pieceFound = false;
              while (testRow > -1 && !pieceFound) {
                const testPiece = getPiece(testRow, testCol);
                if (testPiece == "") {
                  possibleMoves.push(getIndex(testRow, testCol));
                } else if (testPiece.charAt(0) == myColor) {
                  pieceFound = true;
                } else {
                  pieceFound = true;
                  possibleMoves.push(getIndex(testRow, testCol));
                }
                testRow--;
              }
              break;

            case "n":
              testRow = row;
              testCol = col + 1;
              pieceFound = false;
              while (testCol < 3 && !pieceFound) {
                const testPiece = getPiece(testRow, testCol);
                if (testPiece == "") {
                  possibleMoves.push(getIndex(testRow, testCol));
                } else if (testPiece.charAt(0) == myColor) {
                  pieceFound = true;
                } else {
                  pieceFound = true;
                  possibleMoves.push(getIndex(testRow, testCol));
                }
                testCol++;
              }
              break;

            case "s":
              testRow = row;
              testCol = col - 1;
              pieceFound = false;
              while (testCol > -1 && !pieceFound) {
                const testPiece = getPiece(testRow, testCol);
                if (testPiece == "") {
                  possibleMoves.push(getIndex(testRow, testCol));
                } else if (testPiece.charAt(0) == myColor) {
                  pieceFound = true;
                } else {
                  pieceFound = true;
                  possibleMoves.push(getIndex(testRow, testCol));
                }
                testCol--;
              }
              break;

            case "ne":
              testRow = row + 1;
              testCol = col + 1;
              pieceFound = false;
              while (testRow < 3 && testCol < 3 && !pieceFound) {
                const testPiece = getPiece(testRow, testCol);
                if (testPiece == "") {
                  possibleMoves.push(getIndex(testRow, testCol));
                } else if (testPiece.charAt(0) == myColor) {
                  pieceFound = true;
                } else {
                  pieceFound = true;
                  possibleMoves.push(getIndex(testRow, testCol));
                }
                testRow++;
                testCol++;
              }
              break;

            case "nw":
              testRow = row - 1;
              testCol = col + 1;
              pieceFound = false;
              while (testRow > -1 && testCol < 3 && !pieceFound) {
                const testPiece = getPiece(testRow, testCol);
                if (testPiece == "") {
                  possibleMoves.push(getIndex(testRow, testCol));
                } else if (testPiece.charAt(0) == myColor) {
                  pieceFound = true;
                } else {
                  pieceFound = true;
                  possibleMoves.push(getIndex(testRow, testCol));
                }
                testRow--;
                testCol++;
              }
              break;

            case "sw":
              testRow = row - 1;
              testCol = col - 1;
              pieceFound = false;
              while (testRow > -1 && testCol > -1 && !pieceFound) {
                const testPiece = getPiece(testRow, testCol);
                if (testPiece == "") {
                  possibleMoves.push(getIndex(testRow, testCol));
                } else if (testPiece.charAt(0) == myColor) {
                  pieceFound = true;
                } else {
                  pieceFound = true;
                  possibleMoves.push(getIndex(testRow, testCol));
                }
                testRow--;
                testCol--;
              }
              break;

            case "se":
              testRow = row + 1;
              testCol = col - 1;
              pieceFound = false;
              while (testRow < 3 && testCol > -1 && !pieceFound) {
                const testPiece = getPiece(testRow, testCol);
                if (testPiece == "") {
                  possibleMoves.push(getIndex(testRow, testCol));
                } else if (testPiece.charAt(0) == myColor) {
                  pieceFound = true;
                } else {
                  pieceFound = true;
                  possibleMoves.push(getIndex(testRow, testCol));
                }
                testRow++;
                testCol--;
              }
              break;
          }
        });
      }

      if (piece.moveList != undefined) {
        piece.moveList.map((rowList, gridY) => {
          rowList.map((validBool, gridX) => {
            if (!validBool) {
              return;
            }

            const realX = gridX - 2 + row;
            const realY = gridY - 2 + col;
            if (realX > 2 || realX < 0 || realY > 2 || realY < 0) {
              return;
            }
            const testPiece = getPiece(realX, realY);
            if (testPiece == "" || testPiece.charAt(0) != myColor) {
              possibleMoves.push(getIndex(realX, realY));
            }
          });
        });
      }

      setAvailableMoves(possibleMoves);
    } else {
      if (myColor == "w") {
        const search = [6, 7, 8].filter((index) => boardState[index] === "");
        setAvailableMoves(search);
      } else {
        const search = [0, 1, 2].filter((index) => boardState[index] === "");
        setAvailableMoves(search);
      }
    }
  }, [selectedPiece]);

  function getIndex(boardIndex: number) {
    if (inverted) {
      const row = boardIndex % 3;
      const col = Math.floor(boardIndex / 3);
      return row + -3 * (col - 2);
    }

    return boardIndex;
  }

  const invertedBoard = [
    ...boardState.slice(6, 9),
    ...boardState.slice(3, 6),
    ...boardState.slice(0, 3),
  ];

  return (
    <div className={`sm:flex sm:justify-center sm:items-stretch`}>
      <div className="grid grid-cols-3 grid-rows-3 aspect-square sm:w-xl">
        {(inverted ? invertedBoard : boardState).map((cell, index) => (
          <div
            onClick={() => selectPiece(getIndex(index))}
            className={`box-border flex justify-center items-center text-black  hover:border-red-400 hover:border-2 ${
              avalibleMoves.includes(getIndex(index))
                ? getIndex(index) % 2
                  ? "bg-amber-200"
                  : "bg-amber-100"
                : getIndex(index) % 2
                ? "bg-green-400"
                : "bg-green-200 "
            } ${
              selectedPiece === getIndex(index)
                ? "border-4 border-yellow-400"
                : ""
            }`}
            key={getIndex(index)}
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
