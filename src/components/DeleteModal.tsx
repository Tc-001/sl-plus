export default function DeleteModal(props: {
	alias: string;
	onClose: () => void;
	onDelete: () => void;
}) {
	return (
		<div class="modal is-active">
			<div class="modal-background" onClick={props.onClose}></div>
			<div class="modal-card">
				<header class="modal-card-head">
					<p class="modal-card-title">Delete Alias</p>
					<button
						class="delete"
						aria-label="close"
						onClick={props.onClose}
					></button>
				</header>
				<section class="modal-card-body">
					<p>
						Are you sure you want to delete the alias{" "}
						<strong>{props.alias}</strong>?
					</p>
				</section>
				<footer class="modal-card-foot">
					<button class="button is-danger" onClick={props.onDelete}>
						Delete
					</button>
					<button class="button" onClick={props.onClose}>
						Cancel
					</button>
				</footer>
			</div>
		</div>
	);
}
