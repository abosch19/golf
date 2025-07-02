import { Link } from "react-router";
import { GenericError } from "@/components/layouts/GenericError";
import { Loading } from "@/components/layouts/Loading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Player } from "@/types/player";
import type { RoundScore } from "@/types/rounds";
import { RouteBuilder } from "@/utils/paths";
import { usePlayers } from "../hooks/usePlayers";

// Type for player object returned from the query
interface PlayerWithScores extends Player {
	round_scores?: (RoundScore & { rounds?: any })[];
}

export function PlayersPage() {
	const playersQuery = usePlayers();

	if (playersQuery.isLoading) return <Loading />;
	if (playersQuery.error || !playersQuery.data) return <GenericError />;

	const players = playersQuery.data as PlayerWithScores[];

	// Calculate stats for each player
	const playersWithStats = players.map((player: PlayerWithScores) => {
		const roundScores: (RoundScore & { rounds?: any })[] =
			player.round_scores || [];
		const totalRounds = roundScores.length;
		const totalScore = roundScores.reduce(
			(sum: number, score: RoundScore) => sum + score.gross_score,
			0,
		);
		const averageScore =
			totalRounds > 0 ? Math.round(totalScore / totalRounds) : 0;
		const bestScore =
			totalRounds > 0
				? Math.min(...roundScores.map((score: RoundScore) => score.gross_score))
				: 0;
		const worstScore =
			totalRounds > 0
				? Math.max(...roundScores.map((score: RoundScore) => score.gross_score))
				: 0;

		// Get most recent round
		const recentRound =
			roundScores.length > 0
				? roundScores.reduce((latest, current) => {
						const latestDate = new Date(
							latest.rounds?.played_at || 0,
						).getTime();
						const currentDate = new Date(
							current.rounds?.played_at || 0,
						).getTime();
						return currentDate > latestDate ? current : latest;
					}, roundScores[0])
				: null;

		return {
			...player,
			stats: {
				totalRounds,
				averageScore,
				bestScore,
				worstScore,
				recentRound,
			},
		};
	});

	// Sort players by average score (best first)
	const sortedPlayers = playersWithStats.sort((a: any, b: any) => {
		if (a.stats.totalRounds === 0 && b.stats.totalRounds === 0) return 0;
		if (a.stats.totalRounds === 0) return 1;
		if (b.stats.totalRounds === 0) return -1;
		return a.stats.averageScore - b.stats.averageScore;
	});

	return (
		<div className="flex-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
			<div className="container mx-auto p-6">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
						Players
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						View all players and their golf statistics
					</p>
				</div>

				<div className="flex flex-col gap-3">
					{sortedPlayers.map((player: any) => (
						<Link key={player.id} to={RouteBuilder.player(player.id)}>
							<Card className="hover:shadow-lg transition-shadow px-3 text-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/50">
								<CardHeader>
									<div className="flex items-start justify-between gap-5">
										<div className="flex-1">
											<CardTitle className="text-base">
												{player.first_name} {player.last_name}
											</CardTitle>
											<Badge
												variant="secondary"
												className="mt-1 text-xs px-1.5 py-0.5"
											>
												{player.nationality}
											</Badge>
										</div>
										<div className="flex flex-3 flex-row gap-6 justify-center">
											<div className="text-center">
												<div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
													{player.stats.averageScore}
												</div>
												<div className="text-sm text-gray-500 dark:text-gray-400">
													Avg Score
												</div>
											</div>
											<div className="text-center">
												<div className="text-2xl font-bold text-green-600 dark:text-green-400">
													{player.stats.bestScore}
												</div>
												<div className="text-sm text-gray-500 dark:text-gray-400">
													Best Score
												</div>
											</div>
											<div className="text-center">
												<div className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
													{player.stats.totalRounds}
												</div>
												<div className="text-sm text-gray-500 dark:text-gray-400">
													Rounds Played
												</div>
											</div>
											<div className="text-center">
												<div className="text-2xl font-semibold text-red-600 dark:text-red-400">
													{player.stats.worstScore}
												</div>
												<div className="text-sm text-gray-500 dark:text-gray-400">
													Worst Score
												</div>
											</div>
											<div className="text-center">
												<div
													className={`text-2xl font-semibold ${
														player.p_and_p_handicap
															? "text-green-600 dark:text-green-400"
															: "text-gray-500 dark:text-gray-400"
													}`}
												>
													{player.p_and_p_handicap ?? "N/A"}
												</div>
												<div className="text-sm text-gray-500 dark:text-gray-400">
													Handicap
												</div>
											</div>
										</div>

										{player.stats.totalRounds > 0 && (
											<Badge
												variant="default"
												className="flex-1text-xs px-1.5 py-0.5"
											>
												#
												{sortedPlayers.findIndex(
													(p: any) => p.id === player.id,
												) + 1}
											</Badge>
										)}
									</div>
								</CardHeader>

								<CardContent>
									{player.stats.totalRounds > 0 ? (
										<div>
											{player.stats.recentRound && (
												<div className="pt-1 border-t border-gray-200 dark:border-gray-700">
													<div className="text-xs text-gray-600 dark:text-gray-400">
														Last played:{" "}
														{new Date(
															player.stats.recentRound.rounds?.played_at || "",
														).toLocaleDateString()}
													</div>
													{player.stats.recentRound.rounds?.course && (
														<div className="text-xs text-gray-600 dark:text-gray-400">
															at {player.stats.recentRound.rounds.course.name}
														</div>
													)}
												</div>
											)}
										</div>
									) : (
										<div className="text-center py-4">
											<div className="text-gray-400 dark:text-gray-500 text-base mb-1">
												No rounds played yet
											</div>
											<div className="text-xs text-gray-500 dark:text-gray-400">
												This player hasn't recorded any rounds
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						</Link>
					))}
				</div>

				{players.length === 0 && (
					<div className="text-center py-12">
						<div className="text-gray-400 dark:text-gray-500 text-xl mb-2">
							No players found
						</div>
						<div className="text-sm text-gray-500 dark:text-gray-400">
							There are no players in the system yet
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
