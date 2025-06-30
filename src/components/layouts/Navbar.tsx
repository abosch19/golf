import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useUser } from "@/modules/user/context/UserContext";
import { RouteBuilder } from "@/utils/paths";
import { Button } from "../ui/button";

export function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { user } = useUser();
	const location = useLocation();

	// Block body scroll when mobile menu is open
	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		// Cleanup function to restore scroll when component unmounts
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isMobileMenuOpen]);

	const navigation = [
		{
			name: "Rounds",
			href: RouteBuilder.home(),
			current: location.pathname === RouteBuilder.home(),
		},
		{
			name: "Players",
			href: RouteBuilder.player(""),
			current: location.pathname.startsWith("/players"),
		},
	];

	return (
		<nav className="sticky top-0 z-50 backdrop-blur-2xl shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					{/* Logo and Desktop Navigation */}
					<div className="flex items-center">
						<div className="flex-shrink-0 flex items-center">
							<Link
								to={RouteBuilder.home()}
								className="text-xl font-bold text-green-600"
							>
								<img src="/images/logo.png" alt="BirdieClub" className="h-8" />
							</Link>
						</div>

						{/* Desktop Navigation Links */}
						<div className="hidden md:ml-6 md:flex md:space-x-8">
							{navigation.map((item) => (
								<Link
									key={item.name}
									to={item.href}
									className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
										item.current
											? "border-green-500 text-gray-900"
											: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
									}`}
								>
									{item.name}
								</Link>
							))}
						</div>
					</div>

					{/* User Menu and Mobile Menu Button */}
					<div className="flex items-center">
						{/* User Menu */}
						<div className="hidden md:ml-4 md:flex md:items-center">
							<div className="ml-3 relative">
								<div className="flex items-center space-x-3">
									<span className="text-sm text-gray-700">{user?.email}</span>
									<Button
										asChild
										className=" text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
									>
										<Link to={RouteBuilder.logout()}>Logout</Link>
									</Button>
								</div>
							</div>
						</div>

						{/* Mobile menu button */}
						<div className="md:hidden">
							<button
								type="button"
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
								className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
								aria-expanded="false"
							>
								<span className="sr-only">Open main menu</span>
								<svg
									className={`${isMobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
								<svg
									className={`${isMobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			<div
				className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden absolute top-0 left-0 w-full h-full z-[9999] bg-white`}
			>
				<div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
					<h2 className="text-lg font-medium text-gray-900">Menu</h2>
					<button
						type="button"
						onClick={() => setIsMobileMenuOpen(false)}
						className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
					>
						<span className="sr-only">Close menu</span>
						<svg
							className="h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
				<div className="pt-2 pb-3 space-y-1">
					{navigation.map((item) => (
						<Link
							key={item.name}
							to={item.href}
							className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
								item.current
									? "bg-green-50 border-green-500 text-green-700"
									: "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
							}`}
							onClick={() => setIsMobileMenuOpen(false)}
						>
							{item.name}
						</Link>
					))}
				</div>

				{/* Mobile user menu */}
				<div className="pt-4 pb-3 border-t border-gray-200">
					<div className="flex items-center px-4">
						<div className="flex-shrink-0">
							<div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
								<span className="text-white text-sm font-medium">
									{user?.email?.charAt(0).toUpperCase()}
								</span>
							</div>
						</div>
						<div className="ml-3">
							<div className="text-base font-medium text-gray-800">
								{user?.email}
							</div>
						</div>
					</div>
					<div className="mt-3 space-y-1">
						<Link
							to={RouteBuilder.logout()}
							className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							Logout
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
}
