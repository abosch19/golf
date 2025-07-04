import { useId, useState } from "react";
import supabase from "@/utils/supabase";

interface EmailFormProps {
	onSubmit: (email: string) => void;
}

export function EmailForm({ onSubmit }: EmailFormProps) {
	const [email, setEmail] = useState("");
	const emailId = useId();
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setMessage(null);

		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				shouldCreateUser: true,
			},
		});

		if (error) {
			setMessage({ type: "error", text: error.message });
		} else {
			onSubmit(email);
			setMessage({
				type: "success",
				text: "Check your email for the OTP!",
			});
			setEmail("");
		}

		setIsLoading(false);
	};

	return (
		<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
			<div>
				<label htmlFor={emailId} className="sr-only">
					Email address
				</label>
				<input
					id={emailId}
					name="email"
					type="email"
					autoComplete="email"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
					placeholder="Email address"
					disabled={isLoading}
				/>
			</div>

			{message && (
				<div
					className={`rounded-md p-4 ${
						message.type === "success"
							? "bg-green-50 border border-green-200"
							: "bg-red-50 border border-red-200"
					}`}
				>
					<div className="flex">
						<div className="flex-shrink-0">
							{message.type === "success" ? (
								<svg
									className="h-5 w-5 text-green-400"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
							) : (
								<svg
									className="h-5 w-5 text-red-400"
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
							)}
						</div>
						<div className="ml-3">
							<p
								className={`text-sm ${
									message.type === "success" ? "text-green-800" : "text-red-800"
								}`}
							>
								{message.text}
							</p>
						</div>
					</div>
				</div>
			)}

			<div>
				<button
					type="submit"
					disabled={isLoading || !email}
					className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isLoading ? (
						<>
							<svg
								className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
							Sending OTP...
						</>
					) : (
						"Send OTP"
					)}
				</button>
			</div>
		</form>
	);
}
