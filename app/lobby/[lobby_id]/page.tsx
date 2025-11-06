function generateStaticParams() {}
import { Prisma, Room } from "@prisma/client";
import Game from "./Game";
import prisma from "@/lib/prisma";

export default async function LobbyPage({
  params,
}: {
  params: Promise<{ lobby_id: string }>;
}) {
  const { lobby_id } = await params;
  const room = await prisma.room.findUnique({ where: { roomToken: lobby_id } });

  async function updateRoom(newData: Partial<Room>) {
    "use server";
    console.log("UPDATING ROOM", newData);
    const result = await prisma.room.update({
      where: { roomToken: lobby_id },
      data: newData,
    });
    console.log(result);
  }
  return (
    <div>
      <h1>Lobby Page: {lobby_id}</h1>
      {room && <Game lobby_id={lobby_id} room={room} updateRoom={updateRoom} />}
    </div>
  );
}
