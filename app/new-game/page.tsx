import prisma from "@/lib/prisma";
import NewGameForm from "./form";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Room } from "@prisma/client";

export default async function NewGamePage() {
  async function handleCreateGame(
    creator: string,
    personalGameUuid: string
  ): Promise<Room | null> {
    "use server";
    const room = await prisma.room.create({
      data: {
        roomCreatorName: creator,
        roomCreator: personalGameUuid,
        roomToken: Math.random().toString(36).substring(2, 8),
        currentBoard: ["", "", "", "", "", "", "", "", ""],
        turn: "",
      },
    });
    return room;
  }
  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className={"text-2xl"}>Create Game</h1>
      <NewGameForm onCreate={handleCreateGame} />
    </div>
  );
}
