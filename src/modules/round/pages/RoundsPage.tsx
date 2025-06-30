import { Loading } from "@/components/layouts/Loading";
import { Badge } from "@/components/ui/badge";
import type { CourseHole } from "@/types/courses";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../../components/ui/card";
import { useRounds } from "../hooks/useRounds";

export function RoundsPage() {
	const roundsQuery = useRounds();

	if (roundsQuery.isLoading) {
		return <Loading />;
	}

	if (roundsQuery.error || !roundsQuery.data) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
					<p className="text-gray-600">{roundsQuery.error?.message}</p>
				</div>
			</div>
		);
	}

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
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
			<div className="max-w-6xl mx-auto">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-800 mb-2">Golf Rounds</h1>
					<p className="text-gray-600">Track your golfing journey and scores</p>
				</div>

				<div className="grid gap-6">
					{roundsQuery.data.map((round) => (
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
										<p className="text-green-100 mt-1">
											{formatDate(round.played_at)}
										</p>
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
													<div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
														<span className="text-green-700 font-bold text-sm">
															{score.player.first_name?.charAt(0) || "P"}
														</span>
													</div>
													<div>
														<h3 className="font-semibold text-gray-800">
															{`${score.player.first_name} ${score.player.last_name}`}
														</h3>
														<p className="text-sm text-gray-500">
															{score.holes.length} holes played
														</p>
													</div>
												</div>
												<div className="text-right">
													<p className="text-sm text-gray-500">Total Strokes</p>
													<p className="text-2xl font-bold text-green-600">
														<span className="text-sm text-gray-500 mr-2">
															{calculateOverParSum(
																round.course.par,
																score.gross_score,
															)}
														</span>
														{score.gross_score}
													</p>
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
															{getScoreIndicator(
																hole.gross_score,
																hole.course_hole,
															)}
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
																{getScoreIndicator(
																	hole.gross_score,
																	hole.course_hole,
																)}
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
					))}
				</div>

				{roundsQuery.data.length === 0 && (
					<Card className="text-center py-12">
						<CardContent>
							<div className="text-gray-400 mb-4">
								<svg
									className="w-16 h-16 mx-auto"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
									role="img"
								>
									<title>No rounds available</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-gray-600 mb-2">
								No Rounds Yet
							</h3>
							<p className="text-gray-500">
								Start playing golf to see your rounds here!
							</p>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
