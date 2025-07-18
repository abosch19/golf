import { useState } from "react";
import { EmailForm } from "../components/EmailForm";
import { OTPForm } from "../components/OTPForm";

export function LoginPage() {
	const [email, setEmail] = useState<string | null>(null);

	const handleEmailSubmit = (email: string) => {
		setEmail(email);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Sign in to your account
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						{email
							? "Enter the OTP sent to your email"
							: "Enter your email to receive OTP"}
					</p>
				</div>
				{email ? (
					<OTPForm email={email} />
				) : (
					<EmailForm onSubmit={handleEmailSubmit} />
				)}
			</div>
		</div>
	);
}
