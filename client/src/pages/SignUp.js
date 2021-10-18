import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import "./SignUp.css";
import Alert from "../shared/components/Alert";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";

const SignUp = (props) => {
	const { refCode } = useParams();
	
	const inputRefName = useRef();
	const inputRefEmail = useRef();
	const inputRefMobile = useRef();
	const [enteredPassword, setEnteredPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [referralCode, setReferralCode] = useState(refCode || '');

	const [Style, setStyle] = useState({
		backgroundColor: ""
	});

	const [isLoading, setIsLoading] = useState(false);
	// const [error, setError] = useState(null);

	const signupHandler = async (event) => {
		event.preventDefault();
		setIsLoading(true);

		const enteredName = inputRefName.current.value;
		const enteredEmail = inputRefEmail.current.value;
		const enteredMobile = inputRefMobile.current.value;

		try {
			const res = await fetch(
				`${process.env.REACT_APP_SERVER_URL}/user/signup`,
				{
					method: "POST",
					body: JSON.stringify({
						name: enteredName,
						email: enteredEmail,
						password: enteredPassword,
						mobile: enteredMobile,
						referral: referralCode
					}),
					headers: {
						"Content-Type": "application/json"
					}
				}
			);

			const responseData = await res.json();

			setIsLoading(false);
			if (res.ok) {
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

	let passwordHandler = (event) => {
		setEnteredPassword(event.target.value);

		if (confirmPassword !== event.target.value) {
			setStyle({
				backgroundColor: "lightcoral"
			});
		} else {
			setStyle({
				backgroundColor: "white"
			});
		}
	}

	let confirmPasswordHandler = (event) => {
		setConfirmPassword(event.target.value);

		if (enteredPassword !== event.target.value) {
			setStyle({
				backgroundColor: "lightcoral"
			});
		} else {
			setStyle({
				backgroundColor: "white"
			});
		}
	}

	let referralCodeHandler = (event) => {
		setReferralCode(event.target.value);
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
						<label htmlFor="name" className="form-label">
							Name
						</label>
						<input
							type="text"
							className="form-control"
							id="name"
							ref={inputRefName}
							required
						/>
					</div>
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
					<div id="password">
						<div className="mb-3">
							<label htmlFor="password" className="form-label">
								Password
							</label>
							<input
								style={Style}
								type="password"
								className="form-control"
								id="password"
								value={enteredPassword}
								minLength={6}
								onChange={passwordHandler}
								required
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="confirm-password" className="form-label">
								Confirm Password
							</label>
							<input
								style={Style}
								type="password"
								className="form-control"
								id="confirm-password"
								value={confirmPassword}
								onChange={confirmPasswordHandler}
								required
							/>
						</div>
					</div>
					<div className="mb-3">
						<label htmlFor="phone" className="form-label">
							Mobile Number
						</label>
						<input
							type="phone"
							className="form-control"
							id="phone"
							ref={inputRefMobile}
							required
						/>
					</div>
					<label htmlFor="referral" className="form-label">
						Referral Code (Optional)
					</label>
					<div className="input-group mb-3">
						<input
							type="text"
							className="form-control"
							id="referral"
							value={referralCode}
							onChange={referralCodeHandler}
						/>
					</div>
					<div className="d-grid gap-2">
						<button type="submit" className="btn btn-primary">
							<strong>SIGNUP </strong>
							<i className="fa fa-chevron-right"></i>
						</button>
					</div>
					<hr />
					<div className="social">
						<button type="button" className="btn btn-danger"><i className="fa fa-google-plus"> <span> Sign in with Google+</span></i></button>
						<button type="button" className="btn btn-primary"><i className="fa fa-facebook"> <span> Login with Facebook</span></i></button>
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
