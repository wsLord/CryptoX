import React from "react";
import { useHistory } from "react-router-dom";

import SuccessLogo from "../shared/img/Success.gif";
import FailedLogo from "../shared/img/failed.gif";
import Styles from "./BuySellConfirm.module.css";

const ExchangeConfirmation = (props) => {
	const history = useHistory();

	const data = props.location.state;

	return (
		<div>
			{data.success && (
				<div class="card shadow p-3 mb-5 bg-body rounded" id={Styles.card}>
					<div class="card-body d-flex flex-column justify-content-center align-items-center">
						<img src={SuccessLogo} id={Styles.simg} alt="..." />
						<div className="details">
							<h2>Transaction Successful</h2>
							<p className="h4 text-primary">
								{data.toCoinQuantity} {data.toCoinSymbol} added to your assets
							</p>
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">Transaction ID: </p>
								<p className="h5">{data.transactionID}</p>
							</div>
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">From Coin: </p>
								<p className="h5">{data.fromCoinName + " (" + data.fromCoinSymbol + ")"}</p>
							</div>
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">Total Quantity: </p>
								<p className="h5">
									{data.totalQuantity} {data.fromCoinSymbol}
								</p>
							</div>
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">To Coin: </p>
								<p className="h5">{data.toCoinName + " (" + data.toCoinSymbol + ")"}</p>
							</div>
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">Transaction Charges: </p>
								<p className="h5">
									&#x20B9; {data.chargedMoney} ({data.chargedQuantity} {data.fromCoinSymbol})
								</p>
							</div>
							<hr />
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">Updated {data.fromCoinName}: </p>
								<p className="h5">
									{data.fromUpdatedQuantity} {data.fromCoinSymbol}
								</p>
							</div>
							<hr />
						</div>
						<button
							type="button"
							class="btn btn-success"
							id={Styles.back}
							onClick={() => {
								history.push("/portfolio");
							}}
						>
							Go to Portfolio
						</button>
					</div>
				</div>
			)}
			{!data.success && (
				<div class="card shadow p-3 mb-5 bg-body rounded" id={Styles.card}>
					<div class="card-body d-flex flex-column justify-content-center align-items-center">
						<img src={FailedLogo} id={Styles.simg} alt="..." />
						<div className="details">
							<h2>Transaction Failed</h2>
							<p className="h4 text-primary">Here's what we know</p>
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">Transaction ID: </p>
								<p className="h5">{data.transactionID}</p>
							</div>
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">Status: </p>
								<p className="h5">{data.status}</p>
							</div>
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">From Coin: </p>
								<p className="h5">{data.fromCoinName + " (" + data.fromCoinSymbol + ")"}</p>
							</div>
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">Total Quantity: </p>
								<p className="h5">
									{data.totalQuantity} {data.fromCoinSymbol}
								</p>
							</div>
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">To Coin: </p>
								<p className="h5">{data.toCoinName + " (" + data.toCoinSymbol + ")"}</p>
							</div>
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">Error: </p>
								<p className="h5">{data.message}</p>
							</div>
							<hr />
						</div>
						<button
							type="button"
							class="btn btn-danger"
							id={Styles.back}
							onClick={() => {
								history.push("/portfolio");
							}}
						>
							Go to Portfolio
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default ExchangeConfirmation;