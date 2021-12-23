import { Fragment, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

import Styles from "./ResetPassword.module.css";
import Alert from "../shared/components/Alert";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import axios from "axios";

const ResetPassword = () => {
	const { token } = useParams();
	const history = useHistory();

	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState(null);
	const [enteredPassword, setEnteredPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [Style, setStyle] = useState({
		backgroundColor: "",
	});

	// Redirecting after reset
	const [seconds, setSeconds] = useState(-1);

	useEffect(() => {
		if (seconds > 0) {
			setMessage(
				`Password Reset successful! Redirecting in ${seconds} seconds...`
			);
			setTimeout(() => {
				setSeconds((prevSeconds) => {
					return prevSeconds - 1;
				});
			}, 1000);
		} else if (seconds === 0) {
			//Redirecting
			history.replace("/login");
		}
	}, [seconds, history]);

	const resetPasswordHandler = async (event) => {
		event.preventDefault();
		setIsLoading(true);

		if (enteredPassword !== confirmPassword) {
			setMessage("Password & Confirm Password must be same!");
			setIsLoading(false);
			return;
		}

		try {
			const responseData = await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/forgotpassword/reset`,
				{
					newPassword: enteredPassword,
					token: token,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			setIsLoading(false);
			
			// Registered and Email Verification Sent
			setSeconds(5);
			console.log(responseData);

			// Clearing the form
			setEnteredPassword("");
			setConfirmPassword("");
		} catch (err) {
			// Something went wrong!
			setIsLoading(false);
			setMessage(err.response.data.message);
			console.log(err);
		}
	};

	let passwordHandler = (event) => {
		setEnteredPassword(event.target.value);

		if (confirmPassword !== event.target.value) {
			setStyle({
				backgroundColor: "lightcoral",
			});
		} else {
			setStyle({
				backgroundColor: "white",
			});
		}
	};

	let confirmPasswordHandler = (event) => {
		setConfirmPassword(event.target.value);

		if (enteredPassword !== event.target.value) {
			setStyle({
				backgroundColor: "lightcoral",
			});
		} else {
			setStyle({
				backgroundColor: "white",
			});
		}
	};

	const clearmessage = () => {
		setMessage(null);
	};

	return (
		<Fragment>
			{message && <Alert msg={message} onClose={clearmessage} />}
			<div className={Styles.box}>
				{isLoading && <LoadingSpinner asOverlay />}
				<div className="card" id={Styles.card}>
					<h2>Set New Password</h2>
					<form id={Styles.form} onSubmit={resetPasswordHandler}>
						<div class="mb-3">
							<label htmlFor="password" class="form-label">
								New Password
							</label>
							<input
								style={Style}
								type="password"
								class="form-control"
								id="password"
								value={enteredPassword}
								onChange={passwordHandler}
								minLength={6}
								required
							/>
						</div>
						<div class="mb-3">
							<label HtmlFor="confirm-password" class="form-label">
								Confirm Password
							</label>
							<input
								style={Style}
								type="password"
								class="form-control"
								id="confirm-password"
								value={confirmPassword}
								onChange={confirmPasswordHandler}
								minLength={6}
								required
							/>
						</div>
						<button type="submit" class="btn btn-primary p-2.5 w-100">
							<strong> Change </strong>
							<i className="fa fa-chevron-right"></i>
						</button>
					</form>
				</div>
			</div>
		</Fragment>
	);
};

export default ResetPassword;
