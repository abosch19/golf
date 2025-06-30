import { useParams } from "react-router";
import { Loading } from "@/components/layouts/Loading";
import { Card, CardContent } from "@/components/ui/card";
import { NoRoundsAvailable } from "@/modules/round/components/NoRoundsAvailable";
import { RoundCard } from "@/modules/round/components/RoundCard";
import type { Round, RoundScore } from "@/types/rounds";
import { PlayerNotFound } from "../components/PlayerNotFound";
import { usePlayer } from "../hooks/usePlayer";

export function PlayerPage() {
	const { playerId } = useParams();
	const playerQuery = usePlayer(playerId ?? "");

	if (playerQuery.isLoading) return <Loading />;
	if (playerQuery.error || !playerQuery.data) return <PlayerNotFound />;

	const player = playerQuery.data;
	const rounds: RoundScore[] = player.round_scores || [];

	const calculatePlayerStats = () => {
		if (rounds.length === 0) return null;

		const totalRounds = rounds.length;
		const totalStrokes = rounds.reduce(
			(sum: number, round: RoundScore) => sum + round.gross_score,
			0,
		);
		const averageScore = Math.round(totalStrokes / totalRounds);
		const bestScore = Math.min(
			...rounds.map((round: RoundScore) => round.gross_score),
		);
		const worstScore = Math.max(
			...rounds.map((round: RoundScore) => round.gross_score),
		);

		return { totalRounds, averageScore, bestScore, worstScore };
	};

	const stats = calculatePlayerStats();

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
			<div className="max-w-6xl mx-auto">
				{/* Player Header */}
				<div className="mb-8">
					<div className="flex items-center gap-6 mb-4">
						<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
							<span className="text-green-700 font-bold text-2xl">
								{player.first_name?.charAt(0) || "P"}
							</span>
						</div>
						<div>
							<h1 className="text-4xl font-bold text-gray-800 mb-2">
								{player.first_name} {player.last_name}
							</h1>
							<p className="text-gray-600 text-lg">
								{player.nationality} •{" "}
								{new Date(player.birthdate).getFullYear()}
							</p>
						</div>
					</div>

					{/* Player Stats */}
					{stats && (
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
							<Card className="text-center">
								<CardContent className="p-4">
									<div className="text-2xl font-bold text-green-600">
										{stats.totalRounds}
									</div>
									<div className="text-sm text-gray-500">Total Rounds</div>
								</CardContent>
							</Card>
							<Card className="text-center">
								<CardContent className="p-4">
									<div className="text-2xl font-bold text-blue-600">
										{stats.averageScore}
									</div>
									<div className="text-sm text-gray-500">Average Score</div>
								</CardContent>
							</Card>
							<Card className="text-center">
								<CardContent className="p-4">
									<div className="text-2xl font-bold text-green-600">
										{stats.bestScore}
									</div>
									<div className="text-sm text-gray-500">Best Score</div>
								</CardContent>
							</Card>
							<Card className="text-center">
								<CardContent className="p-4">
									<div className="text-2xl font-bold text-red-600">
										{stats.worstScore}
									</div>
									<div className="text-sm text-gray-500">Worst Score</div>
								</CardContent>
							</Card>
						</div>
					)}
				</div>

				{/* Rounds Section */}
				<div className="mb-6">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">Golf Rounds</h2>

					{rounds.length === 0 ? (
						<NoRoundsAvailable />
					) : null
					// <div className="grid gap-6">
					// 	{rounds.map((roundScore: Round) => (
					// 		<RoundCard key={roundScore.id} round={roundScore} />
					// 	))}
					// </div>
					}
				</div>
			</div>
		</div>
	);
}
