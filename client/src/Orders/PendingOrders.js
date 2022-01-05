import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";

const PendingOrders = ({ pendingOrderList }) => {
	const history = useHistory();

	return (
		<Fragment>
			<table class="table">
				<thead>
					<tr>
						<th scope="col">Type</th>
						<th scope="col">Date (Order placed)</th>
						<th scope="col">Coin ID</th>
						<th scope="col">Quantity</th>
						<th scope="col">Trigger Price</th>
					</tr>
				</thead>
				<tbody>
					{pendingOrderList.map((element) => {
						return (
							<tr>
								<td className="h5">{element.type}</td>
								<td>{new Date(element.date).toString().slice(0, -31)}</td>
								<td>{element.coinID}</td>
								<td>{element.quantity}</td>
								<td>&#8377; {element.triggerPrice}</td>
								<td>
									<button
										type="button"
										class="btn btn-outline-danger"
										data-bs-toggle="modal"
										data-bs-target="#staticBackdrop"
									>
										Cancel
									</button>
									<div
										class="modal fade"
										id="staticBackdrop"
										data-bs-backdrop="static"
										data-bs-keyboard="false"
										tabindex="-1"
										aria-labelledby="staticBackdropLabel"
										aria-hidden="true"
									>
										<div class="modal-dialog">
											<div class="modal-content">
												<div class="modal-header">
													<h5 class="modal-title" id="staticBackdropLabel">
														Cancel Order
													</h5>
													<button
														type="button"
														class="btn-close"
														data-bs-dismiss="modal"
														aria-label="Close"
													></button>
												</div>
												<div class="modal-body h4">
													<i class="fa fa-exclamation-circle fs-1"></i>
													<p>Are you sure?</p>
												</div>
												<div class="modal-footer">
													<button type="button" class="btn btn-light" data-bs-dismiss="modal">
														<i class="fa fa-times text-danger fs-4"></i>
													</button>
													<button
														type="button"
														class="btn btn-light"
														data-bs-dismiss="modal"
														onClick={() => {
															history.push({
																pathname: "/transactions/" + element.nextPath,
																state: {
																	tid: element.id,
																},
															});
														}}
													>
														<i class="fa fa-check text-success fs-4"></i>
													</button>
												</div>
											</div>
										</div>
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</Fragment>
	);
};

export default PendingOrders;
