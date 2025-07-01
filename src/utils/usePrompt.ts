import { useContext, useEffect } from "react";
import {
	UNSAFE_NavigationContext as NavigationContext,
	type Navigator,
} from "react-router";

export function usePrompt(message: string, when: boolean) {
	const navigator = useContext(NavigationContext).navigator;

	useEffect(() => {
		if (!when) return;

		const pushState = navigator.push;

		const confirmAndPush = (...args: Parameters<Navigator["push"]>) => {
			const result = window.confirm(message);
			if (result) {
				pushState.apply(navigator, args);
			}
		};

		navigator.push = confirmAndPush;

		return () => {
			navigator.push = pushState;
		};
	}, [when, message, navigator]);
}
