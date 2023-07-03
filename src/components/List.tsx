import {
	For,
	Show,
	createEffect,
	createResource,
	createSignal,
} from "solid-js";
import { simpleLogin } from "../App";
import { nanoid } from "nanoid";

let [refetchId, setRefetchId] = createSignal(crypto.randomUUID());

export let shouldRefetch = setRefetchId;

export default function List() {
	const [aliases, { refetch }] = createResource(() => {
		return simpleLogin.listAliases(0);
	});

	createEffect(() => {
		if (refetchId()) {
			refetch();
		}
	});

	return (
		<div>
			<For each={aliases()} fallback={<div>Loading...</div>}>
				{(alias) => {
					// Delete alias
					const [shouldDelete, setDelete] = createSignal(false);
					const [deleteState, {}] = createResource(
						shouldDelete,
						async (shouldDelete, _) => {
							//console.log("ShouldDelete changed", shouldDelete, alias.id);
							if (shouldDelete) {
								return await simpleLogin.deleteAlias(alias.id).finally(() => {
									shouldRefetch(crypto.randomUUID());
								});
							}
						}
					);

					const [enabledState, { refetch: toggleEnable, mutate }] =
						createResource<boolean>(
							async (_, { refetching }) => {
								if (!refetching) return alias.enabled;

								return await simpleLogin
									.toggleAlias(alias.id)
									.then((x) => x.json<{ enabled: boolean }>())
									.then((x) => {
										const e = x.enabled;
										// Mutate to always toggle based on the new state
										mutate(!e);
										return e;
									});
							},
							{ initialValue: alias.enabled }
						);

					const toggleId = nanoid();

					return (
						<div class="card block">
							<header class="card-header">
								<p class="card-header-title">{alias.email}</p>
								<div class="card-header-icon">
									<input
										id={toggleId}
										type="checkbox"
										name="switchExample"
										class="switch"
										checked={enabledState()}
										onChange={toggleEnable}
										disabled={shouldDelete() || enabledState.loading}
									/>
									<label for={toggleId} />
								</div>
							</header>
							<div class="card-content">
								<div class="content">
									{alias.nb_forward} forwards, {alias.nb_reply} replies,{" "}
									{alias.nb_block} blocks.
								</div>
								<button class="button is-small" disabled={shouldDelete()}>
									Reverse
								</button>
								<button
									disabled={shouldDelete()}
									class="button is-small is-danger"
									onClick={() =>
										confirm(
											"Do you really want to delete alias " + alias.email + "?"
										) && setDelete(true)
									}
								>
									Delete
								</button>
							</div>
						</div>
					);
				}}
			</For>
		</div>
	);
}
