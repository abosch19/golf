import { useQuery } from "@tanstack/react-query";
import supabase from "@/utils/supabase";

export function usePlayer(playerId: string) {
	return useQuery({
		queryKey: ["player", playerId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("players")
				.select("*")
				.eq("id", playerId)
				.single();

			if (error) throw error.message;
			return data;
		},
	});
}
