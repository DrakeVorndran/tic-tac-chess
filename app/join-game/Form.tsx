"use client";

import { personalGameId } from "@/components/types";
import { Room } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Form({
  onSubmit,
}: {
  onSubmit: (name: string, lobby: string) => Promise<Room | string>;
}) {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [lobby, setLobby] = useState("");
  const [err, setErr] = useState<string | void | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (searchParams != null) {
      const lobby = searchParams.get("lobby");
      if (lobby != null) {
        setLobby(lobby);
      }
    }
    const storedName = localStorage.getItem("myName");
    if (storedName) {
      setName(storedName);
    }
  }, []);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        localStorage.setItem("myName", name);
        const lobbyObj = await onSubmit(name, lobby);
        if (typeof lobbyObj == "string") {
          setErr(lobbyObj);
          return;
        }

        let allIds = localStorage.getItem("personalGameIds");
        let newIdList: personalGameId[] = [];
        if (allIds != null) {
          newIdList = JSON.parse(allIds);
        }
        const personalId = Math.random().toString(36).substring(2, 6);
        const newPersonalUuid: personalGameId = {
          lobbyId: lobbyObj.roomToken,
          personalUuid: personalId,
          expiration: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
        };
        newIdList.push(newPersonalUuid);

        const today = new Date();
        localStorage.setItem(
          "personalGameIds",
          JSON.stringify(
            newIdList.filter((gameId) => gameId.expiration > today)
          )
        );
        router.push(`/lobby/${lobbyObj.roomToken}`);
      }}
    >
      <div className="flex flex-col gap-2 mb-4 items-center *:flex *:gap-2 *:justify-between *:w-full">
        <div>
          <label htmlFor="name">Enter your name:</label>
          <input
            className="outline-1 rounded-md p-1"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="lobby">Lobby ID:</label>
          <input
            id="lobby"
            className="outline-1 rounded-md p-1"
            value={lobby}
            onChange={(e) => setLobby(e.target.value)}
          />
        </div>
        <p className="text-red-500">{typeof err == "string" && err}</p>
        <div>
          <button
            type="submit"
            className="outline-2 mt-2 rounded-md m-auto p-1 pr-2 pl-2 cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
          >
            Join Game
          </button>
        </div>
      </div>
    </form>
  );
}
