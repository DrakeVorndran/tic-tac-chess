"use client";
import { useEffect, useState } from "react";

export default function NewGameForm({
  onCreate,
}: {
  onCreate: (creator: string) => void;
}) {
  const [creator, setCreator] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("myName");
    if (storedName) {
      setCreator(storedName);
    }
  }, []);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        localStorage.setItem("myName", creator);
        onCreate(creator);
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
