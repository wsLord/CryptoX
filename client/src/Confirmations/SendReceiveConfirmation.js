import React from 'react'
import SuccessLogo from "../shared/img/Success.gif";
import FailedLogo from "../shared/img/failed.gif";
import Styles from "./BuySellConfirm.module.css";

export default function SendReceiveConfirmation() {
    const data = [];
    return (
        <div>
            {data.success && (
                <div class="card shadow p-3 mb-5 bg-body rounded" id={Styles.card}>
                    <div class="card-body d-flex flex-column justify-content-center align-items-center">
                        <img src={SuccessLogo} id={Styles.simg} alt="..." />
                        <div className="details">
                            <h2>Transaction Successful</h2>
                            <p className="h4 text-primary">
                                {data.quantity} {data.coinSymbol} send to <p className='h4'>{data.email}</p>
                            </p>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <p className="h5 me-5">Transaction ID: </p>
                                <p className="h5">{data.transactionID}</p>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <p className="h5 me-5">Transaction Changes: </p>
                                <p className="h5">&#x20B9; 200 ({data.transactionCharges} {data.coinSymbol})</p>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <p className="h5 me-5">Actual amount sent: </p>
                                <p className="h5">{data.actualAmount} {data.coinSymbol}</p>
                            </div>
                            <hr />
                        </div>
                        <button type="button" class="btn btn-success" id={Styles.back}>
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
                                <p className="h5">{data.email}</p>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <p className="h5 me-5">Quantity: </p>
                                <p className="h5">{data.quantity} {data.coinSymbol}</p>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <p className="h5 me-5">Error: </p>
                                <p className="h5">{data.message}</p>
                            </div>
                            <hr />
                        </div>
                        <button type="button" class="btn btn-danger" id={Styles.back}>
                            Back to Exchange
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
