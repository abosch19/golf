import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import supabase from "@/utils/supabase";

interface OTPFormProps {
	email: string;
}

export function OTPForm({ email }: OTPFormProps) {
	const [otp, setOtp] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setMessage(null);

		const { error } = await supabase.auth.verifyOtp({
			email,
			token: otp,
			type: "email",
		});

		if (error) {
			setMessage({ type: "error", text: error.message });
		} else {
			setMessage({ type: "success", text: "OTP verified successfully" });
		}

		setIsLoading(false);
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
			<InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
				<InputOTPGroup>
					<InputOTPSlot index={0} />
					<InputOTPSlot index={1} />
					<InputOTPSlot index={2} />
				</InputOTPGroup>
				<InputOTPSeparator />
				<InputOTPGroup>
					<InputOTPSlot index={3} />
					<InputOTPSlot index={4} />
					<InputOTPSlot index={5} />
				</InputOTPGroup>
			</InputOTP>
			<Button type="submit" disabled={isLoading} className="w-1/2">
				{isLoading ? "Verifying..." : "Verify"}
			</Button>
			{message && (
				<div
					className={`mt-4 ${message.type === "success" ? "text-green-500" : "text-red-500"}`}
				>
					{message.text}
				</div>
			)}
		</form>
	);
}
