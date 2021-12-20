import React from "react";
import Styles from './Transaction.module.css'
import success from '../shared/img/success.png'
import failed from '../shared/img/failed.png'
export default function BuySellDetails() {
    const data = {
        category: "buy", transactionID: "18shhs72474774", status: true, coin: "Bitcoin", symbol: "BTC", value: "200", amount: "288293", price: "1523", date: "18 Dec 21", time: "23:12", balance: "1623"
    };
    return (
        <div>
            <div class="card m-5 shadow p-3 mb-5 bg-body rounded">
                <div class="card-body">
                    {data.status &&
                        <div>
                            <img src={success} alt="" id={Styles.simg} />
                            {data.category === "buy" &&
                                <p className="text-primary h5">{data.coin} purchased of value</p>
                            }
                            {data.category === "sell" &&
                                <p className="text-primary h5">{data.coin} sold of value</p>
                            }
                            <p className="h3">{data.value} ({data.symbol})</p>
                            <p className="mx-auto h5" id={Styles.tid}>Transaction ID <span className="text-secondary">{data.transactionID}</span></p>
                            <p className="text-secondary h6">{data.date}, {data.time}</p>
                            <div class="card" id={Styles.details}>
                                <div class="card-body d-flex flex-column align-items-start">
                                    <p className="h5">Paid amount</p>
                                    <p className='fs-6 text-secondary'>&#8377; {data.amount}</p>
                                    <p className="h5">Price at that time(per {data.symbol})</p>
                                    <p className='fs-6 text-secondary'>&#8377; {data.price}</p>
                                    <p className="h5">Balance in wallet after transaction</p>
                                    <p className='fs-6 text-secondary'>&#8377; {data.balance}</p>
                                </div>
                            </div>
                        </div>
                    }
                    {!data.status &&
                        <div>
                        <img src={failed} alt="" id={Styles.simg} />
                        {data.category === "buy" &&
                            <p className="text-primary h5">Buy {data.coin} of value</p>
                        }
                        {data.category === "sell" &&
                            <p className="text-primary h5">Sell {data.coin} of value</p>
                        }
                        <p className="h3">{data.value} ({data.symbol})</p>
                        <p className="mx-auto h5" id={Styles.tid}>Transaction ID <span className="text-secondary">{data.transactionID}</span></p>
                        <p className="text-secondary h6">{data.date}, {data.time}</p>
                        <div class="card" id={Styles.details}>
                            <div class="card-body d-flex flex-column align-items-start">
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
