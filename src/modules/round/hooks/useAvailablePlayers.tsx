import { useQuery } from "@tanstack/react-query";
import supabase from "@/utils/supabase";

export function useAvailablePlayers() {
	return useQuery({
		queryKey: ["available-players"],
		queryFn: async () => {
			const { data, error } = await supabase.from("players").select("*");

			if (error) throw error.message;
			return data;
		},
	});
}
