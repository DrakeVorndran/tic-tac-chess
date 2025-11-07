export type PieceStruct = {
  repersentationChar: string;
  whitePiece: string;
  blackPiece: string;
  moveDirections?: ("n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw")[];
  moveList?: (0 | 1)[][];
  alt: string;
};

export const staticPieces: PieceStruct[] = [
  {
    repersentationChar: "r",
    whitePiece: "/pieces-basic-svg/rook-w.svg",
    blackPiece: "/pieces-basic-svg/rook-b.svg",
    moveDirections: ["n", "e", "s", "w"],
    alt: "Rook",
  },
  {
    repersentationChar: "n",
    whitePiece: "/pieces-basic-svg/knight-w.svg",
    blackPiece: "/pieces-basic-svg/knight-b.svg",
    moveList: [
      [0, 1, 0, 1, 0],
      [1, 0, 0, 0, 1],
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [0, 1, 0, 1, 0],
    ],
    alt: "Knight",
  },
  {
    repersentationChar: "b",
    whitePiece: "/pieces-basic-svg/bishop-w.svg",
    blackPiece: "/pieces-basic-svg/bishop-b.svg",
    moveDirections: ["ne", "se", "sw", "nw"],
    alt: "Bishop",
  },
];
