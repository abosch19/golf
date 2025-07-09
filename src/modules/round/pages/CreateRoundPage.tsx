import { CalendarDays, MapPin, Plus, Trash } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Loading } from "@/components/layouts/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Course } from "@/types/courses";
import { RouteBuilder } from "@/utils/paths";
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
		id: Math.random().toString(36).substr(2, 9),
		player_id: playerId,
		player_name: "",
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

	const timeId = useId();

	const handleCourseSelect = (course: Course) => {
		setFormData((prev) => ({ ...prev, course_id: course.id }));
	};

	const handleAddScore = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		setFormData((prev) => ({
			...prev,
			round_scores: [
				...prev.round_scores,
				createRoundScore(
					"",
					formData.course_id,
					courses?.find((c) => c.id === formData.course_id)?.course_holes
						?.length || 0,
				),
			],
		}));
	};

	const removeScore = (scoreId: string) => {
		setFormData((prev) => ({
			...prev,
			round_scores: prev.round_scores.filter((rs) => rs.id !== scoreId),
		}));
	};

	const handleHoleScoreChange = (
		scoreId: string,
		holeNumber: number,
		score: number,
		index: number,
	) => {
		setFormData((prev) => {
			const roundScore = prev.round_scores.find((rs) => rs.id === scoreId);
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

	const handlePlayerSelect = (roundScoreId: string, playerId: string) => {
		setFormData((prev) => ({
			...prev,
			round_scores: prev.round_scores.map((rs) =>
				rs.id === roundScoreId
					? {
							...rs,
							player_id: playerId,
							player_name:
								availablePlayers
									?.find((p) => p.id === playerId)
									?.first_name.charAt(0) +
								"." +
								availablePlayers?.find((p) => p.id === playerId)?.last_name,
						}
					: rs,
			),
		}));
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

	const courseHoles =
		courses
			.find((c) => c.id === formData.course_id)
			?.course_holes?.sort((a, b) => a.hole_number - b.hole_number) || [];

	const fileterdAvailablePlayers = availablePlayers.filter(
		(player) => !formData.round_scores.some((rs) => rs.player_id === player.id),
	);

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
											played_at: e.target.value,
										}))
									}
									required
								/>
							</div>
						</CardContent>
					</Card>

					{/* Hole-by-Hole Scoring */}
					{formData.course_id && (
						<Card>
							<CardHeader>
								<CardTitle>Hole-by-Hole Scoring</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="overflow-x-auto">
									<table className="w-full border-collapse">
										{formData.round_scores.length > 0 && (
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
										)}
										<tbody>
											{formData.round_scores.map((rs, index) => {
												const totalScore = rs.round_score_holes.reduce(
													(sum, rsh) => sum + rsh.gross_score,
													0,
												);

												return (
													<tr key={rs.id} className="border-b border-gray-100">
														<td className="p-2">
															<div className="flex items-center gap-2">
																<Select
																	onValueChange={(playerId) =>
																		handlePlayerSelect(rs.id, playerId)
																	}
																>
																	<SelectTrigger>
																		<SelectValue>{rs.player_name}</SelectValue>
																	</SelectTrigger>
																	<SelectContent>
																		{fileterdAvailablePlayers.map((player) => (
																			<SelectItem
																				key={player.id}
																				value={player.id}
																			>
																				{player.first_name} {player.last_name}
																			</SelectItem>
																		))}
																	</SelectContent>
																</Select>
																<Button
																	variant="ghost"
																	onClick={() => removeScore(rs.id)}
																>
																	<Trash className="w-4 h-4" />
																</Button>
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
																			rs.id,
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
									<Button
										variant="outline"
										className="my-4"
										onClick={handleAddScore}
									>
										<Plus className="w-4 h-4" />
										Add Score
									</Button>
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
