import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";

const CompletedOrders = ({ completedOrderList }) => {
	const history = useHistory();

	return (
		<Fragment>
			<table class="table">
				<thead>
					<tr>
						<th scope="col">Type</th>
						<th scope="col">Date (Order placed)</th>
						<th scope="col">Status</th>
						<th scope="col">Coin ID</th>
						<th scope="col">Quantity</th>
						<th scope="col">Triggered Price</th>
						<th scope="col">Buy/Sell Price</th>
					</tr>
				</thead>
				<tbody>
					{completedOrderList.map((element) => {
						return (
							<tr>
								<td className="h5">{element.type}</td>
								<td>{new Date(element.date).toString().slice(0, -31)}</td>
								{element.actualPrice !== "-" && <td className="text-success">{element.status}</td>}
								{element.actualPrice === "-" && <td className="text-danger">{element.status}</td>}
								<td>{element.coinID}</td>
								<td>{element.quantity}</td>
								<td>&#8377; {element.triggerPrice}</td>
								<td>&#8377; {element.actualPrice}</td>
								<button
									type="button"
									className="btn btn-light bg-transparent"
									onClick={() => {
										history.push({
											pathname: "/transactions/" + element.nextPath,
											state: {
												tid: element.id,
											},
										});
									}}
								>
									<i className="fa fa-chevron-right"></i>
								</button>
							</tr>
						);
					})}
				</tbody>
			</table>
		</Fragment>
	);
};

export default CompletedOrders;
