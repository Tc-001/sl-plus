export interface Alias {
	id: string;
	email: string;
	name: string;
	enabled: boolean;
	creation_timestamp: number;
	note: string;
	nb_block: number;
	nb_forward: number;
	nb_reply: number;
	support_pgp: boolean;
	disable_pgp: boolean;
	mailbox: {
		id: string;
		email: string;
	};
	mailboxes: {
		id: string;
		email: string;
	}[];
	latest_activity: {
		action: string;
		timestamp: number;
		contact: {
			email: string;
			name: string;
			reverse_alias: string;
		};
	};
	pinned: boolean;
}

export interface AliasOptions {
	can_create: boolean;
	prefix_suggestion: string;
	suffixes: {
		signed_suffix: string;
		suffix: string;
		is_custom: boolean;
		is_premium: boolean;
	}[];
}

export interface UserSettings {
	alias_generator: string;
	notification: boolean;
	random_alias_default_domain: string;
	sender_format: string;
	random_alias_suffix: string;
}

export interface Mailbox {
	email: string;
	id: number;
	default: boolean;
	creation_timestamp: number;
	nb_alias: number;
	verified: boolean;
}
