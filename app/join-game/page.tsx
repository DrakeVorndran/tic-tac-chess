import prisma from "@/lib/prisma";
import Link from "next/link";
export default async function JoinGamePage() {
  const allRooms = await prisma.room.findMany();
  console.log(allRooms);
  return (
    <div>
      <h1>Join Game Page</h1>
      <p>All games:</p>
      {allRooms.map((room, index) => (
        <div key={index}>Room created by: {room.roomCreator}</div>
      ))}

      <Link href="/new-game">Make a game</Link>
    </div>
  );
}
