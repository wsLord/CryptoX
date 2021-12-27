import React from "react";
import { useHistory } from "react-router-dom";

import SuccessLogo from "../shared/img/Success.gif";
import FailedLogo from "../shared/img/failed.gif";
import Styles from "./BuySellConfirm.module.css";

const SendCoinConfirmation = (props) => {
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
								{data.sentQuantity} {data.coinSymbol.toUpperCase()} {" "} {`(${data.coinName}) `} Sent
							</p>
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">Transaction ID: </p>
								<p className="h5">{data.transactionID}</p>
							</div>
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">To: </p>
								<p className="h5">{data.toEmail}</p>
							</div>
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">Total Quantity: </p>
								<p className="h5">
									{data.totalQuantity} {data.coinSymbol.toUpperCase()}
								</p>
							</div>
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">Transaction Charges: </p>
								<p className="h5">
									&#x20B9; {data.chargedMoney} ({data.chargedQuantity} {data.coinSymbol.toUpperCase()})
								</p>
							</div>
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">Actual Quantity Sent: </p>
								<p className="h5">
									{data.sentQuantity} {data.coinSymbol.toUpperCase()}
								</p>
							</div>
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">Notes: </p>
								<p className="h5">
									{data.note}
								</p>
							</div>
						</div>
						<button
							type="button"
							class="btn btn-success"
							id={Styles.back}
							onClick={() => {
								history.push("/exchange");
							}}
						>
							Back to Exchange
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
								<p className="h5 me-5">To: </p>
								<p className="h5">{data.toEmail}</p>
							</div>
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">Quantity: </p>
								<p className="h5">
									{data.quantity} {data.coinSymbol.toUpperCase()}
								</p>
							</div>
							<hr />
							<div className="d-flex justify-content-between">
								<p className="h5 me-5">Notes: </p>
								<p className="h5">{data.note}</p>
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
								history.push("/exchange");
							}}
						>
							Back to Exchange
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default SendCoinConfirmation;
