import { Fragment, useState } from "react";
import { Link } from "react-router-dom";

import "./SignUp.css";
import Alert from "../shared/components/Alert";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";

const SignUp = (props) => {
	const [isLoading, setIsLoading] = useState(false);

	const signupHandler = async (event) => {
		event.preventDefault();

		console.log(event);

		// try {
		// 	const responseData = await sendRequest(
		// 		"http://localhost:5000/users/signup",
		// 		"POST",
		// 		JSON.stringify({
		// 			name: formState.inputs.name.value,
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
		<div>
			{props.ismsg && <Alert msg={props.msg} />}
			{/* <ErrorModal error={error} onClear={clearError} /> */}
			<div className="login" id="signup">
				{isLoading && <LoadingSpinner asOverlay />}
				<form
					className="border border-dark rounded"
					id="signupform"
					onSubmit={signupHandler}
				>
					<h2 className="text-center" id="title">
						Signup to CryptoX
					</h2>
					<div className="mb-3">
						<label for="name" className="form-label">
							Name
						</label>
						<input type="text" className="form-control" id="name" required />
					</div>
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
					<div id="password">
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
						<div className="mb-3">
							<label for="password" className="form-label">
								Confirm Password
							</label>
							<input
								type="password"
								className="form-control"
								id="password"
								required
							/>
						</div>
					</div>
					<div className="mb-3">
						<label for="phone" className="form-label">
							Mobile Number
						</label>
						<input type="phone" className="form-control" id="phone" required />
					</div>
					<label for="referral" className="form-label">
						Referral Code (Optional)
					</label>
					<div className="input-group mb-3">
						<div className="input-group-text">
							<input
								className="form-check-input mt-0"
								type="checkbox"
								value=""
							/>
						</div>
						<input type="text" className="form-control" id="referral" />
					</div>
					<div className="d-grid gap-2">
						<button type="submit" className="btn btn-primary">
							<strong>SIGNUP </strong>
							<i className="fa fa-chevron-right"></i>
						</button>
					</div>
					<hr />
					<div className="reg">
						<Link to="/login" className="nav-link active">
							Already registered? Login
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
