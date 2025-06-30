interface Course {
	id: string;
	name: string;
	par: number;
	picture_url: string;
	course_holes: CourseHole[];
}

interface CourseHole {
	course_id: string;
	hole_number: number;
	par: number;
	stroke_index: number;
	distance: number;
}

export type { Course, CourseHole };
