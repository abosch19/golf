import { useEffect, useState } from "react";
import { usePlayerContext } from "./modules/player/context/PlayerContext";
import type { Course } from "./types/courses";
import supabase from "./utils/supabase";

function App() {
	const player = usePlayerContext();
	const [courses, setCourses] = useState<Course[]>([]);

	useEffect(() => {
		supabase
			.from("courses")
			.select("*")
			.then(({ data, error }) => {
				if (error) {
					console.error(error);
				} else {
					setCourses(data as Course[]);
				}
			});
	}, []);

	return (
		<>
			<h1>
				Hello {player.first_name} {player.last_name} from {player.nationality}
			</h1>
			<h2>Your courses</h2>
			{courses.map((course: Course) => (
				<div key={course.id}>
					<h1>{course.name}</h1>
					<img
						src={course.picture_url}
						width={100}
						height={100}
						alt={course.name}
					/>
				</div>
			))}
		</>
	);
}

export default App;
