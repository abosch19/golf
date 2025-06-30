import { Loading } from "@/components/layouts/Loading";
import { PlayerProvider } from "../context/PlayerContext";
import { useMe } from "../hooks/useMe";
import { CreatePlayerPage } from "../pages/CreatePlayerPage";

export function PlayerRetriever({ children }: { children: React.ReactNode }) {
	const { data: player, isLoading, error } = useMe();

	if (isLoading) return <Loading />;
	if (error || !player) return <CreatePlayerPage />;

	return <PlayerProvider player={player}>{children}</PlayerProvider>;
}
