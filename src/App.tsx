import { createEffect, createSignal } from "solid-js";
import Generator from "./components/Generator";
import List from "./components/List";
import { SimpleLogin } from "./scripts/simplelogin";

const [token, setToken] = createSignal(localStorage.getItem("sl_token") ?? "");

export { setToken };

export let simpleLogin: SimpleLogin = new SimpleLogin(token());

createEffect(() => {
	if (token() !== "") {
		localStorage.setItem("sl_token", token());
		simpleLogin = new SimpleLogin(token());
	} else {
		localStorage.removeItem("sl_token");
	}
});

export default function Main() {
	return (
		<>
			{token() ? (
				<>
					<button class="button is-danger" onClick={() => setToken("")}> Sign out </button>
					<div class="section">
						<Generator />
					</div>
					<div class="section">
						<List />
					</div>
				</>
			) : (
				<div class="section">
					<label class="label" for="token">
						Token
					</label>
					<input
						class="input"
						type="text"
						placeholder="Token"
						id="token"
						value={token()}
						onInput={(e) => setToken(e.currentTarget.value)}
					/>
				</div>
			)}
		</>
	);
}
