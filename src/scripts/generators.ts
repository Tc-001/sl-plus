import { nanoid, customAlphabet } from "nanoid";

let cache: Record<string, any> = {};

export const generators = {
	uuid(): string {
		return crypto.randomUUID();
	},

	random(): string {
		return customAlphabet("abcdefghijklmnopqrstuvwxyz1234567890", 10)();
	},

	randomShort(): string {
		return customAlphabet("abcdefghijklmnopqrstuvwxyz1234567890", 5)();
	},

	currentSlHost(): string {
		return (
			window.location.hostname.split(".").at(-1) || window.location.hostname
		);
	},

	currentHostname(): string {
		return window.location.hostname;
	},

	async slWordList(): Promise<string> {
		// Get wordlist
		const url =
			"https://raw.githubusercontent.com/simple-login/app/master/local_data/words.txt";
		const words =
			cache["slWordList"] ??
			(await fetch(url).then((res) => res.text())).split("\n");
		cache["slWordList"] = words;

		const getWord = () => words[Math.floor(Math.random() * words.length)];

		return `${getWord()}_${getWord()}${Math.floor(Math.random() * 1000)
			.toString()
			.padStart(3, "0")}`;
	},
};

export async function generateWithCurrent(): Promise<string> {
	const currentGenerator = (localStorage.getItem("sl_generator") ||
		"random") as keyof typeof generators;
	return await generators[currentGenerator]();
}

export function cycleGenerator() {
	const currentGenerator = localStorage.getItem("sl_generator") || "random";
	const generatorsList = Object.keys(generators);
	const nextGenerator =
		generatorsList[
			(generatorsList.indexOf(currentGenerator) + 1) % generatorsList.length
		];
	localStorage.setItem("sl_generator", nextGenerator);
	return nextGenerator;
}
