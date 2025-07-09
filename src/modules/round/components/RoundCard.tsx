import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Round } from "@/types/rounds";
import { ScoreCard } from "./ScoreCard";

export function RoundCard({ round }: { round: Round }) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const scoresSorted = round.round_scores.sort(
		(a, b) => a.gross_score - b.gross_score,
	);

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
					{scoresSorted.map((score) => (
						<ScoreCard key={score.id} score={score} course={round.course} />
					))}
				</div>
			</CardContent>
		</Card>
	);
}
