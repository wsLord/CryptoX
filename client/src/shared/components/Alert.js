import React from "react";

const Alert = (props) => {
	return (
		<div>
			<div
				className="alert alert-secondary alert-dismissible fade show"
				role="alert"
			>
				<strong>{props.msg}</strong>
				<button
					type="button"
					className="btn-close"
					data-bs-dismiss="alert"
					aria-label="Close"
					onClick={props.onClose}
				></button>
			</div>
		</div>
	);
}

export default Alert;