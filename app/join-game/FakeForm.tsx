export default function FakeForm() {
  return (
    <form>
      <div className="flex flex-col gap-2 mb-4 items-center *:flex *:gap-2 *:justify-between *:w-full">
        <div>
          <label htmlFor="name">Enter your name:</label>
          <input className="outline-1 rounded-md p-1" id="name" />
        </div>
        <div>
          <label htmlFor="lobby">Lobby ID:</label>
          <input id="lobby" className="outline-1 rounded-md p-1" />
        </div>
        <p className="text-red-500"> </p>
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
