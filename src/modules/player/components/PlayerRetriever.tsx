import { PlayerProvider } from "../context/PlayerContext";
import { usePlayer } from "../hooks/usePlayer";
import { CreatePlayerPage } from "../pages/CreatePlayerPage";

export function PlayerRetriever({ children }: { children: React.ReactNode }) {
	const { data: player, isLoading, error } = usePlayer();

	if (isLoading) return <div>Loading...</div>;
	if (error || !player) return <CreatePlayerPage />;

	return <PlayerProvider player={player}>{children}</PlayerProvider>;
}
