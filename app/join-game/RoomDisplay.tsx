"use client";

import { Room } from "@prisma/client";
import SingleRoom from "./SingleRoom";
import { useState } from "react";
import NameSelector from "./NameSelector";

export default function RoomDisplay({
  rooms,
  joinRoom,
}: {
  rooms: Room[];
  joinRoom: (room: string, username: string) => void;
}) {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  return (
    <div>
      {selectedRoom == null ? (
        rooms
          .filter((room) => room.roomOccupant == null)
          .map((room, index) => (
            <div
              className="cursor-pointer m-1 hover:m-0 hover:border-2 hover:border-emerald-200"
              key={index}
              onClick={() => setSelectedRoom(room.roomToken)}
            >
              <SingleRoom room={room} />
            </div>
          ))
      ) : (
        <NameSelector
          onSubmit={(username) => {
            joinRoom(selectedRoom, username);
          }}
        />
      )}
    </div>
  );
}
