import { Fragment, useState, useRef, useContext } from "react";
import { Link, useHistory } from "react-router-dom";

import "./Login.css";
import Sociallogin from "./Sociallogin";
import Alert from "../shared/components/Alert";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import AuthContext from "../store/authContext";

const Login = (props) => {
	const history = useHistory();
	const ctx = useContext(AuthContext);

	const inputRefEmail = useRef();
	const inputRefPassword = useRef();
	const [isRememberMe, setIsRememberMe] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const isRememberMeHandler = (cbevent) => {
		setIsRememberMe(cbevent.target.checked);
	};

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
						password: enteredPassword,
						toRemember: isRememberMe,
					}),
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const responseData = await res.json();

			setIsLoading(false);
			if (res.ok) {
				// Logging in now

				// Here, responseData.expiresIn is in seconds
				const expirationTime = new Date(
					new Date().getTime() + +responseData.expiresIn * 1000
				);

				ctx.login(
					responseData.token,
					responseData.userId,
					expirationTime.toISOString()
				);
				console.log(responseData);

				//Redirecting
				history.replace("/");
			} else {
				//Got an Error from server
				setError(responseData.message);
				console.log(responseData.message);
			}
		} catch (err) {
			setIsLoading(false);
			console.log(err);
			setError(err.message);
		}
	};

	const clearError = () => {
		setError(null);
	};

	return (
		<Fragment>
			{/* <ErrorModal error={error} onClear={clearError} /> */}
			{error && <Alert msg={error} onClose={clearError} />}
			<div className="login">
				{isLoading && <LoadingSpinner asOverlay />}
				<div
					className="border border-dark rounded"
					id="loginform"
				>
					<h2 className="text-center" id="title">
						Login to CryptoX
					</h2>
					<form onSubmit={loginHandler}>
						<div className="mb-3">
							<label htmlFor="email" className="form-label">
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
							<label htmlFor="password" className="form-label">
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
								onChange={isRememberMeHandler}
							/>
							<label className="form-check-label" htmlFor="check">
								Remember me
							</label>
						</div>
						<div className="d-grid gap-2">
							<button type="submit" className="btn btn-primary">
								<strong>LOGIN </strong>
								<i className="fa fa-chevron-right"></i>
							</button>
						</div>
					</form>
					<hr/>
					<Sociallogin/>
					<hr />
					<div className="reg">
						<Link to="/signup" className="nav-link active">
							Not registered yet? Register
						</Link>
						<Link to="/forgotpassword" className="nav-link active">
							Forgot Password
						</Link>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default Login;
