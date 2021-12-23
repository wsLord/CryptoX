import { Fragment, useState, useRef } from "react";
import { Link } from "react-router-dom";

import "./ForgotPassword.css";
import Alert from "../shared/components/Alert";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";

const ForgotPassword = (props) => {
	const inputRefEmail = useRef();

	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState(null);

	const resetPasswordHandler = async (event) => {
		event.preventDefault();
		setIsLoading(true);

		const enteredEmail = inputRefEmail.current.value;

		try {
			const res = await fetch(
				`${process.env.REACT_APP_SERVER_URL}/user/forgotpassword/request`,
				{
					method: "POST",
					body: JSON.stringify({
						email: enteredEmail,
					}),
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const responseData = await res.json();

			setIsLoading(false);
			if (res.ok) {
				// Reset mail sent
				setMessage(responseData.message);
				inputRefEmail.current.value = "";
				console.log(responseData);
			} else {
				// Something went wrong!
				setMessage(responseData.message);
				console.log(responseData.message);
			}
		} catch (err) {
			setIsLoading(false);
			console.log(err);
			setMessage(err.message);
		}
	};

	const clearmessage = () => {
		setMessage(null);
	};

	return (
		<Fragment>
			{/* <ErrorModal error={error} onClear={clearError} /> */}
			{message && <Alert msg={message} onClose={clearmessage} />}
			<div className="login">
				{isLoading && <LoadingSpinner asOverlay />}
				<form
					className="border border-dark rounded"
					id="resetpasswordform"
					onSubmit={resetPasswordHandler}
				>
					<h2 className="text-center" id="title">
						Reset Password
					</h2>
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
							Enter your registered email address.
						</div>
					</div>
					<div className="d-grid gap-2">
						<button type="submit" className="btn btn-primary">
							<strong>SEND RESET LINK </strong>
							<i className="fa fa-chevron-right"></i>
						</button>
					</div>
					<hr />
					<div className="fplogin">
						<Link to="/login" className="nav-link active">
							Back to Log In
						</Link>
					</div>
				</form>
			</div>
		</Fragment>
	);
};

export default ForgotPassword;
