import path from "node:path";
import tailwindcss from "@tailwindcss/vite";

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: "autoUpdate",
			manifest: {
				name: "BirdieClub",
				short_name: "BirdieClub",
				description:
					"BirdieClub is a platform for tracking your golf scores and improving your game.",
				theme_color: "#22c55e",
				background_color: "#000000",
				display: "standalone",
				scope: "/",
				start_url: "/",
				orientation: "portrait",
				lang: "en-US",
				icons: [],
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
