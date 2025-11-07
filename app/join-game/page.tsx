import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Form from "./Form";
export default async function JoinGamePage() {
  async function handleJoinRoom(username: string, roomId: string) {
    "use server";
    // Logic to join the room can be added here

    const existingRoom = await prisma.room.findUnique({
      where: { roomToken: roomId },
    });
    console.log(existingRoom, roomId);
    if (!existingRoom) {
      return "Room not found";
    }
    const result = await prisma.room.update({
      where: { roomToken: roomId },
      data: { roomOccupantName: username },
    });
    redirect(`/lobby/${roomId}`);
  }
  return (
    <div className={"flex flex-col gap-4 items-center"}>
      <h1 className={"text-2xl"}>Join Game</h1>
      <Form onSubmit={handleJoinRoom} />
    </div>
  );
}
