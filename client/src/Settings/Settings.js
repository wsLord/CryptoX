import React, { Fragment, useContext, useEffect, useState } from "react";
import axios from "axios";

import AuthContext from "../store/authContext";
import Alert from "../shared/components/Alert";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";

const active = "btn btn-link fs-4 text-decoration-none";
const unactive = "btn btn-link fs-4 text-decoration-none text-secondary";
const valid = "form-control w-50 fs-3 p-2";
const unvalid = "form-control w-50 fs-3 p-2 border border-danger border-3";

const Settings = () => {
	const ctx = useContext(AuthContext);

	const [name, setName] = useState("User");
	const [email, setEmail] = useState("...");
	const [mobile, setMobile] = useState("..........");
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const [validity, setValidity] = useState({
		new: valid,
		confirm: valid,
	});
	const [mode, setMode] = useState({
		profile: active,
		security: unactive,
	});

	useEffect(() => {
		// Getting User Info
		const fetchData = async () => {
			try {
				const { data } = await axios.post(
					`${process.env.REACT_APP_SERVER_URL}/user/data`,
					{
						name: true,
						email: true,
						mobile: true,
					},
					{
						headers: {
							Authorization: "Bearer " + ctx.token,
						},
					}
				);

				setName(data.name);
				setMobile(data.mobile);
				setEmail(data.email);
			} catch (err) {
				// Error fetching User Info
				console.log(err);
				setError(err.response.data.message);
			}
		};

		fetchData();
	}, [ctx]);

	const updateUserInfoHandler = async (event) => {
		event.preventDefault();
		setIsLoading(true);

		try {
			const { data } = await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/user/data/update`,
				{
					name,
					mobile,
				},
				{
					headers: {
						Authorization: "Bearer " + ctx.token,
					},
				}
			);

			console.log(data);
			setError("Info Updated Successfully!");
			setIsLoading(false);
		} catch (err) {
			// Something went wrong!
			setIsLoading(false);
			setError(err.response.data.message);
			console.log(err);
		}
	};

	const changePasswordHandler = async (event) => {
		event.preventDefault();
		setIsLoading(true);

		if (newPassword !== confirmPassword) {
			setError("New Password & Confirm Password must be same!");
			setIsLoading(false);
			return;
		}

		try {
			const { data } = await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/user/changepassword`,
				{
					oldPassword,
					newPassword,
				},
				{
					headers: {
						Authorization: "Bearer " + ctx.token,
					},
				}
			);

			console.log(data);
			setError("Password Changed Successfully!");

			// Clearing the form
			setOldPassword("");
			setNewPassword("");
			setConfirmPassword("");
			setIsLoading(false);
		} catch (err) {
			// Something went wrong!
			setIsLoading(false);
			setError(err.response.data.message);
			console.log(err);
		}
	};

	const setProfile = () => {
		setMode({
			profile: active,
			security: unactive,
		});
	};
	const setSecurity = () => {
		setMode({
			profile: unactive,
			security: active,
		});
	};

	const inputNameHandler = (event) => {
		setName(event.target.value);
	};
	const inputMobileHandler = (event) => {
		setMobile(event.target.value);
	};
	const oldPasswordHandler = (event) => {
		setOldPassword(event.target.value);
	};
	const newPasswordHandler = (event) => {
		setNewPassword(event.target.value);
		if (confirmPassword !== event.target.value) {
			setValidity({
				new: unvalid,
				confirm: unvalid,
			});
		} else {
			setValidity({
				new: valid,
				confirm: valid,
			});
		}
	};
	const confirmPasswordHandler = (event) => {
		setConfirmPassword(event.target.value);
		if (newPassword !== event.target.value) {
			setValidity({
				new: unvalid,
				confirm: unvalid,
			});
		} else {
			setValidity({
				new: valid,
				confirm: valid,
			});
		}
	};

	const clearError = () => {
		setError(null);
	};

	return (
		<Fragment>
			{error && <Alert msg={error} onClose={clearError} />}
			<div className="h2 mt-5 ms-5 text-start">Settings</div>
			<div className="card m-5">
				{isLoading && <LoadingSpinner asOverlay />}
				<div className="card-body">
					<div className="d-flex justify-content-start">
						<button type="button" className={mode.profile} onClick={setProfile}>
							Profile
						</button>
						<button
							type="button"
							className={mode.security}
							onClick={setSecurity}
						>
							Security
						</button>
					</div>
					<hr />
					{mode.profile === active && (
						<div>
							<form
								className="d-flex p-3 flex-column align-items-start"
								onSubmit={updateUserInfoHandler}
							>
								<label htmlFor="name" className="form-label fs-4 p-2">
									Display Name
								</label>
								<input
									type="text"
									className="form-control w-50 fs-3 p-2"
									id="name"
									value={name}
									onChange={inputNameHandler}
									required
								/>
								<label htmlFor="phone" className="form-label  fs-4 p-2">
									Mobile Number
								</label>
								<input
									type="phone"
									className="form-control w-50 fs-3 p-2"
									id="phone"
									value={mobile}
									onChange={inputMobileHandler}
									required
								/>
								<label htmlFor="email" className="form-label  fs-4 p-2">
									Email ID
								</label>
								<input
									type="email"
									className="form-control w-50 fs-3 p-2"
									id="email"
									value={email}
									readOnly
								/>
								<button type="submit" className="btn btn-success fs-5 mt-3 p-2">
									Save
								</button>
							</form>
						</div>
					)}
					{mode.security === active && (
						<div>
							<form
								className="d-flex p-3 flex-column align-items-start"
								onSubmit={changePasswordHandler}
							>
								<label htmlFor="oldpassword" className="form-label fs-4 p-2">
									Current Password
								</label>
								<input
									type="password"
									className="form-control w-50 fs-3 p-2"
									id="oldpassword"
									value={oldPassword}
									onChange={oldPasswordHandler}
									required
								/>

								<label htmlFor="newpassword" className="form-label  fs-4 p-2">
									New Password
								</label>
								<input
									type="password"
									className={validity.new}
									id="newpassword"
									value={newPassword}
									onChange={newPasswordHandler}
									minLength={6}
									required
								/>

								<label
									htmlFor="confirmpassword"
									className="form-label  fs-4 p-2"
								>
									Confirm New Password
								</label>
								<input
									type="password"
									className={validity.confirm}
									id="confirmpassword"
									value={confirmPassword}
									onChange={confirmPasswordHandler}
									minLength={6}
									required
								/>

								<button type="submit" className="btn btn-success fs-5 mt-3 p-2">
									Change & Save
								</button>
							</form>
						</div>
					)}
				</div>
			</div>
		</Fragment>
	);
};

export default Settings;
