import {
	For,
	Show,
	createEffect,
	createResource,
	createSignal,
} from "solid-js";
import { nanoid } from "nanoid";
import { simpleLogin } from "../scripts/simplelogin";
import DeleteModal from "./DeleteModal";

// let [refetchId, setRefetchId] = createSignal(crypto.randomUUID());
// export let shouldRefetch = setRefetchId;

const [aliases, { refetch: refetchAliasList }] = createResource(() => {
	return simpleLogin.listAliases(0);
});
export { refetchAliasList };

export default function List() {
	return (
		<div>
			<Show when={aliases.loading}>
				<div class="notification">Loading...</div>
			</Show>
			<For each={aliases()} fallback={<div>Loading...</div>}>
				{(alias) => {
					// Delete alias
					const [shouldDelete, setDelete] = createSignal<0 | 1 | 2>(0);
					const [deleteState, {}] = createResource(
						shouldDelete,
						async (shouldDelete, _) => {
							//console.log("ShouldDelete changed", shouldDelete, alias.id);
							if (shouldDelete === 2) {
								if (import.meta.env.DEV) {
									alert("Deleting alias " + alias.id);
									return;
								}

								return await simpleLogin.deleteAlias(alias.id).finally(() => {
									refetchAliasList();
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
							<Show when={shouldDelete() === 1}>
								<DeleteModal
									alias={alias.email}
									onDelete={() => setDelete(2)}
									onClose={() => setDelete(0)}
								/>
							</Show>
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
										disabled={shouldDelete() != 0 || enabledState.loading}
									/>
									<label for={toggleId} />
								</div>
							</header>
							<div class="card-content">
								<div class="content">
									{alias.nb_forward} forwards, {alias.nb_reply} replies,{" "}
									{alias.nb_block} blocks.
								</div>
								<button class="button is-small" disabled={shouldDelete() != 0}>
									Reverse
								</button>
								<button
									disabled={shouldDelete() != 0}
									class="button is-small is-danger"
									onClick={() => setDelete(1)}
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
