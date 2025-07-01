/// <reference types="vite/client" />

interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>;
	userChoice: Promise<{
		outcome: "accepted" | "dismissed";
		platform: string;
	}>;
}

declare global {
	interface Window {
		addEventListener(
			type: "beforeinstallprompt",
			listener: (this: Window, ev: BeforeInstallPromptEvent) => void,
			options?: boolean | AddEventListenerOptions,
		): void;
		removeEventListener(
			type: "beforeinstallprompt",
			listener: (this: Window, ev: BeforeInstallPromptEvent) => void,
			options?: boolean | EventListenerOptions,
		): void;
	}
}
