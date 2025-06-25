import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import App from "./App";
import { Paths } from "./utils/paths";

export function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path={Paths.HOME} element={<App />} />
				<Route path="*" element={<Navigate to={Paths.HOME} />} />
			</Routes>
		</BrowserRouter>
	);
}
