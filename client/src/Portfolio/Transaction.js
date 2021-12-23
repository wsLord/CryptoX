import React from 'react'
import { Link } from "react-router-dom";

export default function Transaction() {

    const data = [{ type: "Add money", date: "Thu Dec 23 2021", time: "10:39:41", status: true, coinID: "-", amount: 100 },
    { type: "Buy", date: "Thu Dec 23 2021", time: "10:39:41", status: true, coinID: "bitcoin", amount: 12200 },
    { type: "Sell", date: "Thu Dec 23 2021", time: "10:39:41", status: true, coinID: "-", amount: -27100 }
    ];

    return (
        <div>
            <div className="card w-100">
                <div className="card-header"><h3>Recent Transactions</h3></div>
                <div className="card-body">
                    {data.length === 0 && <h4>Very lonely here...</h4>}
                    {data.length > 0 &&
                        <dir>
                            <table className="table fs-6">
                                <thead>
                                    <tr>
                                        <th scope="col">Type</th>
                                        <th scope="col">Date/Time</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Coin ID</th>
                                        <th scope="col">Amount (&#8377;)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((element) => {
                                        return (
                                            <tr>
                                                <td className="fw-bold">{element.type}</td>
                                                <td>{element.date} {element.time}</td>
                                                {element.status &&
                                                    <td className="fw-bold text-success">Success</td>
                                                }
                                                {!element.status &&
                                                    <td className="fw-bold text-danger">Fail</td>
                                                }
                                                <td className="text-center">{element.coinID}</td>
                                                {element.amount > 0 &&
                                                    <td className="fw-bold text-success">&#8377; +{element.amount}</td>
                                                }
                                                {element.amount < 0 &&
                                                    <td className="fw-bold text-danger">&#8377; {element.amount}</td>
                                                }
                                                <button type="button" className="btn btn-light bg-transparent"><i className="fa fa-chevron-right"></i></button>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <Link className="btn btn-success d-inline" to="/transactions">View more <i className="fa fa-angle-double-right"></i></Link>
                        </dir>
                    }
                </div>
            </div><br />
        </div>
    )
}
