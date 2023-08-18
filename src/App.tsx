import { ErrorBoundary, createEffect, createSignal } from "solid-js";
import List from "./components/List";
import Generator from "./components/Generator";
import { SimpleLogin, simpleLogin } from "./scripts/simplelogin";

const [token, setToken] = createSignal(
	import.meta.env.VITE_SL_APIKEY ?? localStorage.getItem("sl_token") ?? ""
);

const [showUI, setShowUI] = createSignal(token().length > 10);

export { setToken };

createEffect(() => {
	console.log("Token changed", token());
	if (token() != "") {
		localStorage.setItem("sl_token", token());
		simpleLogin.setApiKey(token()).catch(() => {});
		setShowUI(true);
	} else {
		localStorage.removeItem("sl_token");
		setShowUI(false);
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
			{showUI() ? (
				<>
					<button class="button is-danger" onClick={() => setToken("")}>
						Sign out
					</button>
					<div class="section">
						<ErrorBoundary fallback={(err) => err}>
							<Generator />
						</ErrorBoundary>
					</div>
					<div class="section">
						<ErrorBoundary fallback={(err) => err}>
							<List />
						</ErrorBoundary>
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
					/>
					<button
						onClick={() => {
							setToken(
								document.querySelector<HTMLInputElement>("#token")!.value
							);
						}}
					>
						Sign in
					</button>
				</div>
			)}
		</div>
	);
}
