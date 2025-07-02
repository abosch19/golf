import { createContext, use } from "react";
import type { Player } from "@/types/player";

export const PlayerContext = createContext<Player>({
	id: "",
	first_name: "",
	last_name: "",
	birthdate: "",
	nationality: "",
	p_and_p_handicap: 0,
	auth_id: "",
});

export function PlayerProvider({
	children,
	player,
}: {
	children: React.ReactNode;
	player: Player;
}) {
	return <PlayerContext value={player}>{children}</PlayerContext>;
}

export const usePlayerContext = () => use(PlayerContext);
