import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/modules/user/context/UserContext";
import supabase from "@/utils/supabase";

export function useMe() {
	const { user } = useUser();

	return useQuery({
		queryKey: ["player"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("players")
				.select("*")
				.eq("auth_id", user?.id)
				.single();

			if (error) throw error.message;
			return data;
		},
	});
}
