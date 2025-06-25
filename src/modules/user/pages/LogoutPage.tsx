import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Paths } from "@/utils/paths";
import supabase from "@/utils/supabase";

export function LogoutPage() {
	const navigate = useNavigate();

	useEffect(() => {
		supabase.auth.signOut();
		navigate(Paths.LOGIN);
	}, [navigate]);

	return null;
}
