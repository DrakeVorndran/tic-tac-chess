"use client";

import { useEffect, useState } from "react";

export default function NameSelector({
  onSubmit,
}: {
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("myName");
    if (storedName) {
      setName(storedName);
    }
  }, []);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        localStorage.setItem("myName", name);
        onSubmit(name);
      }}
    >
      <label htmlFor="name">Enter your name:</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Join Game</button>
    </form>
  );
}
