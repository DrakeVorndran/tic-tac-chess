"use client";
import Image from "next/image";
import { PieceStruct } from "./StaticPieces";

const classList = "w-1/2";

export default function Piece({
  pieceList,
  repr,
}: {
  pieceList: PieceStruct[];
  repr: string;
}) {
  if (repr === "") {
    return <></>;
  }
  const [colorChar, pieceChar] =
    repr.length === 2 ? [repr[0], repr[1]] : [null, null];
  const color =
    colorChar === "w" ? "whitePiece" : colorChar === "b" ? "blackPiece" : null;
  const piece = pieceList.find((p) => p.repersentationChar === pieceChar);
  return (
    <img
      src={piece![color!]}
      className={classList}
      alt={`${colorChar === "w" ? "White" : "Black"} ${piece!.alt}`}
    />
  );
}
