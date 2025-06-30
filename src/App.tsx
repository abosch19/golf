import { useEffect, useState } from "react";
import { usePlayerContext } from "./modules/player/context/PlayerContext";
import type { Course, CourseHole } from "./types/courses";
import supabase from "./utils/supabase";

function App() {
	const player = usePlayerContext();
	const [courses, setCourses] = useState<Course[]>([]);

	useEffect(() => {
		supabase
			.from("courses")
			.select("*, course_holes(*)")
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
					<h2>Holes</h2>
					{course.course_holes.map((hole: CourseHole) => (
						<div key={`${hole.course_id}-${hole.hole_number}`}>
							<h3>
								{hole.hole_number} - {hole.par} - {hole.stroke_index} -{" "}
								{hole.distance}
							</h3>
						</div>
					))}
				</div>
			))}
		</>
	);
}

export default App;
