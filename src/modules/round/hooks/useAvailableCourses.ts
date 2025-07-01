import { useQuery } from "@tanstack/react-query";
import type { Course } from "@/types/courses";
import supabase from "@/utils/supabase";

export function useAvailableCourses() {
	return useQuery<Course[]>({
		queryKey: ["courses"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("courses")
				.select("*, course_holes(*)")
				.order("name", { ascending: true });

			if (error) throw error;
			return data as Course[];
		},
	});
}
