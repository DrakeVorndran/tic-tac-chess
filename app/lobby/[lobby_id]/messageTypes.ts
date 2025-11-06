export type GameMessageType =
  | {
      // Message sent to claim room ownership
      claimRoom: string;
    }
  | {
      // Message sent to join the room
      joinRoom: string;
    }
  | {
      playMove: string;
    };
