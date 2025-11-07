"use client";

import { Room } from "@prisma/client";
import SingleRoom from "./SingleRoom";
import { useEffect, useState } from "react";
import NameSelector from "./NameSelector";

export default function RoomDisplay({
  getAllRooms,
  joinRoom,
}: {
  getAllRooms: () => Promise<Room[]>;
  joinRoom: (room: string, username: string) => void;
}) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const fetched = await getAllRooms();
      if (mounted) setRooms(fetched);
    })();
    return () => {
      mounted = false;
    };
  }, []);
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
