"use client";
import Image from "next/image";

const classList = "w-1/2";

const PieceMap = {
  wp: (
    <img
      src="/pieces-basic-svg/pawn-w.svg"
      alt="White Pawn"
      className={classList}
    />
  ),
  wn: (
    <img
      src="/pieces-basic-svg/knight-w.svg"
      alt="White Knight"
      className={classList}
    />
  ),
  wb: (
    <img
      src="/pieces-basic-svg/bishop-w.svg"
      alt="White Bishop"
      className={classList}
    />
  ),
  wr: (
    <img
      src="/pieces-basic-svg/rook-w.svg"
      alt="White Rook"
      className={classList}
    />
  ),
  wq: (
    <img
      src="/pieces-basic-svg/queen-w.svg"
      alt="White Queen"
      className={classList}
    />
  ),
  wk: (
    <img
      src="/pieces-basic-svg/king-w.svg"
      alt="White King"
      className={classList}
    />
  ),

  bp: (
    <img
      src="/pieces-basic-svg/pawn-b.svg"
      alt="Black Pawn"
      className={classList}
    />
  ),
  bn: (
    <img
      src="/pieces-basic-svg/knight-b.svg"
      alt="Black Knight"
      className={classList}
    />
  ),
  bb: (
    <img
      src="/pieces-basic-svg/bishop-b.svg"
      alt="Black Bishop"
      className={classList}
    />
  ),
  br: (
    <img
      src="/pieces-basic-svg/rook-b.svg"
      alt="Black Rook"
      className={classList}
    />
  ),
  bq: (
    <img
      src="/pieces-basic-svg/queen-b.svg"
      alt="Black Queen"
      className={classList}
    />
  ),
  bk: (
    <img
      src="/pieces-basic-svg/king-b.svg"
      alt="Black King"
      className={classList}
    />
  ),
};

export default function Piece({ piece }: { piece: string }) {
  if (piece in PieceMap) {
    return PieceMap[piece as keyof typeof PieceMap];
  }
  return <> </>;
}
