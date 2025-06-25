import { QueryClientProvider } from "@tanstack/react-query";
import { AppRoutes } from "./AppRoutes";
import { UserProvider } from "./modules/user/context/UserContext";
import { queryClient } from "./utils/queryClient";

export function AppStarter() {
	return (
		<QueryClientProvider client={queryClient}>
			<UserProvider>
				<AppRoutes />
			</UserProvider>
		</QueryClientProvider>
	);
}
