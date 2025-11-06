"use client";

import { Room } from "@prisma/client";

export default function SingleRoom({ room }: { room: Room }) {
  return <div>room created by {room.roomCreatorName}</div>;
}
