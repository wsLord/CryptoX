import React from "react";
import Styles from './Transaction.module.css'
import success from '../shared/img/success.png'
import failed from '../shared/img/failed.png'
export default function AddMoneyDetails() {
    const data = {
        category: "addMoney", transactionID: "18shhs72474774", status: true, razorPayID: "B7272bbsb", amount: "2800", date: "18 Dec 21", time: "23:12", balance: "61600"
    };
    return (
        <div>
            <div class="card m-5 shadow p-3 mb-5 bg-body rounded">
                <div class="card-body">
                    {data.status &&
                        <div>
                            <img src={success} alt="" id={Styles.simg} />
                            {data.category === "addMoney" &&
                                <p className="text-primary h5">Added Amount</p>
                            }
                            {data.category === "sell" &&
                                <p className="text-primary h5">Withdrawal Amount</p>
                            }
                            <p className="h3">&#8377; {data.amount}</p>
                            <p className="mx-auto h5" id={Styles.tid}>Transaction ID <span className="text-secondary">{data.transactionID}</span></p>
                            <p className="text-secondary h6">{data.date}, {data.time}</p>
                            <div class="card" id={Styles.details}>
                                <div class="card-body d-flex flex-column align-items-start">
                                    <p className="h5">RazorPay ID</p>
                                    <p className='fs-6 text-secondary'>{data.razorPayID}</p>
                                    <p className="h5">Balance in wallet after transaction</p>
                                    <p className='fs-6 text-secondary'>&#8377; {data.balance}</p>
                                </div>
                            </div>
                        </div>
                    }
                    {!data.status &&
                        <div>
                            <img src={failed} alt="" id={Styles.simg} />
                            {data.category === "addMoney" &&
                                <p className="text-primary h5">Add Amount</p>
                            }
                            {data.category === "sell" &&
                                <p className="text-primary h5">Withdraw Amount</p>
                            }
                            <p className="h3">&#8377; {data.amount}</p>
                            <p className="mx-auto h5" id={Styles.tid}>Transaction ID <span className="text-secondary">{data.transactionID}</span></p>
                            <p className="text-secondary h6">{data.date}, {data.time}</p>
                            <div class="card" id={Styles.details}>
                                <div class="card-body d-flex flex-column align-items-start">
                                    <p className="h5">RazorPay ID</p>
                                    <p className='fs-6 text-secondary'>{data.razorPayID}</p>
                                    <p className="h5">Error Message</p>
                                    <p className='fs-6 text-secondary'>Transaction failed due to techinical error</p>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
