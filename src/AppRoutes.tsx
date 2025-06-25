import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import App from "./App";
import PrivateLayout from "./user/layout/PrivateLayout";
import PublicLayout from "./user/layout/PublicLayout";
import { AuthCallback } from "./user/pages/AuthCallback";
import { LoginPage } from "./user/pages/LoginPage";
import { LogoutPage } from "./user/pages/LogoutPage";
import { Paths } from "./utils/paths";

export function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<PrivateLayout />}>
					<Route path={Paths.HOME} element={<App />} />
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
