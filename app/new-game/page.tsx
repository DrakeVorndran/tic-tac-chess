import prisma from "@/lib/prisma";
import NewGameForm from "./form";
import Link from "next/link";

export default async function NewGamePage() {
  async function handleCreateGame(creator: string) {
    "use server";
    await prisma.room.create({
      data: {
        roomCreator: creator,
        roomToken: Math.random().toString(36).substring(2, 8),
      },
    });
  }
  return (
    <div>
      <h1>Create a new game</h1>
      <NewGameForm onCreate={handleCreateGame} />
      <Link href="/join-game">Join an existing game</Link>
    </div>
  );
}
