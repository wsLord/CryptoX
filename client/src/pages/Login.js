import { Fragment, useState, useRef } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import Alert from "../shared/components/Alert";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";

const Login = (props) => {
	const inputRefEmail = useRef();
	const inputRefPassword = useRef();

	const [isLoading, setIsLoading] = useState(false);
	// const [error, setError] = useState("baat hai");

	const loginHandler = async (event) => {
		event.preventDefault();
		setIsLoading(true);

		const enteredEmail = inputRefEmail.current.value;
		const enteredPassword = inputRefPassword.current.value;

		try {
			const res = await fetch(
				`${process.env.REACT_APP_SERVER_URL}/user/login`,
				{
					method: "POST",
					body: JSON.stringify({
						email: enteredEmail,
						password: enteredPassword
					}),
					headers: {
						"Content-Type": "application/json"
					}
				}
			);

			const responseData = await res.json();

			setIsLoading(false);
			if(res.ok) {
				// logged in
				
				console.log(responseData);

			}
			else {
				console.log(responseData.message);
			}

			// auth.login(responseData.user.id);
		} catch (err) {
			setIsLoading(false);
			console.log(err);
		}
	};

	// const clearError = () => {
	// 	setError(null);
	// }

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
							ref={inputRefEmail}
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
							ref={inputRefPassword}
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
