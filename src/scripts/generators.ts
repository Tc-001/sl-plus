import { nanoid, customAlphabet } from "nanoid";

export const generators = {
	uuid() {
		return crypto.randomUUID();
	},

	random() {
		return customAlphabet("abcdefghijklmnopqrstuvwxyz1234567890", 10)();
	},

	currentSlHost() {
		return window.location.hostname.split(".").at(-1);
	},

	currentHostname() {
		return window.location.hostname;
	},
};
