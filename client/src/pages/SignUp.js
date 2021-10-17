import { useRef, useState } from "react";
import { Link } from "react-router-dom";

import "./SignUp.css";
import Alert from "../shared/components/Alert";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";

const SignUp = (props) => {
	const inputRefName = useRef();
	const inputRefEmail = useRef();
	const inputRefPassword = useRef();
	const inputRefMobile = useRef();
	const inputRefReferralCode = useRef();

	const [isLoading, setIsLoading] = useState(false);
	// const [error, setError] = useState(null);

	const signupHandler = async (event) => {
		event.preventDefault();
		setIsLoading(true);

		const enteredName = inputRefName.current.value;
		const enteredEmail = inputRefEmail.current.value;
		const enteredPassword = inputRefPassword.current.value;
		const enteredMobile = inputRefMobile.current.value;
		const enteredReferralCode = inputRefReferralCode.current.value;

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
						referral: enteredReferralCode
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

	const [check, setcheck] = useState({
		pass: "",
		confirmpass: ""
	});

	const [Style, setStyle] = useState({
		backgroundColor: ""
	})

	let handlepassword = (event) => {
		console.log("-->",event.target.value);
		setcheck({
			pass: event.target.value,
			confirmpass: check.confirmpass
		})
		if (check.confirmpass !== event.target.value) {
			setStyle({
				backgroundColor: "lightcoral"
			})
		}
		else {
			setStyle({
				backgroundColor: "lightgreen"
			})
		}
	}
	let handlechange = (event) => {
		setcheck({
			confirmpass: event.target.value,
			pass: check.pass
		})
		if (event.target.value !== check.pass) {
			setStyle({
				backgroundColor: "lightcoral"
			})
		}
		else {
			setStyle({
				backgroundColor: "lightgreen"
			})
		}
	}

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
								ref={inputRefPassword}
								minLength={6}
								onInput={handlepassword}
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
								onInput={handlechange}
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
							ref={inputRefReferralCode}
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
						<button type="button" class="btn btn-danger"><i class="fa fa-google-plus"> <span> Sign in with Google+</span></i></button>
						<button type="button" class="btn btn-primary"><i class="fa fa-facebook"> <span> Login with Facebook</span></i></button>
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
