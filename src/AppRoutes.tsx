import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { RoundsPage } from "./modules/round/pages/RoundsPage";
import PrivateLayout from "./modules/user/layout/PrivateLayout";
import PublicLayout from "./modules/user/layout/PublicLayout";
import { AuthCallback } from "./modules/user/pages/AuthCallback";
import { LoginPage } from "./modules/user/pages/LoginPage";
import { LogoutPage } from "./modules/user/pages/LogoutPage";
import { Paths } from "./utils/paths";

export function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<PrivateLayout />}>
					<Route path={Paths.HOME} element={<RoundsPage />} />
					<Route path={Paths.LOGOUT} element={<LogoutPage />} />
				</Route>
				<Route element={<PublicLayout />}>
					<Route path={Paths.LOGIN} element={<LoginPage />} />
				</Route>
				<Route path={Paths.AUTH_CALLBACK} element={<AuthCallback />} />
				<Route path="*" element={<Navigate to={Paths.LOGIN} />} />
			</Routes>
		</BrowserRouter>
	);
}
