import prisma from "@/lib/prisma";
import Link from "next/link";
import RoomDisplay from "./RoomDisplay";
import { redirect } from "next/navigation";
export default async function JoinGamePage() {
  const allRooms = await prisma.room.findMany();
  console.log(allRooms);

  async function handleJoinRoom(roomId: string, username: string) {
    "use server";
    // Logic to join the room can be added here
    const result = await prisma.room.update({
      where: { roomToken: roomId },
      data: { roomOccupantName: username },
    });
    redirect(`/lobby/${roomId}`);
  }
  return (
    <div>
      <h1>Join Game Page</h1>
      <p>All games:</p>
      <RoomDisplay rooms={allRooms} joinRoom={handleJoinRoom} />

      <Link href="/new-game">Make a game</Link>
    </div>
  );
}
