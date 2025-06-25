// src/UserContext.tsx

import type { User } from "@supabase/supabase-js";
import { createContext, use, useEffect, useState } from "react";
import supabase from "@/utils/supabase";

const UserContext = createContext<{
	user: User | null;
	isLoading: boolean;
}>({ user: null, isLoading: true });

export function UserProvider({ children }: React.PropsWithChildren) {
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

	return <UserContext value={{ user, isLoading }}>{children}</UserContext>;
}

export const useUser = () => use(UserContext);
