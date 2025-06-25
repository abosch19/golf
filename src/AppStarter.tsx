import { AppRoutes } from "./AppRoutes";
import { UserProvider } from "./user/context/UserContext";

export function AppStarter() {
	return (
		<UserProvider>
			<AppRoutes />
		</UserProvider>
	);
}
