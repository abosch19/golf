export enum Paths {
	HOME = "/",
	LOGIN = "/login",
	LOGOUT = "/logout",
	PLAYERS = "/players",
	ROUNDS = "/rounds",
	AUTH_CALLBACK = "/auth/callback",
}

export const PathsBuilder = {
	home: () => Paths.HOME,
	login: () => Paths.LOGIN,
	logout: () => Paths.LOGOUT,
	authCallback: () => Paths.AUTH_CALLBACK,
	players: () => Paths.PLAYERS,
	round: (roundId: string) => `${Paths.ROUNDS}/${roundId}`,
	player: (playerId: string) => `${Paths.PLAYERS}/${playerId}`,
};
