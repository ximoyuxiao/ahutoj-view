const keys = {
	//model
	Default: Symbol(10),
	Auth: Symbol(11),
	User: Symbol(12),
	Admin: Symbol(13),
	Problem: Symbol(14),
	Training: Symbol(15),
	Contest: Symbol(16),
	Submit: Symbol(17),
	File: Symbol(18),
};

const Module = {
	[keys.Default]: 10,
	[keys.Auth]: 11,
	[keys.User]: 12,
	[keys.Admin]: 13,
	[keys.Problem]: 14,
	[keys.Training]: 15,
	[keys.Contest]: 16,
	[keys.Submit]: 17,
	[keys.File]: 18,
};

export { keys, Module };
