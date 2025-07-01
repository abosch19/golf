// src/layouts/PrivateLayout.tsx
import { Navigate, Outlet } from "react-router";
import { Loading } from "@/components/layouts/Loading";
import { Paths } from "@/utils/paths";
import { useUser } from "../context/UserContext";

export default function PublicLayout() {
	const { user, isLoading } = useUser();

	if (isLoading) return <Loading />;
	if (user) return <Navigate to={Paths.HOME} />;

	return <Outlet />;
}
