import { Plus } from "lucide-react";
import { Link } from "react-router";
import { Loading } from "@/components/layouts/Loading";
import { Button } from "@/components/ui/button";
import { RouteBuilder } from "@/utils/paths";
import { NoRoundsAvailable } from "../components/NoRoundsAvailable";
import { RoundCard } from "../components/RoundCard";
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

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
			<div className="container p-6 mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-800 mb-2">Golf Rounds</h1>
					<p className="text-gray-600">Track your golfing journey and scores</p>
				</div>

				<div className="grid gap-6">
					{roundsQuery.data.map((round) => (
						<RoundCard key={round.id} round={round} />
					))}
				</div>

				{roundsQuery.data.length === 0 && <NoRoundsAvailable />}
			</div>
			<div className="fixed bottom-10 right-10">
				<Button asChild>
					<Link to={RouteBuilder.roundAdd()}>
						<Plus className="w-6 h-6" />
						<p className="hidden md:block">Add Round</p>
					</Link>
				</Button>
			</div>
		</div>
	);
}
