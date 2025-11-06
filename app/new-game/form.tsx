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
      <label htmlFor="creator">Your Name:</label>
      <input
        type="text"
        id="creator"
        name="creator"
        value={creator}
        onChange={(e) => setCreator(e.target.value)}
        required
      />
      <button type="submit">Create Game</button>
    </form>
  );
}
