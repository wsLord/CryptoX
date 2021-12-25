import React, { useContext, useState, useEffect } from "react";
import axios from "axios";

import Send from "./Send";
import Receive from "./Receive";
import Convert from "./Convert";
import img from "../shared/img/coin.gif";
import AuthContext from "../store/authContext";

const activeItem = "nav-item border-top border-primary border-3 rounded";
const unactiveItem = "nav-item";
const activeLink = "nav-link active";
const unactiveLink = "nav-link";

const Exchange = () => {
	const ctx = useContext(AuthContext);

	const [style, setStyle] = useState({
		sendItem: activeItem,
		sendLink: activeLink,
		receiveItem: unactiveItem,
		receiveLink: unactiveLink,
		convertItem: unactiveItem,
		convertLink: unactiveLink,
	});
	const [coinAssetList, setCoinAssetList] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch id and amount of coins in assets from database
				let { data } = await axios.get(
					`${process.env.REACT_APP_SERVER_URL}/user/assets`,
					{
						headers: {
							Authorization: "Bearer " + ctx.token,
						},
					}
				);

				setCoinAssetList(data);
			} catch (err) {
				console.log(err.response.data.message);
				// onAlert(err.response.data.message);
			}
		};

		fetchData();
	}, [ctx]);

	const handleClick = (event) => {
		if (event === "send") {
			setStyle({
				sendItem: activeItem,
				sendLink: activeLink,
				receiveItem: unactiveItem,
				receiveLink: unactiveLink,
				convertItem: unactiveItem,
				convertLink: unactiveLink,
			});
		} else if (event === "receive") {
			setStyle({
				sendItem: unactiveItem,
				sendLink: unactiveLink,
				receiveItem: activeItem,
				receiveLink: activeLink,
				convertItem: unactiveItem,
				convertLink: unactiveLink,
			});
		} else {
			setStyle({
				sendItem: unactiveItem,
				sendLink: unactiveLink,
				receiveItem: unactiveItem,
				receiveLink: unactiveLink,
				convertItem: activeItem,
				convertLink: activeLink,
			});
		}
	};

	return (
		<div>
			<div className="card m-5">
				<div className="card-body">
					<ul className="nav nav-tabs fs-4">
						<li className={style.sendItem}>
							<button
								className={style.sendLink}
								value="send"
								onClick={() => handleClick("send")}
							>
								Send
							</button>
						</li>
						<li className={style.receiveItem}>
							<button
								className={style.receiveLink}
								onClick={() => handleClick("receive")}
							>
								Receive
							</button>
						</li>
						<li className={style.convertItem}>
							<button
								className={style.convertLink}
								onClick={() => handleClick("convert")}
							>
								Convert
							</button>
						</li>
					</ul>
					<div className="d-flex">
						<div className="col-6">
							{style.sendItem === activeItem && (
								<Send coinAssetList={coinAssetList} />
							)}
							{style.receiveItem === activeItem && <Receive />}
							{style.convertItem === activeItem && (
								<Convert coinAssetList={coinAssetList} />
							)}
						</div>
						<img className="col-6 mt-3" src={img} alt="" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Exchange;
