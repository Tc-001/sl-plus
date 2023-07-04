import { For, createResource, createSignal } from "solid-js";
import { simpleLogin } from "../App";
import { shouldRefetch } from "./List";
import { generators } from "../scripts/generators";

export default function Generator() {
	const [options, { refetch: refetchOptions }] = createResource(async () => {
		return await simpleLogin.getAliasOptions();
	});

	//const [settings, b] = createResource(async () => {
	//	return await simpleLogin.getSettings();
	//});

	const [aliasSettings, setAliasSettings] = createSignal({
		prefix: "",
		signedSuffix: "",
	});
	const [createAlias, _] = createResource(aliasSettings, async (source, _) => {
		if (!source.prefix || !source.signedSuffix) return;

		const defaultMailbox = (await simpleLogin.getMailboxes()).mailboxes.find(
			(x) => x.default
		)?.id;
		if (!defaultMailbox) throw new Error("No default mailbox!");

		const res = await simpleLogin.newAlias(source.prefix, source.signedSuffix, [
			defaultMailbox,
		]);

		// Refresh main alias list
		shouldRefetch(crypto.randomUUID());
		// Refetch domain list
		await refetchOptions();

		return res;
	});

	const [generatedAlias, { refetch: regenerateAlias }] = createResource(
		async () => {
			return await generators.random();
		}
	);

	const labels = {
		is_premium: "🪙",
		is_custom: "✏️",
		is_free: "🆓",
	};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				const data = new FormData(e.currentTarget);
				setAliasSettings({
					prefix: data.get("prefix")?.toString() ?? "",
					signedSuffix: data.get("domain")?.toString() ?? "",
				});
			}}
		>
			<div class="field has-addons has-addons-centered">
				<div class="control">
					<button
						class="button is-info"
						type="button"
						onClick={regenerateAlias}
						disabled={createAlias.loading}
					>
						↻
					</button>
				</div>
				<div class="control is-expanded">
					<input
						class="input"
						type="text"
						placeholder="Alias"
						name="prefix"
						value={generatedAlias()}
						disabled={createAlias.loading}
						required
					/>
				</div>
			</div>
			<div class="field has-addons has-addons-centered">
				<div class="control is-expanded">
					<div class="select is-fullwidth">
						<select
							class="domain_select"
							name="domain"
							required
							disabled={createAlias.loading}
						>
							<For each={options()?.suffixes}>
								{(suffix) => (
									<option value={suffix.signed_suffix}>
										{suffix.is_premium
											? labels.is_premium
											: suffix.is_custom
											? labels.is_custom
											: labels.is_free}
										{suffix.suffix}
									</option>
								)}
							</For>
						</select>
					</div>
				</div>
				<p class="control">
					<input
						type="submit"
						class="button is-success"
						value="+"
						disabled={createAlias.loading}
					/>
				</p>
			</div>
		</form>
	);
}
