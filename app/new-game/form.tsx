"use client";
import { personalGameId } from "@/components/types";
import { Room } from "@prisma/client";
import { randomUUID } from "crypto";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewGameForm({
  onCreate,
}: {
  onCreate: (
    creator: string,
    personalGameIdentifier: string
  ) => Promise<Room | null>;
}) {
  const router = useRouter();
  const [creator, setCreator] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("myName");
    if (storedName) {
      setCreator(storedName);
    }
  }, []);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        localStorage.setItem("myName", creator);
        let allIds = localStorage.getItem("personalGameIds");
        let newIdList: personalGameId[] = [];
        if (allIds != null) {
          newIdList = JSON.parse(allIds);
        }

        const personalId = Math.random().toString(36).substring(2, 6);

        const lobby = await onCreate(creator, personalId);
        if (lobby == null) {
          setError("Something went wrong");
          return;
        }

        const newPersonalUuid: personalGameId = {
          lobbyId: lobby.roomToken,
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
        router.push(`/lobby/${lobby.roomToken}`);
      }}
    >
      <div className="flex flex-col gap-2 mb-4 items-center *:flex *:gap-2 *:justify-between *:w-full">
        <div>
          <label htmlFor="name">Enter your name:</label>
          <input
            className="outline-1 rounded-md p-1"
            id="name"
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
          />
        </div>
        {error != "" && <p>{error}</p>}
        <div>
          <button
            type="submit"
            className="outline-2 mt-2 rounded-md m-auto p-1 pr-2 pl-2 cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
          >
            Create Game
          </button>
        </div>
      </div>
    </form>
  );
}
