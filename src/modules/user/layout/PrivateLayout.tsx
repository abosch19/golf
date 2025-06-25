// src/layouts/PrivateLayout.tsx
import { Navigate, Outlet } from "react-router";
import { PlayerRetriever } from "@/modules/player/components/PlayerRetriever";
import { Paths } from "@/utils/paths";
import { useUser } from "../context/UserContext";

export default function PrivateLayout() {
	const { user, isLoading } = useUser();

	if (isLoading) return <div>Loading...</div>;
	if (!user) return <Navigate to={Paths.LOGIN} />;

	return (
		<PlayerRetriever>
			<Outlet />
		</PlayerRetriever>
	);
}
