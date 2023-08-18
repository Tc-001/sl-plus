import { For, createResource, createSignal } from "solid-js";
import { refetchAliasList } from "./List";
import {
	cycleGenerator,
	generateWithCurrent,
	generators,
} from "../scripts/generators";
import { simpleLogin } from "../scripts/simplelogin";

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
		await refetchAliasList();
		// Refetch domain list
		await refetchOptions();
		// Regenerate alias
		await regenerateAlias();

		return res;
	});

	const [generatedAlias, { refetch: regenerateAlias, mutate }] = createResource(
		async () => {
			return await generateWithCurrent();
		}
	);

	const labels = {
		is_premium: "🪙",
		is_custom: "✏️",
		is_free: "🆓",
		is_random: "🎲",
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
						class="button is-dark"
						type="button"
						onClick={() => {
							const generator = cycleGenerator();
							mutate("> " + generator);
						}}
						disabled={createAlias.loading}
					>
						C
					</button>
					<button
						class="button is-info is-radiusless"
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
						disabled={
							createAlias.loading ||
							generatedAlias.loading ||
							generatedAlias()?.startsWith(">")
						}
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
										{suffix.is_random ? labels.is_random : ""}
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
						disabled={createAlias.loading || generatedAlias()?.startsWith(">")}
					/>
				</p>
			</div>
		</form>
	);
}
