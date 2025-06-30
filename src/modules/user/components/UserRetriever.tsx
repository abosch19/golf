import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Loading } from "@/components/layouts/Loading";
import supabase from "@/utils/supabase";
import { PlayerProvider } from "../context/PlayerContext";
import { UserProvider } from "../context/UserContext";
import { useMe } from "../hooks/useMe";
import { CreatePlayerPage } from "../pages/CreatePlayerPage";

export function UserRetriever({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		supabase.auth.getUser().then(({ data: { user } }) => {
			setUser(user);
			setIsLoading(false);
		});

		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setUser(session?.user ?? null);
			},
		);

		return () => listener?.subscription.unsubscribe();
	}, []);

	if (isLoading) return <Loading />;

	return <UserProvider user={user}>{children}</UserProvider>;
}
