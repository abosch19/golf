import { Link } from "react-router";
import type { Course, CourseHole } from "@/types/courses";
import type { RoundScore } from "@/types/rounds";
import { RouteBuilder } from "@/utils/paths";
import { getPlayerColor } from "@/utils/player";

interface ScoreCardProps {
	score: RoundScore;
	course: Course;
}

export function ScoreCard({ score, course }: ScoreCardProps) {
	const calculateOverParSum = (coursePar: number, grossScore: number) => {
		const overPar = grossScore - coursePar;
		return overPar > 0 ? `+${overPar}` : overPar;
	};

	const getScoreIndicator = (grossScore: number, courseHole: CourseHole) => {
		const par = courseHole.par;
		const relativeToPar = grossScore - par;

		if (relativeToPar === -1) {
			// Birdie - circle
			return (
				<div className="w-6 h-6 border-2 border-black rounded-full flex items-center justify-center bg-black">
					<span className="text-sm font-semibold text-white">{grossScore}</span>
				</div>
			);
		} else if (relativeToPar === 1) {
			// Bogey - square
			return (
				<div className="w-6 h-6 border-2 border-black rounded-sm flex items-center justify-center">
					<span className="text-sm font-semibold text-gray-800">
						{grossScore}
					</span>
				</div>
			);
		} else if (relativeToPar >= 2) {
			// Double bogey or worse - double square
			return (
				<div className="w-7 h-7 border-2 border-black rounded-sm flex items-center justify-center relative">
					<span className="text-sm font-semibold text-gray-800">
						{grossScore}
					</span>
					<div className="absolute w-5 h-5 inset-0 border-black border-2 rounded-xs translate-x-[10%] translate-y-[10%]"></div>
				</div>
			);
		}

		// Par or better - no wrapper, just the score
		return (
			<span className="text-sm font-semibold text-gray-800">{grossScore}</span>
		);
	};

	const playerColor = getPlayerColor(score.player.first_name);

	return (
		<Link
			to={RouteBuilder.round(score.id)}
			key={score.id}
			className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow duration-300"
		>
			<div className="flex justify-between items-center mb-3">
				<div className="flex items-center gap-3">
					<Link
						to={RouteBuilder.player(score.player.id)}
						className={`w-10 h-10 rounded-full flex items-center justify-center ${playerColor.bgColor}`}
					>
						<span className={`font-bold text-sm ${playerColor.textColor}`}>
							{score.player.first_name?.charAt(0) || "P"}
						</span>
					</Link>
					<div>
						<Link
							to={RouteBuilder.player(score.player.id)}
							className="font-semibold text-gray-800"
						>
							{`${score.player.first_name} ${score.player.last_name}`}
						</Link>
						<p className="text-sm text-gray-500">
							{score.holes.length} holes played
						</p>
					</div>
				</div>
				<div className="text-right">
					<p className="text-sm text-gray-500">Total Strokes</p>
					<div className="flex items-center justify-end">
						<p className="text-sm text-gray-500 mr-2">
							{calculateOverParSum(course.par, score.gross_score)}
						</p>
						<p className="text-2xl font-bold text-green-600">
							{score.gross_score}
						</p>
					</div>
				</div>
			</div>

			{/* Hole-by-hole breakdown */}
			<div className="grid grid-cols-9 gap-1 mt-3">
				{score.holes.slice(0, 9).map((hole) => (
					<div key={score.id + hole.hole_number} className="text-center">
						<div className="text-xs text-gray-500">Hole {hole.hole_number}</div>
						<div className="flex items-center justify-center">
							{getScoreIndicator(hole.gross_score, hole.course_hole)}
						</div>
					</div>
				))}
			</div>

			{score.holes.length > 9 && (
				<div className="grid grid-cols-9 gap-1 mt-2">
					{score.holes.slice(9, 18).map((hole) => (
						<div key={score.id + hole.hole_number} className="text-center">
							<div className="text-xs text-gray-500">
								Hole {hole.hole_number}
							</div>
							<div className="flex items-center justify-center">
								{getScoreIndicator(hole.gross_score, hole.course_hole)}
							</div>
						</div>
					))}
				</div>
			)}
		</Link>
	);
}
