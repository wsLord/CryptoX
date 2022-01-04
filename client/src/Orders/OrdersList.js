import React, { Fragment, useContext, useEffect, useState } from "react";
import axios from "axios";

import PendingOrders from "./PendingOrders";
import CompletedOrders from "./CompletedOrders";
import AuthContext from "../store/authContext";
import Alert from "../shared/components/Alert";

const OrdersList = () => {
	const ctx = useContext(AuthContext);

	const [pendingList, setPendingList] = useState([]);
	const [completedList, setCompletedList] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { data } = await axios.get(
					`${process.env.REACT_APP_SERVER_URL}/transaction/data/orders`,
					{
						headers: {
							Authorization: "Bearer " + ctx.token,
						},
					}
				);

				console.log(data);
				setPendingList(data.pendingOrders);
				setCompletedList(data.otherOrders);
			} catch (err) {
				console.log(err);
				// console.log(err.response.data.message);
				setError("Something went wrong!");
			}
		};

		fetchData();
	}, [ctx]);

	const clearError = () => {
		setError(null);
	};

	return (
		<Fragment>
			{error && <Alert msg={error} onClose={clearError} />}
			<div className="d-flex">
				<div class="card w-50 m-4 h-100">
					<div className="card-header text-start h3">Pending Orders</div>
					<div class="card-body">
						<PendingOrders pendingOrderList={pendingList} />
					</div>
				</div>
				<div class="card w-50 m-4 h-100">
					<div className="card-header text-start h3">Completed Orders</div>
					<div class="card-body">
						<CompletedOrders completedOrderList={completedList} />
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default OrdersList;
