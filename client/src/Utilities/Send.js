import React, { useContext, useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import AuthContext from "../store/authContext";

const Send = ({ coinAssetList: assetList, onError }) => {
	const history = useHistory();

	const ctx = useContext(AuthContext);

	const inputRefNotes = useRef();
	const inputRefQuantity = useRef();
	const [coinAssetList, setCoinAssetList] = useState([]);
	const [maxQuantityLimit, setMaxQuantityLimit] = useState(0);
	const [selectedCoin, setSelectedCoin] = useState({
		name: "",
		id: "",
	});
	const [verifyState, setVerifyState] = useState("verify");
	const [email, setEmail] = useState("");
	const [user, setUser] = useState("");

	useEffect(() => {
		if (assetList) {
			console.log(assetList);
			setCoinAssetList(assetList);
		}
	}, [assetList]);

	const handleSelect = (event) => {
		const coinid = event.target.value;

		coinAssetList.forEach((element) => {
			if (element.id === coinid) {
				setSelectedCoin({
					name: element.name,
					id: coinid,
				});
				setMaxQuantityLimit(element.quantity);
			}
		});
	};
	const handleEmail = (event) => {
		setEmail(event.target.value);
		setVerifyState("verify");
	};

	// Verify tosend email here
	const verifyUserHandler = async () => {
		try {
			const { data } = await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/transaction/send/verify`,
				{
					email: email,
				},
				{
					headers: {
						Authorization: "Bearer " + ctx.token,
					},
				}
			);

			if (data.isFound) {
				// set if valid
				setVerifyState("valid");
				setUser(data.name);
			} else {
				// set if invalid
				setVerifyState("invalid");
			}
		} catch (err) {
			console.log(err.response.data.message);
			onError(err.response.data.message);
		}
	};

	// Send Coin Handler
	const sendCoinHandler = async (event) => {
		event.preventDefault();

		try {
			const { data } = await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/transaction/send/`,
				{
					coinid: selectedCoin.id,
					email: email,
					quantity: inputRefQuantity.current.value,
					note: inputRefNotes.current.value,
				},
				{
					headers: {
						Authorization: "Bearer " + ctx.token,
					},
				}
			);

			console.log(data);

			// Success
			return history.push({
				pathname: "/confirm/send",
				state: {
					...data,
				},
			});
		} catch (err) {
			console.log(err.response.data.message);
			onError(err.response.data.message);
		}
	};

	return (
		<div>
			<form
				className="d-flex m-5 flex-column align-items-start"
				action=""
				onSubmit={sendCoinHandler}
			>
				<select className="form-select fs-4 p-2" onChange={handleSelect}>
					<option className="h3" value="">
						Pay with
					</option>
					{coinAssetList.map((element) => {
						return (
							<option className="fs-4" key={element.id} value={element.id}>
								{element.name}
							</option>
						);
					})}
				</select>
				{selectedCoin.name !== "" && (
					<p className="text-primary mt-3">
						Available : <span className="h5">{maxQuantityLimit}</span> {selectedCoin.name} in Assets
					</p>
				)}
				<div className="input-group mt-3 fs-3">
					<span className="input-group-text fs-4 bg-white" id="basic-addon3">
						Quantity
					</span>
					<input
						type="text"
						className="form-control"
						id="amount"
						min="0"
						max={maxQuantityLimit}
						ref={inputRefQuantity}
						required
					/>
				</div>
				<div className="input-group mt-3 fs-3">
					<span className="input-group-text fs-4 bg-white" id="basic-addon3">
						To
					</span>
					<input
						type="email"
						className="form-control"
						id="email"
						placeholder="Email ID"
						value={email}
						onChange={handleEmail}
						required
					/>
					{verifyState === "verify" && (
						<button
							className="btn btn-link fs-5"
							type="button"
							id="button-addon2"
							onClick={verifyUserHandler}
						>
							Verify
						</button>
					)}
					{verifyState === "valid" && (
						<button
							className="btn btn-link"
							type="button"
							id="button-addon2"
							onClick={verifyUserHandler}
						>
							<i className="fa fa-check-circle text-success fs-4"></i>
						</button>
					)}
					{verifyState === "invalid" && (
						<button
							className="btn btn-link"
							type="button"
							id="button-addon2"
							onClick={verifyUserHandler}
						>
							<i className="fa fa-times-circle text-danger fs-4"></i>
						</button>
					)}
				</div>
				{verifyState === "valid" && <p className="text-success">* User Name : {user}</p>}
				{verifyState === "invalid" && (
					<p className="text-danger">* No such user exists with given email ID</p>
				)}
				<div className="input-group mt-3 fs-3">
					<span className="input-group-text fs-4 bg-white" id="basic-addon3">
						Note
					</span>
					<textarea
						className="form-control"
						id="msg"
						placeholder="Optional Message"
						ref={inputRefNotes}
					/>
				</div>
				<button
					type="submit"
					className="btn btn-success fs-4 mt-3 w-100"
					disabled={verifyState !== "valid"}
				>
					Send
				</button>
			</form>
		</div>
	);
};

export default Send;
