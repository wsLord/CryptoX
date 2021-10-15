import { Fragment, useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import Alert from "../shared/components/Alert";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";

const Login = (props) => {
	const [isLoading, setIsLoading] = useState(true);

	const loginHandler = async (event) => {
		event.preventDefault();

		console.log(event);

		// try {
		// 	const responseData = await sendRequest(
		// 		"http://localhost:5000/api/users/login",
		// 		"POST",
		// 		JSON.stringify({
		// 			email: formState.inputs.email.value,
		// 			password: formState.inputs.password.value,
		// 		}),
		// 		{
		// 			"Content-Type": "application/json",
		// 		}
		// 	);
		// 	auth.login(responseData.user.id);
		// } catch (err) {}
	};

	return (
		<Fragment>
			{/* <ErrorModal error={error} onClear={clearError} /> */}
			{props.ismsg && <Alert msg={props.msg} />}
			<div className="login">
				{isLoading && <LoadingSpinner asOverlay />}
				<form
					className="border border-dark rounded"
					id="loginform"
					onSubmit={loginHandler}
				>
					<h2 className="text-center" id="title">
						Login to CryptoX
					</h2>
					<div className="mb-3">
						<label for="email" className="form-label">
							Email address
						</label>
						<input
							type="email"
							className="form-control"
							id="email"
							aria-describedby="emailHelp"
							required
						/>
						<div id="emailHelp" className="form-text">
							We'll never share your email with anyone else.
						</div>
					</div>
					<div className="mb-3">
						<label for="password" className="form-label">
							Password
						</label>
						<input
							type="password"
							className="form-control"
							id="password"
							required
						/>
					</div>
					<div className="mb-3 form-check">
						<input
							type="checkbox"
							className="form-check-input"
							id="check"
							required
						/>
						<label className="form-check-label" for="exampleCheck1">
							Check me out
						</label>
					</div>
					<div className="d-grid gap-2">
						<button type="submit" className="btn btn-primary">
							<strong>LOGIN </strong>
							<i className="fa fa-chevron-right"></i>
						</button>
					</div>
					<hr />
					<div className="reg">
						<Link to="/signup" className="nav-link active">
							Not registered yet? Register
						</Link>
						<a href="/" className="nav-link active">
							Forgot Password
						</a>
					</div>
				</form>
			</div>
		</Fragment>
	);
};

export default Login;
