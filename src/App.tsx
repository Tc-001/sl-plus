import { createEffect, createSignal } from "solid-js";
import List from "./components/List";
import Generator from "./components/Generator";
import { SimpleLogin, simpleLogin } from "./scripts/simplelogin";

const [token, setToken] = createSignal(
	import.meta.env.VITE_SL_APIKEY ?? localStorage.getItem("sl_token") ?? ""
);

export { setToken };

createEffect(() => {
	if (token() !== "") {
		localStorage.setItem("sl_token", token());
		simpleLogin.setApiKey(token());
	} else {
		localStorage.removeItem("sl_token");
	}
});

export default function Main() {
	return (
		<div
			style={{
				width: "100%",
				"max-width": "600px",
				margin: "auto",
			}}
		>
			{token() ? (
				<>
					<button class="button is-danger" onClick={() => setToken("")}>
						Sign out
					</button>
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
		</div>
	);
}
