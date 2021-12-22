import React from "react";

const ErrorPage = (props) => {
	return (
		<div className="d-flex justify-content-evenly">
			<h1>ERROR PAGE</h1>
			<h3>{props.location.state.error}</h3>
		</div>
	);
}

export default ErrorPage;