export const getPlayerColor = (
	firstName: string,
): { bgColor: string; textColor: string } => {
	const colors = [
		{ bgColor: "bg-green-100", textColor: "text-green-700" }, // green
		{ bgColor: "bg-blue-100", textColor: "text-blue-700" }, // blue
		{ bgColor: "bg-yellow-100", textColor: "text-yellow-700" }, // yellow
		{ bgColor: "bg-red-100", textColor: "text-red-700" }, // red
		{ bgColor: "bg-purple-100", textColor: "text-purple-700" }, // purple
		{ bgColor: "bg-pink-100", textColor: "text-pink-700" }, // pink
		{ bgColor: "bg-sky-100", textColor: "text-sky-700" }, // sky
	];

	const firstLetter = firstName.charAt(0).toUpperCase() || "A";
	const colorIndex = (firstLetter.charCodeAt(0) - 65) % colors.length;
	const randomColor = colors[colorIndex];
	return randomColor;
};
