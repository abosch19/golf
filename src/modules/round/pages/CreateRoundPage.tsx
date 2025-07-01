import { CalendarDays, MapPin, Minus, Plus, Users } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Loading } from "@/components/layouts/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Course } from "@/types/courses";
import type { Player } from "@/types/player";
import { RouteBuilder } from "@/utils/paths";
import { getPlayerColor } from "@/utils/player";
import { usePrompt } from "@/utils/usePrompt";
import { useAvailableCourses } from "../hooks/useAvailableCourses";
import { useAvailablePlayers } from "../hooks/useAvailablePlayers";
import {
	type CreateRoundFormData,
	useCreateRound,
} from "../hooks/useCreateRound";

const createRoundScore = (
	playerId: string,
	courseId: string,
	courseHoles: number,
) => {
	return {
		player_id: playerId,
		gross_score: 0,
		round_score_holes: [...Array(courseHoles)].map((_, index) => ({
			hole_number: index + 1,
			gross_score: 0,
			course_id: courseId,
		})),
	};
};

export function CreateRoundPage() {
	const navigate = useNavigate();
	const { data: availablePlayers, isLoading: playersLoading } =
		useAvailablePlayers();
	const { data: courses, isLoading: coursesLoading } = useAvailableCourses();
	const createRoundMutation = useCreateRound();
	const holesInputRef = useRef<(HTMLInputElement | null)[]>([]);

	const [formData, setFormData] = useState<CreateRoundFormData>({
		course_id: "",
		played_at: new Date().toISOString().slice(0, 16),
		round_scores: [],
	});
	const [showAllPlayers, setShowAllPlayers] = useState(false);

	const timeId = useId();

	const handleCourseSelect = (course: Course) => {
		setFormData((prev) => ({ ...prev, course_id: course.id }));
	};

	const handlePlayerToggle = (playerId: string) => {
		setFormData((prev) => {
			const isSelected = prev.round_scores.some(
				(rs) => rs.player_id === playerId,
			);

			if (isSelected) {
				// Remove player and their hole scores
				return {
					...prev,
					round_scores: prev.round_scores.filter(
						(rs) => rs.player_id !== playerId,
					),
				};
			} else {
				const newRoundScore = createRoundScore(
					playerId,
					formData.course_id,
					courses?.find((c) => c.id === formData.course_id)?.course_holes
						?.length || 0,
				);

				return {
					...prev,
					round_scores: [...prev.round_scores, newRoundScore],
				};
			}
		});
	};

	const handleHoleScoreChange = (
		playerId: string,
		holeNumber: number,
		score: number,
		index: number,
	) => {
		setFormData((prev) => {
			const roundScore = prev.round_scores.find(
				(rs) => rs.player_id === playerId,
			);
			if (!roundScore) return prev;
			const holeScore = roundScore.round_score_holes.find(
				(rsh) => rsh.hole_number === holeNumber,
			);
			if (!holeScore) return prev;

			holeScore.gross_score = score;
			return {
				...prev,
				round_scores: [...prev.round_scores],
			};
		});

		holesInputRef.current[index + 1]?.focus();
	};

	const getPlayerTotalScore = (playerId: string) => {
		return (
			formData.round_scores
				.find((rs) => rs.player_id === playerId)
				?.round_score_holes.reduce((sum, rsh) => sum + rsh.gross_score, 0) || 0
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		formData.round_scores.forEach((rs) => {
			rs.gross_score = rs.round_score_holes.reduce(
				(sum, rsh) => sum + rsh.gross_score,
				0,
			);
		});

		if (!formData.course_id || formData.round_scores.length === 0) {
			alert("Please select a course and at least one player");
			return;
		}

		// Validate that all hole scores are greater than 0
		const invalidScores = formData.round_scores.filter(
			(rs) => rs.gross_score <= 0,
		);
		if (invalidScores.length > 0) {
			alert("Please enter valid scores (greater than 0) for all holes");
			return;
		}

		try {
			await createRoundMutation.mutateAsync(formData);
			navigate(RouteBuilder.home());
		} catch (error) {
			console.error("Failed to create round:", error);
			alert("Failed to create round. Please try again.");
		}
	};

	if (playersLoading || coursesLoading || createRoundMutation.isPending) {
		return <Loading />;
	}

	if (!availablePlayers || !courses) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
					<p className="text-gray-600">
						Failed to load data. Please try again.
					</p>
				</div>
			</div>
		);
	}

	// Display only first 10 players initially, or all if showAllPlayers is true
	const displayedPlayers = showAllPlayers
		? availablePlayers
		: availablePlayers.slice(0, 10);
	const courseHoles =
		courses
			.find((c) => c.id === formData.course_id)
			?.course_holes?.sort((a, b) => a.hole_number - b.hole_number) || [];

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
			<div className="container p-6 mx-auto max-w-7xl">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-800 mb-2">
						Create New Round
					</h1>
					<p className="text-gray-600">
						Set up a new golf round with course, date, and hole-by-hole scores
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-8">
					{/* Course Selection */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<MapPin className="w-5 h-5" />
								Select Course
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{courses.map((course) => (
									<button
										key={course.id}
										type="button"
										onClick={() => handleCourseSelect(course)}
										className={`p-4 rounded-lg border-2 text-left transition-all ${
											formData.course_id === course.id
												? "border-green-500 bg-green-50"
												: "border-gray-200 hover:border-gray-300 bg-white"
										}`}
									>
										<div className="flex justify-between items-start mb-2">
											<h3 className="font-semibold text-gray-800">
												{course.name}
											</h3>
											<span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
												Par {course.par}
											</span>
										</div>
										<p className="text-sm text-gray-600">
											{course.course_holes?.length || 18} holes
										</p>
									</button>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Date and Time */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<CalendarDays className="w-5 h-5" />
								Date & Time
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<label
									htmlFor={timeId}
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Played At
								</label>
								<Input
									id={timeId}
									type="datetime-local"
									className="w-auto"
									value={formData.played_at}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											playedAt: e.target.value,
										}))
									}
									required
								/>
							</div>
						</CardContent>
					</Card>

					{/* Player Selection */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Users className="w-5 h-5" />
								Select Players ({formData.round_scores.length} selected)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{displayedPlayers.map((player: Player) => {
									const isSelected = formData.round_scores.some(
										(rs) => rs.player_id === player.id,
									);
									const playerColor = getPlayerColor(player.first_name);
									const totalScore = getPlayerTotalScore(player.id);

									return (
										<button
											key={player.id}
											type="button"
											disabled={!formData.course_id}
											onClick={() => handlePlayerToggle(player.id)}
											className={`p-4 rounded-lg border-2 text-left transition-all ${
												isSelected
													? "border-green-500 bg-green-50"
													: "border-gray-200 hover:border-gray-300 bg-white"
											}
											${!formData.course_id ? "opacity-50 cursor-not-allowed" : ""}`}
										>
											<div className="flex items-center gap-3 mb-2">
												<div
													className={`w-10 h-10 rounded-full flex items-center justify-center ${playerColor.bgColor}`}
												>
													<span
														className={`font-bold text-sm ${playerColor.textColor}`}
													>
														{player.first_name?.charAt(0) || "P"}
													</span>
												</div>
												<div className="flex-1">
													<p className="font-semibold text-gray-800">
														{player.first_name} {player.last_name}
													</p>
													<p className="text-sm text-gray-500">
														{player.nationality}
													</p>
												</div>
											</div>
											{isSelected && (
												<div className="text-right">
													<p className="text-sm text-gray-600">
														Total: {totalScore}
													</p>
												</div>
											)}
										</button>
									);
								})}
							</div>

							{availablePlayers.length > 10 && (
								<div className="mt-4 flex justify-center">
									<Button
										type="button"
										variant="outline"
										onClick={() => setShowAllPlayers(!showAllPlayers)}
										className="flex items-center gap-2"
									>
										{showAllPlayers ? (
											<Minus className="w-4 h-4" />
										) : (
											<Plus className="w-4 h-4" />
										)}
										{showAllPlayers
											? "Show Less"
											: `Show All ${availablePlayers.length} Players`}
									</Button>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Hole-by-Hole Scoring */}
					{formData.course_id && formData.round_scores.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle>Hole-by-Hole Scoring</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="overflow-x-auto">
									<table className="w-full border-collapse">
										<thead>
											<tr className="border-b border-gray-200">
												<th className="text-left p-2 font-semibold text-gray-700">
													Player
												</th>
												{courseHoles.map((hole) => (
													<th
														key={hole.hole_number}
														className="text-center p-2 font-semibold text-gray-700 min-w-16"
													>
														<div>H{hole.hole_number}</div>
														<div className="text-xs text-gray-500">
															Par {hole.par}
														</div>
													</th>
												))}
												<th className="text-center p-2 font-semibold text-gray-700">
													Total
												</th>
											</tr>
										</thead>
										<tbody>
											{formData.round_scores.map((rs, index) => {
												const player = availablePlayers.find(
													(p) => p.id === rs.player_id,
												);
												if (!player) return null;

												const playerColor = getPlayerColor(player.first_name);
												const totalScore = getPlayerTotalScore(rs.player_id);

												return (
													<tr
														key={rs.player_id}
														className="border-b border-gray-100"
													>
														<td className="p-2">
															<div className="flex items-center gap-2">
																<div
																	className={`w-8 h-8 rounded-full flex items-center justify-center ${playerColor.bgColor}`}
																>
																	<span
																		className={`font-bold text-xs ${playerColor.textColor}`}
																	>
																		{player.first_name?.charAt(0) || "P"}
																	</span>
																</div>
																<div>
																	<p className="font-medium text-sm">
																		{player.first_name} {player.last_name}
																	</p>
																</div>
															</div>
														</td>
														{rs.round_score_holes.map((hole) => (
															<td key={hole.hole_number} className="p-1">
																<Input
																	type="number"
																	min="1"
																	max="20"
																	ref={(el) => {
																		if (el) {
																			holesInputRef.current[
																				courseHoles.length * index +
																					hole.hole_number -
																					1
																			] = el;
																		}
																	}}
																	value={hole.gross_score}
																	onChange={(e) =>
																		handleHoleScoreChange(
																			rs.player_id,
																			hole.hole_number,
																			parseInt(e.target.value) || 0,
																			courseHoles.length * index +
																				hole.hole_number -
																				1,
																		)
																	}
																	className="w-16 h-8 text-center text-sm"
																	required
																/>
															</td>
														))}
														<td className="p-2 text-center font-semibold text-green-600">
															{totalScore}
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Submit Button */}
					<div className="flex gap-4 justify-end">
						<Button
							asChild
							variant="outline"
							disabled={createRoundMutation.isPending}
						>
							<Link to={RouteBuilder.home()}>Cancel</Link>
						</Button>
						<Button
							type="submit"
							disabled={
								!formData.course_id ||
								formData.round_scores.length === 0 ||
								createRoundMutation.isPending
							}
							className="min-w-24"
						>
							{createRoundMutation.isPending ? "Creating..." : "Create Round"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
