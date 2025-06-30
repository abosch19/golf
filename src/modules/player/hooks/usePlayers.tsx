import { useQuery } from "@tanstack/react-query";
import supabase from "@/utils/supabase";

export function usePlayers() {
	return useQuery({
		queryKey: ["players"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("players")
				.select("*, round_scores(*, rounds(*, courses(*)))");

			if (error) throw error.message;
			return data;
		},
	});
}
