import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function InstallPWA() {
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);

	useEffect(() => {
		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			console.log("beforeinstallprompt", e);
			setDeferredPrompt(e as BeforeInstallPromptEvent);
		};

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		return () => {
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt,
			);
		};
	}, []);

	const handleInstall = () => {
		if (deferredPrompt) {
			deferredPrompt.prompt();
			deferredPrompt.userChoice.then((choiceResult) => {
				if (choiceResult.outcome === "accepted") {
					console.log("User accepted the install prompt");
				} else {
					console.log("User dismissed the install prompt");
				}
			});
		}

		setDeferredPrompt(null);
	};

	if (!deferredPrompt) return null;

	return (
		<Button
			onClick={handleInstall}
			className="fixed bottom-4 right-4 left-4"
			variant="outline"
		>
			Install App
		</Button>
	);
}
