export function fileToBase64(file: File) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			const base64 = reader.result?.toString().split(",")[1];
			resolve(base64);
		};

		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}
