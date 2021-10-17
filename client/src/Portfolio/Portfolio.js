import React, { Fragment, useState } from "react";

import Styles from "./portfolio.module.css";
import addMoneyimg from "../shared/img/add-money.png";
import withdrawimg from "../shared/img/withdraw.png";
import Transactionimg from "../shared/img/Transaction.png";
import AddMoney from "./AddMoney";
import Withdraw from "./Withdraw";
import Transaction from "./Transaction";
import Assets from "./Assets";

export default function Portfolio() {
	const [State, setState] = useState({
		addMoney: false,
		withdraw: false,
		transaction: false,
	});
	const onClickAdd = () => {
		setState({
			addMoney: !State.addMoney,
			withdraw: false,
			transaction: false,
		});
	};
	const onClickWithdraw = () => {
		setState({
			addMoney: false,
			withdraw: !State.withdraw,
			transaction: false,
		});
	};
	const onClickTransaction = () => {
		setState({
			addMoney: false,
			withdraw: false,
			transaction: !State.transaction,
		});
	};
	return (
		<Fragment>
			<div className="d-flex justify-content-around" id={Styles.top}>
				<div className="w-100 h-100" id={Styles.cards}>
					<div className="card">
						<div className="card-header ">
							<h3>Wallet</h3>
						</div>
						<div className="card-body d-flex justify-content-around">
							<div className="d-flex flex-column align-items-center justify-content-center">
								<h1>Balance:</h1>
								<h2 className="text-secondary">&#x20B9; 123</h2>
							</div>
							<div className="vr"></div>
							<div className="d-flex flex-column">
								<button
									type="button"
									onClick={onClickAdd}
									className="btn btn-outline-dark m-2 align-left"
								>
									<img className={Styles.icon} src={addMoneyimg} alt="" />
									<span className={Styles.text}> Add Money</span>
								</button>
								<button
									type="button"
									onClick={onClickWithdraw}
									className="btn btn-outline-dark m-2"
								>
									<img className={Styles.icon} src={withdrawimg} alt="" />
									<span className={Styles.text}> Withdraw</span>
								</button>
								<button
									type="button"
									onClick={onClickTransaction}
									className="btn btn-outline-dark m-2"
								>
									<img className={Styles.icon} src={Transactionimg} alt="" />
									<span className={Styles.text}> Your Transactions</span>
								</button>
							</div>
						</div>
					</div>
					<br />
					<Assets />
				</div>
				<div className="w-100">
					{State.addMoney && <AddMoney />}
					{State.withdraw && <Withdraw />}
					{State.transaction && <Transaction />}
					<div className="card w-100">
						<div className="card-header ">
							<h3>Daily Report</h3>
						</div>
						<div className="card-body">
							<span className="placeholder col-12"></span>
							<span className="placeholder col-12"></span>
							<span className="placeholder col-12"></span>
							<span className="placeholder col-12"></span>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
}
