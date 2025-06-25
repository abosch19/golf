import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/modules/user/context/UserContext";
import supabase from "@/utils/supabase";

export interface PlayerFormData {
	firstName: string;
	lastName: string;
	birthdate: string;
	nationality: string;
}

export function useCreatePlayer() {
	const { user } = useUser();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (player: PlayerFormData) => {
			const { data, error } = await supabase.from("players").insert({
				first_name: player.firstName,
				last_name: player.lastName,
				birthdate: player.birthdate,
				nationality: player.nationality,
				auth_id: user?.id,
			});

			if (error) throw error.message;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["player"] });
		},
	});
}
