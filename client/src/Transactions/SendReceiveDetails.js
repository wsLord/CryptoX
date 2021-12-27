import React, { Fragment, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Styles from "./Transaction.module.css";
import success from "../shared/img/success.png";
import failed from "../shared/img/failed.png";
import Alert from "../shared/components/Alert";
import AuthContext from "../store/authContext";
import loader from "../shared/img/load.gif"

export default function SendReceiveDetails(props) {
    const ctx = useContext(AuthContext);
    const tid = props.location.state.tid;

    const [error, setError] = useState(null);
    const [transaction, setTransaction] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const { data } = await axios.post(
                    `${process.env.REACT_APP_SERVER_URL}/transaction/data`,
                    {
                        tid,
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + ctx.token,
                        },
                    }
                );
                setTransaction(data);
            } catch (err) {
                console.log(err.response.data);
                setError("Something went wrong!" + err.response.data.message);
            }
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        };

        fetchData();
    }, [ctx, tid]);

    const clearError = () => {
        setError(null);
    };

    return (
        <Fragment>
            {error && <Alert msg={error} onClose={clearError} />}
            <div className="card m-5 shadow p-3 mb-5 bg-body rounded">

                <div className="card-body">
                    {isLoading && <img src={loader} alt="" />}
                    {!isLoading && transaction.isSuccess && (
                        <div>
                            <img src={success} alt="" id={Styles.simg} />
                            {transaction.didIsend === "Yes" && (
                                <p className="text-primary h5">Amount Send</p>
                            )}
                            {transaction.didIsend !== "Yes" && (
                                <p className="text-primary h5">Received Amount</p>
                            )}
                            <p className="h2">{transaction.quantitySendBySender} {transaction.coinSymbol}</p>
                            <p className="mx-auto h5" id={Styles.tid}>
                                Transaction ID:{" "}
                                <span className="text-secondary">{transaction.id}</span>
                            </p>
                            <p className="text-secondary h6">
                                {new Date(transaction.updatedAt).toString().slice(0, -31)}
                            </p>
                            <div className="card" id={Styles.details}>
                                <div className="card-body d-flex flex-column align-items-start">
                                    <p className="h5">Currency: </p>
                                    <p className="fs-6 text-secondary">{transaction.coinName}</p>
                                    {transaction.didIsend === "Yes" &&
                                        <>
                                            <p className="h5">To: </p>
                                            <p className="fs-6 text-secondary">
                                                {transaction.to}
                                            </p>
                                            <p className="h5">Transaction charge: </p>
                                            <p className="fs-6 text-secondary">
                                                &#8377; {transaction.chargedMoney} ({transaction.chargedQuantity} {transaction.coinSymbol})
                                            </p>
                                            <p className="h5">Actual amount sent: </p>
                                            <p className="fs-6 text-secondary">
                                                {transaction.quantityRecievedByReciever} {transaction.coinSymbol}
                                            </p>
                                        </>
                                    }
                                    {transaction.didIsend !== "Yes" &&
                                        <>
                                            <p className="h5">From: </p>
                                            <p className="fs-6 text-secondary">
                                                {transaction.sender}
                                            </p>
                                        </>
                                    }
                                    <p className="h5">Note: </p>
                                    <p className="fs-6 text-secondary">
                                        {transaction.note}
                                    </p>
                                </div>
                            </div>
                            <Link className="btn btn-success mt-2 fs-5" to="/transactions">Back to Transactions</Link>
                        </div>
                    )}
                    {!isLoading && !transaction.isSuccess && (
                        <div>
                            <img src={failed} alt="" id={Styles.simg} />
                            <p className="text-primary h5">Amount</p>
                            <p className="h2">{transaction.quantity} {transaction.coinSymbol}</p>
                            <p className="mx-auto h5" id={Styles.tid}>
                                Transaction ID:{" "}
                                <span className="text-secondary">
                                    {transaction.id}
                                </span>
                            </p>
                            <p className="text-secondary h6">
                                {new Date(transaction.updatedAt).toString().slice(0, -31)}
                            </p>
                            <div className="card" id={Styles.details}>
                                <div className="card-body d-flex flex-column align-items-start">
                                    <p className="h5">Currency: </p>
                                    <p className="fs-6 text-secondary">{transaction.coinName}</p>
                                    <p className="h5">To: </p>
                                    <p className="fs-6 text-secondary">
                                        {transaction.to}
                                    </p>
                                    <p className="h5">Note: </p>
                                    <p className="fs-6 text-secondary">
                                        {transaction.note}
                                    </p>
                                    <p className="h5">Other Info: </p>
                                    <p className="fs-6 text-secondary">
                                        {transaction.statusMessage}
                                    </p>
                                </div>
                            </div>
                            <Link className="btn btn-danger mt-2 fs-5" to="/transactions">Back to Transactions</Link>
                        </div>
                    )}
                </div>

            </div>
        </Fragment>
    )
}
