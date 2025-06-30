import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CourseHole } from "@/types/courses";
import type { Round } from "@/types/rounds";
import { PathsBuilder } from "@/utils/paths";

export function RoundCard({ round }: { round: Round }) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

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
				<div className="w-6 h-6 border-2 border-black rounded-full flex items-center justify-center">
					<span className="text-sm font-semibold text-gray-800">
						{grossScore}
					</span>
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
				<div className="w-6 h-6 border-2 border-black rounded-sm flex items-center justify-center relative">
					<span className="text-sm font-semibold text-gray-800">
						{grossScore}
					</span>
					<div className="absolute inset-0 border border-black rounded-sm transform scale-75"></div>
				</div>
			);
		}

		// Par or better - no wrapper, just the score
		return (
			<span className="text-sm font-semibold text-gray-800">{grossScore}</span>
		);
	};

	return (
		<Card
			key={round.id}
			className="shadow-lg hover:shadow-xl transition-shadow duration-300 pt-0"
		>
			<CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg py-2">
				<div className="flex justify-between items-center">
					<div>
						<CardTitle className="text-2xl font-bold">
							{round.course.name}
						</CardTitle>
						<p className="text-green-100 mt-1">{formatDate(round.played_at)}</p>
					</div>
					<Badge
						variant="secondary"
						className="bg-white text-green-700 font-semibold"
					>
						{round.round_scores.length} Player
						{round.round_scores.length !== 1 ? "s" : ""}
					</Badge>
				</div>
			</CardHeader>

			<CardContent className="p-6">
				<div className="grid gap-4">
					{round.round_scores.map((score) => (
						<div
							key={score.id}
							className="border border-gray-200 rounded-lg p-4 bg-white"
						>
							<div className="flex justify-between items-center mb-3">
								<div className="flex items-center gap-3">
									<Link
										to={PathsBuilder.player(score.player.id)}
										className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
									>
										<span className="text-green-700 font-bold text-sm">
											{score.player.first_name?.charAt(0) || "P"}
										</span>
									</Link>
									<div>
										<Link
											to={PathsBuilder.player(score.player.id)}
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
											{calculateOverParSum(round.course.par, score.gross_score)}
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
									<div
										key={score.id + hole.hole_number}
										className="text-center"
									>
										<div className="text-xs text-gray-500">
											Hole {hole.hole_number}
										</div>
										<div className="flex items-center justify-center">
											{getScoreIndicator(hole.gross_score, hole.course_hole)}
										</div>
									</div>
								))}
							</div>

							{score.holes.length > 9 && (
								<div className="grid grid-cols-9 gap-1 mt-2">
									{score.holes.slice(9, 18).map((hole) => (
										<div
											key={score.id + hole.hole_number}
											className="text-center"
										>
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
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
