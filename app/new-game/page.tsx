"use client";
import { createRoom } from "@/lib/data";
export default async function NewGamePage() {
  return (
    <div>
      <h1>Create a new game</h1>
      <form>
        <label htmlFor="creator">Your Name:</label>
        <input type="text" id="creator" name="creator" required />
        <button
          type="submit"
          onClick={async (e) => {
            e.preventDefault();
            const form = e.currentTarget.form;
            const creatorInput = form?.creator as HTMLInputElement;
            const creatorName = creatorInput.value;
            const newRoom = await createRoom(creatorName);
            console.log("New room created:", newRoom);
          }}
        >
          Create Game
        </button>
      </form>
    </div>
  );
}
