import React from "react";
import img from "../shared/img/404.jpg"

const ErrorPage = (props) => {
	return (
		<div className="d-flex flex-column align-items-center">
			<h1 className="text-danger text-center">ERROR</h1>
			<img className="h-50 w-50" src={img} alt="" />
			<h3>{props.location.state.error}</h3>
		</div>
	);
}

export default ErrorPage;