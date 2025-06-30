import type { Course, CourseHole } from "./courses";
import type { Player } from "./player";

interface RoundScoreHole {
	round_score_id: string;
	hole_number: number;
	gross_score: number;
	course_hole: CourseHole;
}

interface RoundScore {
	id: string;
	round_id: string;
	player_id: string;
	player: Player;
	gross_score: number;
	holes: RoundScoreHole[];
}

interface Round {
	id: string;
	course_id: string;
	date: string;
	played_at: string;
	course: Course & { course_holes: CourseHole[] };
	round_scores: RoundScore[];
}

export type { Round, RoundScore, RoundScoreHole };
