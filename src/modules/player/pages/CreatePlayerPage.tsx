import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { type PlayerFormData, useCreatePlayer } from "../hooks/useCreatePlayer";

interface FormErrors {
	firstName?: string;
	lastName?: string;
	birthdate?: string;
	nationality?: string;
}

export function CreatePlayerPage() {
	const createPlayerMutation = useCreatePlayer();
	const [formData, setFormData] = useState<PlayerFormData>({
		firstName: "",
		lastName: "",
		birthdate: "",
		nationality: "",
	});

	const [errors, setErrors] = useState<FormErrors>({});

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};

		if (!formData.firstName.trim()) {
			newErrors.firstName = "First name is required";
		} else if (formData.firstName.trim().length < 2) {
			newErrors.firstName = "First name must be at least 2 characters";
		}

		if (!formData.lastName.trim()) {
			newErrors.lastName = "Last name is required";
		} else if (formData.lastName.trim().length < 2) {
			newErrors.lastName = "Last name must be at least 2 characters";
		}

		if (!formData.birthdate) {
			newErrors.birthdate = "Birthdate is required";
		} else {
			const birthDate = new Date(formData.birthdate);
			const today = new Date();
			const age = today.getFullYear() - birthDate.getFullYear();

			if (age < 5 || age > 100) {
				newErrors.birthdate = "Please enter a valid birthdate";
			}
		}

		if (!formData.nationality.trim()) {
			newErrors.nationality = "Nationality is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (field: keyof PlayerFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		createPlayerMutation.mutate(formData, {
			onSuccess: () => {
				setFormData({
					firstName: "",
					lastName: "",
					birthdate: "",
					nationality: "",
				});
			},
		});
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
					<div className="mb-8">
						<h1 className="text-2xl font-bold text-gray-900 mb-2">
							Create New Player
						</h1>
						<p className="text-gray-600">
							Fill in the details below to create a new player profile.
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							{/* First Name */}
							<div>
								<label
									htmlFor="firstName"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									First Name *
								</label>
								<input
									type="text"
									id={useId()}
									value={formData.firstName}
									onChange={(e) =>
										handleInputChange("firstName", e.target.value)
									}
									className={cn(
										"w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
										errors.firstName
											? "border-red-300 focus:ring-red-500 focus:border-red-500"
											: "border-gray-300",
									)}
									placeholder="Enter first name"
									disabled={createPlayerMutation.isPending}
								/>
								{errors.firstName && (
									<p className="mt-1 text-sm text-red-600">
										{errors.firstName}
									</p>
								)}
							</div>

							{/* Last Name */}
							<div>
								<label
									htmlFor="lastName"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Last Name *
								</label>
								<input
									type="text"
									id={useId()}
									value={formData.lastName}
									onChange={(e) =>
										handleInputChange("lastName", e.target.value)
									}
									className={cn(
										"w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
										errors.lastName
											? "border-red-300 focus:ring-red-500 focus:border-red-500"
											: "border-gray-300",
									)}
									placeholder="Enter last name"
									disabled={createPlayerMutation.isPending}
								/>
								{errors.lastName && (
									<p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
								)}
							</div>
						</div>

						{/* Birthdate */}
						<div>
							<label
								htmlFor="birthdate"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Birthdate *
							</label>
							<input
								type="date"
								id={useId()}
								value={formData.birthdate}
								onChange={(e) => handleInputChange("birthdate", e.target.value)}
								className={cn(
									"w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
									errors.birthdate
										? "border-red-300 focus:ring-red-500 focus:border-red-500"
										: "border-gray-300",
								)}
								disabled={createPlayerMutation.isPending}
							/>
							{errors.birthdate && (
								<p className="mt-1 text-sm text-red-600">{errors.birthdate}</p>
							)}
						</div>

						{/* Nationality */}
						<div>
							<label
								htmlFor="nationality"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Nationality *
							</label>
							<input
								type="text"
								id={useId()}
								value={formData.nationality}
								onChange={(e) =>
									handleInputChange("nationality", e.target.value)
								}
								className={cn(
									"w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
									errors.nationality
										? "border-red-300 focus:ring-red-500 focus:border-red-500"
										: "border-gray-300",
								)}
								placeholder="Enter nationality"
								disabled={createPlayerMutation.isPending}
							/>
							{errors.nationality && (
								<p className="mt-1 text-sm text-red-600">
									{errors.nationality}
								</p>
							)}
						</div>

						{/* Submit Button */}
						<div className="pt-4">
							<button
								type="submit"
								disabled={createPlayerMutation.isPending}
								className={cn(
									"w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
									createPlayerMutation.isPending
										? "bg-gray-400 cursor-not-allowed"
										: "bg-blue-600 hover:bg-blue-700",
								)}
							>
								{createPlayerMutation.isPending ? (
									<div className="flex items-center">
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
										Creating Player...
									</div>
								) : (
									"Create Player"
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
