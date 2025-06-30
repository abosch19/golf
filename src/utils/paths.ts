export enum Paths {
	HOME = "/",
	LOGIN = "/login",
	LOGOUT = "/logout",
	PLAYERS = "/players",
	AUTH_CALLBACK = "/auth/callback",
}

export const PathsBuilder = {
	home: () => Paths.HOME,
	login: () => Paths.LOGIN,
	logout: () => Paths.LOGOUT,
	authCallback: () => Paths.AUTH_CALLBACK,
	player: (playerId: string) => `${Paths.PLAYERS}/${playerId}`,
};
