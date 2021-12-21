import React, { Fragment, useContext, useEffect, useRef } from "react";
import { useState } from "react";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
	FacebookShareButton,
	FacebookIcon,
	WhatsappShareButton,
	WhatsappIcon,
	TelegramShareButton,
	TelegramIcon,
} from "react-share";

import Alert from "../shared/components/Alert";
import Styles from "./referral.module.css";
import img from "../shared/img/referral.jpg";
import AuthContext from "../store/authContext";

const Referral = (props) => {
	const ctx = useContext(AuthContext);

	const [name, setName] = useState("User");
	const [link, setLink] = useState("Loading..."); //`${window.location.host}/signup/${referralCode}`
	const [copyBtn, setCopyBtn] = useState({
		copied: false,
		btntext: "Copy link",
	});
	const [error, setError] = useState(null);
	const inputRefEmail = useRef();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { data } = await axios.post(
					`${process.env.REACT_APP_SERVER_URL}/user/data`,
					{
						name: true,
						referralID: true,
					},
					{
						headers: {
							Authorization: "Bearer " + ctx.token,
						},
					}
				);

				setName(data.name);
				setLink(`${window.location.host}/signup/${data.referralID}`);
			} catch (err) {
				// Error fetching Refferal Code
				console.log(err.response.data.message);
				setLink("Unable to fetch link! :(");
			}
		};

		fetchData();

		return () => {
			setName("");
			setLink("");
		};
	}, [ctx]);

	const copyHandler = () => {
		setCopyBtn({
			copied: true,
			btntext: "Copied!",
		});
		setTimeout(() => {
			setCopyBtn({
				copied: false,
				btntext: "Copy link",
			});
		}, 3000);
	};

	const inviteHandler = async (event) => {
		event.preventDefault();

		const emailToSendInvite = inputRefEmail.current.value;
		try {
			let { data } = await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/referral/invite`,
				{
					inviteLink: link,
					emailToSend: emailToSendInvite,
				}
			);

			console.log(data.message);
			inputRefEmail.current.value = "";
			setError("Invitation sent!");
		} catch (err) {
			// Error sending mail
			console.log(err.response.data.message);
			setError(err.response.data.message);
		}
	};

	const clearError = () => {
		setError(null);
	};

	return (
		<Fragment>
			{error && <Alert msg={error} onClose={clearError} />}
			<div className="d-flex" id={Styles.body}>
				<div className="w-100" id={Styles.left}>
					<h1>Hey {name}, invite a friend to CryptoX and you'll both get ₹100</h1>
					<p className="text-secondary" id={Styles.text}>
						The referral program lets you earn a bonus for each friend
						(“invitee”) who signs up and makes a crypto trade using your
						personal signup link.
					</p>
					<div id={Styles.send} className="input-group mb-3">
						<input
							id={Styles.link}
							type="text"
							value={link}
							className="form-control"
							readOnly
						/>
						<CopyToClipboard text={link} onCopy={copyHandler}>
							<button className="btn btn-link" type="button">
								<strong> {copyBtn.btntext} </strong>
							</button>
						</CopyToClipboard>
					</div>
					<form
						className="input-group mb-3"
						id={Styles.send}
						onSubmit={inviteHandler}
					>
						<input
							type="email"
							className="form-control"
							placeholder="Enter email address"
							ref={inputRefEmail}
							required
						/>
						<button className="btn btn-success" type="submit">
							<strong> Send </strong>
						</button>
					</form>
					<div id={Styles.share} className="card text-dark mb-3">
						<div className="card-header bg-white">Share your link</div>
						<div className="card-body d-flex justify-content-center">
							<FacebookShareButton
								url={link}
								quote={"Join CryptoX"}
								className={Styles.social}
							>
								<FacebookIcon size={45} round={true} />
							</FacebookShareButton>
							<WhatsappShareButton
								url={link}
								title={"Join CryptoX"}
								separator=": "
								className={Styles.social}
							>
								<WhatsappIcon size={45} round={true} />
							</WhatsappShareButton>
							<TelegramShareButton
								url={link}
								title={"Join CryptoX"}
								separator=": "
								className={Styles.social}
							>
								<TelegramIcon size={45} round={true} />
							</TelegramShareButton>
						</div>
					</div>
				</div>
				<div className="w-100">
					<img className="img-fluid" src={img} alt="" />
				</div>
			</div>
		</Fragment>
	);
};

export default Referral;
