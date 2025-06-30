import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { PlayerPage } from "./modules/player/pages/PlayerPage";
import { PlayersPage } from "./modules/player/pages/PlayersPage";
import { RoundsPage } from "./modules/round/pages/RoundsPage";
import PrivateLayout from "./modules/user/layout/PrivateLayout";
import PublicLayout from "./modules/user/layout/PublicLayout";
import { AuthCallback } from "./modules/user/pages/AuthCallback";
import { LoginPage } from "./modules/user/pages/LoginPage";
import { LogoutPage } from "./modules/user/pages/LogoutPage";
import { PathsBuilder } from "./utils/paths";

export function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<PrivateLayout />}>
					<Route path={PathsBuilder.home()} element={<RoundsPage />} />
					<Route
						path={PathsBuilder.player(":playerId")}
						element={<PlayerPage />}
					/>
					<Route path={PathsBuilder.players()} element={<PlayersPage />} />
					<Route path={PathsBuilder.logout()} element={<LogoutPage />} />
				</Route>
				<Route element={<PublicLayout />}>
					<Route path={PathsBuilder.login()} element={<LoginPage />} />
				</Route>
				<Route path={PathsBuilder.authCallback()} element={<AuthCallback />} />
				<Route path="*" element={<Navigate to={PathsBuilder.home()} />} />
			</Routes>
		</BrowserRouter>
	);
}
