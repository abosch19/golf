import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppStarter } from "./AppStarter.tsx";

// biome-ignore lint/style/noNonNullAssertion: React needs a non-null element
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AppStarter />
	</StrictMode>,
);
