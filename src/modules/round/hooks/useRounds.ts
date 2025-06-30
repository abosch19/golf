import { useQuery } from "@tanstack/react-query";
import type { Round } from "../../../types/rounds";
import supabase from "../../../utils/supabase";

export function useRounds() {
	return useQuery<Round[]>({
		queryKey: ["rounds"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("rounds")
				.select(
					"*, round_scores(*, player:players(*), holes:round_score_holes(*, course_hole:course_holes(*))), course:courses(*)",
				);
			if (error) throw error;
			return data as Round[];
		},
	});
}
