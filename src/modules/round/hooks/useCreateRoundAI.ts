import { useMutation } from "@tanstack/react-query";
import type { Course } from "@/types/courses";
import type { Player } from "@/types/player";
import { fileToBase64 } from "@/utils/image";
import supabase from "@/utils/supabase";

export function useCreateRoundAI() {
	return useMutation({
		mutationFn: async ({
			availablePlayers,
			availableCourses,
			image,
		}: {
			availablePlayers: Player[];
			availableCourses: Course[];
			image: File;
		}) => {
			return supabase.functions.invoke("create-round-ai", {
				body: {
					imageBase64: `data:image/jpeg;base64,${await fileToBase64(image)}`,
					players: availablePlayers.map((player) => ({
						id: player.id,
						first_name: player.first_name,
						last_name: player.last_name,
					})),
					courses: availableCourses.map((course) => ({
						id: course.id,
						name: course.name,
					})),
				},
			});
		},
	});
}
