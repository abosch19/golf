import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { PlayerPage } from "./modules/player/pages/PlayerPage";
import { PlayersPage } from "./modules/player/pages/PlayersPage";
import { CreateRoundPage } from "./modules/round/pages/CreateRoundPage";
import { RoundsPage } from "./modules/round/pages/RoundsPage";
import PrivateLayout from "./modules/user/layout/PrivateLayout";
import PublicLayout from "./modules/user/layout/PublicLayout";
import { LoginPage } from "./modules/user/pages/LoginPage";
import { LogoutPage } from "./modules/user/pages/LogoutPage";
import { RouteBuilder } from "./utils/paths";

export function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<PrivateLayout />}>
					<Route path={RouteBuilder.home()} element={<RoundsPage />} />
					<Route
						path={RouteBuilder.player(":playerId")}
						element={<PlayerPage />}
					/>
					<Route path={RouteBuilder.players()} element={<PlayersPage />} />
					<Route path={RouteBuilder.logout()} element={<LogoutPage />} />
					<Route path={RouteBuilder.roundAdd()} element={<CreateRoundPage />} />
				</Route>
				<Route element={<PublicLayout />}>
					<Route path={RouteBuilder.login()} element={<LoginPage />} />
				</Route>
				<Route path="*" element={<Navigate to={RouteBuilder.home()} />} />
			</Routes>
		</BrowserRouter>
	);
}
