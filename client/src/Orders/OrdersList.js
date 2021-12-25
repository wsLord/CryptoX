import React from 'react'
import CompletedOrders from './CompletedOrders'

export default function OrdersList() {
    const pendingData = [{ type: "sell", date: "12 Dec 21", time: "12:33", coinID: "bitcoin", quantity: "123", triggerPrice: "1622", symbol: "btc" },
    { type: "buy", date: "12 Dec 21", time: "12:33", coinID: "bitcoin", quantity: "123", triggerPrice: "1622", symbol: "btc" },
    { type: "sell", date: "12 Dec 21", time: "12:33", coinID: "bitcoin", quantity: "123", triggerPrice: "1622", symbol: "btc" }]
    return (
        <div className='d-flex'>
            <div class="card w-50 m-4 h-100">
                <div className="card-header text-start h3">Pending orders</div>
                <div class="card-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Type</th>
                                <th scope="col">Date/Time</th>
                                <th scope="col">Coin ID</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Trigger Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingData.map((element) => {
                                return (
                                    <tr>
                                        <td className='h5'>{element.type}</td>
                                        <td>{element.date} {element.time}</td>
                                        <td>{element.coinID}</td>
                                        <td>{element.quantity} {element.symbol}</td>
                                        <td>&#8377;  {element.triggerPrice}</td>
                                        <td>
                                            <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                                Cancel
                                            </button>
                                            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                                <div class="modal-dialog">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h5 class="modal-title" id="staticBackdropLabel">Cancel Order</h5>
                                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div class="modal-body h4">
                                                            <i class="fa fa-exclamation-circle fs-1"></i>
                                                            <p>Are you sure?</p>
                                                        </div>
                                                        <div class="modal-footer">
                                                            <button type="button" class="btn btn-light" data-bs-dismiss="modal"><i class="fa fa-times text-danger fs-4"></i></button>
                                                            <button type="button" class="btn btn-light"><i class="fa fa-check text-success fs-4"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="card w-50 m-4 h-100">
                <div className="card-header text-start h3">Completed orders</div>
                <div class="card-body">
                    <CompletedOrders/>
                </div>
            </div>
        </div>
    )
}
