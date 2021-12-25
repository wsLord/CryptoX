import React from 'react'
import Styles from "..Transactions/Transaction.module.css";
import success from "../shared/img/success.png";
import failed from "../shared/img/failed.png";
import { Link } from "react-router-dom";

export default function OrderDetails() {
    const transaction = {}
    return (
        <div>
            <div class="card m-5 shadow p-3 mb-5 bg-body rounded">
                <div class="card-body">
                    {transaction.isSuccess && (
                        <div>
                            <img src={success} alt="" id={Styles.simg} />
                            {transaction.category === "buy" && (
                                <p className="text-primary h5">
                                    {transaction.coinName} purchased of value
                                </p>
                            )}
                            {transaction.category === "sell" && (
                                <p className="text-primary h5">
                                    {transaction.coinName} sold of value
                                </p>
                            )}
                            <p className="h3">
                                {transaction.quantity} ({transaction.coinSymbol})
                            </p>
                            <p className="mx-auto h5" id={Styles.tid}>
                                Transaction ID:{" "}
                                <span className="text-secondary">{transaction.id}</span>
                            </p>
                            <p className="text-secondary h6">
                                {new Date(transaction.updatedAt).toString().slice(0, -31)}
                            </p>
                            <div class="card" id={Styles.details}>
                                <div class="card-body d-flex flex-column align-items-start">
                                    <p className="h5">Trigger price</p>
                                    <p className="fs-6 text-secondary">&#8377; {transaction.triggeredPrice}</p>
                                    <p className="h5">Date(order placed):</p>
                                    <p className="fs-6 text-secondary">
                                        {new Date(transaction.orderDate).toString().slice(0, -31)}
                                    </p>
                                    <p className="h5">
                                        Price at that time (per {transaction.coinSymbol})
                                    </p>
                                    <p className="fs-6 text-secondary">
                                        &#8377; {transaction.price}
                                    </p>
                                </div>
                            </div>
                            <Link className="btn btn-success mt-2 fs-5" to="/orders">Back to orders list</Link>
                        </div>
                    )}
                    {!transaction.isSuccess && (
                        <div>
                            <img src={failed} alt="" id={Styles.simg} />
                            {transaction.category === "buy" && (
                                <p className="text-primary h5">
                                    Buy {transaction.coinName} of value
                                </p>
                            )}
                            {transaction.category === "sell" && (
                                <p className="text-primary h5">
                                    Sell {transaction.coinName} of value
                                </p>
                            )}
                            <p className="h3">
                                {transaction.quantity} ({transaction.coinSymbol})
                            </p>
                            <p className="mx-auto h5" id={Styles.tid}>
                                Transaction ID{" "}
                                <span className="text-secondary">{transaction.id}</span>
                            </p>
                            <p className="text-secondary h6">
                                {new Date(transaction.updatedAt).toString().slice(0, -31)}
                            </p>
                            <div class="card" id={Styles.details}>
                                <div class="card-body d-flex flex-column align-items-start">
                                    <p className="h5">Trigger price</p>
                                    <p className="fs-6 text-secondary">&#8377; {transaction.triggeredPrice}</p>
                                    <p className="h5">Date(order placed):</p>
                                    <p className="fs-6 text-secondary">
                                        {new Date(transaction.orderDate).toString().slice(0, -31)}
                                    </p>
                                    <p className="h5">Error Message:</p>
                                    <p className="fs-6 text-secondary">
                                        {transaction.statusMessage}
                                    </p>
                                </div>
                            </div>
                            <Link className="btn btn-danger mt-2 fs-5" to="/orders">Back to orders list</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
