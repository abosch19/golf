import { Card, CardContent } from "@/components/ui/card";

export function NoRoundsAvailable() {
	return (
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
	);
}
