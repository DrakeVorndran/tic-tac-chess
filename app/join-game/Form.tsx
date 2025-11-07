"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Form({
  onSubmit,
}: {
  onSubmit: (name: string, lobby: string) => Promise<void | string>;
}) {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [lobby, setLobby] = useState("");
  const [err, setErr] = useState<string | void | null>(null);

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
        setErr(await onSubmit(name, lobby));
      }}
    >
      <div className="flex flex-col gap-2 mb-4 items-center *:flex *:gap-2 *:justify-between *:w-full">
        <div>
          <label htmlFor="name">Enter your name:</label>
          <input
            className="outline-1 rounded-md"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="lobby">Lobby ID:</label>
          <input
            id="lobby"
            className="outline-1 rounded-md"
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
