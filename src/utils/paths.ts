export enum Paths {
	HOME = "/",
	LOGIN = "/login",
	LOGOUT = "/logout",
	PLAYERS = "/players",
	ROUNDS = "/rounds",
	ROUNDS_ADD = "/rounds/add",
}

export const RouteBuilder = {
	home: () => Paths.HOME,
	login: () => Paths.LOGIN,
	logout: () => Paths.LOGOUT,
	players: () => Paths.PLAYERS,
	round: (roundId: string) => `${Paths.ROUNDS}/${roundId}`,
	roundAdd: () => Paths.ROUNDS_ADD,
	player: (playerId: string) => `${Paths.PLAYERS}/${playerId}`,
};
