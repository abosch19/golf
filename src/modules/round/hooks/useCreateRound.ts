import { useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "@/utils/supabase";

export interface PlayerHoleScore {
	playerId: string;
	holeNumber: number;
	grossScore: number;
}

export interface CreateRoundFormData {
	course_id: string;
	played_at: string;
	round_scores: {
		id: string;
		player_id: string;
		gross_score: number;
		round_score_holes: {
			hole_number: number;
			gross_score: number;
			course_id: string;
		}[];
	}[];
}

export function useCreateRound() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (roundFormData: CreateRoundFormData) => {
			console.log(roundFormData);
			const { data: roundData, error: roundError } = await supabase
				.from("rounds")
				.insert({
					played_at: roundFormData.played_at,
					course_id: roundFormData.course_id,
				})
				.select("id")
				.single();

			if (roundError) throw roundError;

			roundFormData.round_scores.forEach(async (roundScore) => {
				const { data: roundScoreData, error: roundScoreError } = await supabase
					.from("round_scores")
					.insert({
						round_id: roundData?.id,
						player_id: roundScore.player_id,
						gross_score: roundScore.gross_score,
					})
					.select("id")
					.single();

				if (roundScoreError) throw roundScoreError;

				roundScore.round_score_holes.forEach(async (roundScoreHole) => {
					const { error: roundScoreHoleError } = await supabase
						.from("round_score_holes")
						.insert({
							round_score_id: roundScoreData?.id,
							hole_number: roundScoreHole.hole_number,
							gross_score: roundScoreHole.gross_score,
							course_id: roundScoreHole.course_id,
						});

					if (roundScoreHoleError) throw roundScoreHoleError;
				});
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rounds"] });
		},
	});
}
