export type GameMessageType =
  | {
      // Message sent to join the room
      joinRoom: { username: string; personalId: string };
    }
  | {
      // Updated to represent the entire board state
      playMove: { board: string[]; personalId: string };
    }
  | {
      reset: { winner: "w" | "b" | null; personalId: string };
    };
