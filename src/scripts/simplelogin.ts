import ky from "ky";
import type {
	Alias,
	AliasOptions,
	Mailbox,
	UserSettings,
} from "./simplelogin.d";
import { nanoid } from "nanoid";

export class SimpleLogin {
	constructor() {}

	private apiKey: string | undefined = undefined;

	public async setApiKey(apiKey: string) {
		this.apiKey = apiKey;
	}

	private fetch = ky.create({
		prefixUrl: "https://app.simplelogin.io/api/",
		retry: {
			limit: 3,
			methods: ["get"],
		},
		hooks: {
			beforeRequest: [
				(request) => {
					if (!this.apiKey) {
						throw new Error("No API key");
					}
					request.headers.set("Authentication", this.apiKey);
				},
			],
		},
	});

	public isLoggedIn(): boolean {
		return this.apiKey !== null;
	}

	public async listAliases(pageId: number): Promise<Alias[]> {
		const response = await this.fetch("v2/aliases?page_id=" + pageId);
		const aliases = await response.json<{ aliases: Alias[] }>();
		return aliases.aliases;
	}

	public async getAliasOptions(): Promise<AliasOptions> {
		const response = await this.fetch("v5/alias/options");
		return await response.json<AliasOptions>().then((options) => {
			options.suffixes = options.suffixes.filter((suffix, index) => {
				return (
					options.suffixes.findIndex(
						(x) => x.suffix.split("@")[1] == suffix.suffix.split("@")[1]
					) === index
				);
			});

			// Include a random premium suffix as the default option
			const randomPremiumSuffix = options.suffixes
				.sort(() => Math.random() - 0.5)
				.find((suffix) => suffix.is_premium);

			if (!randomPremiumSuffix) return options;

			options.suffixes.unshift({
				...randomPremiumSuffix,
				is_random: true,
			});

			return options;
		});
	}

	public async getSettings(): Promise<UserSettings> {
		const response = await this.fetch("setting");
		return await response.json();
	}

	public async getMailboxes(): Promise<{ mailboxes: Mailbox[] }> {
		const response = await this.fetch("v2/mailboxes");
		return await response.json();
	}

	public async newAlias(
		alias_prefix: string,
		signed_suffix: string,
		mailbox_ids: number[]
	) {
		const response = await this.fetch("v3/alias/custom/new", {
			method: "POST",
			json: {
				alias_prefix,
				signed_suffix,
				mailbox_ids,
			},
		});
		return await response.json();
	}

	public async deleteAlias(aliasId: string) {
		return this.fetch("aliases/" + aliasId, {
			method: "delete",
		});
	}

	public async toggleAlias(aliasId: string) {
		return this.fetch("aliases/" + aliasId + "/toggle", {
			method: "post",
		});
	}
}

export let simpleLogin: SimpleLogin = new SimpleLogin();
