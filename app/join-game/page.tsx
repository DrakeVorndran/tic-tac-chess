import { getAllRooms } from "@/lib/data";
export default async function JoinGamePage() {
  const allRooms = await getAllRooms();
  console.log(allRooms);
  return (
    <div>
      <h1>Join Game Page</h1>
      <p>All games:</p>
      {allRooms.map((room, index) => (
        <div key={index}>Room created by: {room.room_creator}</div>
      ))}
    </div>
  );
}
