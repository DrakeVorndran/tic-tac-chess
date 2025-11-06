function generateStaticParams() {}
import Game from "./Game";

export default async function LobbyPage({
  params,
}: {
  params: Promise<{ lobby_id: string }>;
}) {
  const { lobby_id } = await params;
  return (
    <div>
      <h1>Lobby Page: {lobby_id}</h1>
      <Game lobby={lobby_id} />
    </div>
  );
}
