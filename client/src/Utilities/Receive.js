import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import QRCode from "qrcode.react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import AuthContext from "../store/authContext";

const Receive = ({ onError }) => {
	const ctx = useContext(AuthContext);

	const [email, setEmail] = useState("...");
	const [copy, setCopy] = useState("fa fa-clone fs-4");

	useEffect(() => {
		// Getting Email of User
		const fetchData = async () => {
			try {
				const { data } = await axios.post(
					`${process.env.REACT_APP_SERVER_URL}/user/data`,
					{
						email: true,
					},
					{
						headers: {
							Authorization: "Bearer " + ctx.token,
						},
					}
				);

				setEmail(data.email);
			} catch (err) {
				// Error fetching User Info
				console.log(err.response);
				// onError(err.response.data.message);
			}
		};

		fetchData();
	}, [ctx]);

	const copyHandler = () => {
		setCopy("fa fa-check-circle-o text-success fs-4");
		setTimeout(() => {
			setCopy("fa fa-clone fs-4");
		}, 3000);
	};

	return (
		<div>
			<div className="card m-4">
				<div className="card-body">
					<QRCode className="m-3" value={email} fgColor="#d4af37" />
					<hr />
					<div className="text-start">
						<h4>Email ID</h4>
						<div className="input-group mb-3">
							<input
								type="text"
								className="form-control fs-4 rounded-0 text-secondary border-white bg-white"
								value={email}
								readOnly
							/>
							<CopyToClipboard text={email} onCopy={copyHandler}>
								<button className="btn btn-outline-white rounded-0 border-white">
									<i className={copy}></i>
								</button>
							</CopyToClipboard>
						</div>
						<p className="text-primary">*Share this Registered Email ID to receive coins</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Receive;
