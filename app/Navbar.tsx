import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full p-4 bg-gray-800 text-white flex flex-col justify-center items-center sm:flex-row sm:justify-between">
      <h1 className="text-xl font-bold">Chess Tac Toe</h1>
      <div className="flex gap-4 mt-2">
        <Link
          className="text-xl font-bold border-b-2 hover:text-blue-200 cursor-pointer"
          href="/new-game"
        >
          Create Game
        </Link>
        <Link
          className="text-xl font-bold border-b-2 hover:text-blue-200 cursor-pointer"
          href="/join-game"
        >
          Join Game
        </Link>
      </div>
    </nav>
  );
}
