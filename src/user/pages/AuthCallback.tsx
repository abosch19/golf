import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Paths } from "@/utils/paths";
import supabase from "@/utils/supabase";

export function AuthCallback() {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const handleAuthCallback = async () => {
			try {
				const { data, error } = await supabase.auth.getSession();

				if (error) {
					setError(error.message);
					return;
				}

				if (data.session) {
					navigate(Paths.HOME);
				} else {
					navigate(Paths.LOGIN);
				}
			} catch (err) {
				setError("An unexpected error occurred");
			} finally {
				setIsLoading(false);
			}
		};

		handleAuthCallback();
	}, [navigate]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<svg
						className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					<p className="text-gray-600">Verifying your login...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="max-w-md w-full space-y-8">
					<div className="text-center">
						<svg
							className="h-12 w-12 text-red-500 mx-auto mb-4"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
								clipRule="evenodd"
							/>
						</svg>
						<h2 className="text-2xl font-bold text-gray-900 mb-2">
							Authentication Error
						</h2>
						<p className="text-gray-600 mb-6">{error}</p>
						<button
							type="button"
							onClick={() => navigate("/login")}
							className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						>
							Back to Login
						</button>
					</div>
				</div>
			</div>
		);
	}

	return null;
}
