import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PathsBuilder } from "@/utils/paths";

export function PlayerNotFound() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-6">
			<Card className="max-w-md w-full shadow-xl">
				<CardContent className="p-8 text-center">
					{/* Icon */}
					<div className="mb-6">
						<div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg
								className="w-10 h-10 text-red-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<title>Player not found</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
								/>
							</svg>
						</div>
					</div>

					{/* Content */}
					<h2 className="text-2xl font-bold text-gray-800 mb-3">
						Player Not Found
					</h2>
					<p className="text-gray-600 mb-6 leading-relaxed">
						Sorry, we couldn't find the player you're looking for. They might
						not exist in our database or the link might be incorrect.
					</p>

					{/* Actions */}
					<div className="space-y-3">
						<Button
							asChild
							className="w-full bg-green-600 hover:bg-green-700 text-white"
						>
							<Link to={PathsBuilder.home()}>
								<svg
									className="w-4 h-4 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Home icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
									/>
								</svg>
								Go to Home
							</Link>
						</Button>

						<Button variant="outline" asChild className="w-full">
							<Link to="/players">
								<svg
									className="w-4 h-4 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Users icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
								Browse Players
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
