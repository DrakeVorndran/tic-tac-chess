import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center font-sans">
      <main className="flex w-full max-w-3xl flex-col items-center justify-between pt-4">
        <h1 className="text-3xl">CHESS TAC TOE</h1>
        <p>The latest inovation in stupid board games</p>
        <div className="flex flex-col items-center gap-2 mt-4">
          <Link
            className="bg-blue-500 hover:bg-blue-600 p-1 pl-2 pr-2 border rounded-md"
            href="/new-game"
          >
            Start a new game
          </Link>
          <p>~ or ~</p>
          <Link
            className="bg-blue-500 hover:bg-blue-600 p-1 pl-2 pr-2 border rounded-md"
            href="/join-game"
          >
            Join a friends lobby
          </Link>
          <p>~ or ~</p>
          <Link
            className="bg-blue-500 hover:bg-blue-600 p-1 pl-2 pr-2 border rounded-md"
            href="/sandbox"
          >
            play on one device
          </Link>
        </div>
      </main>
    </div>
  );
}
