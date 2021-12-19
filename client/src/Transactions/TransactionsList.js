import React from 'react'
import img from '../shared/img/history.jpg'
import Styles from './Transaction.module.css'

export default function TransactionsList() {
    const data = [{ type: "Buy", Date: "12-10-21", id: "15fg262", status: "Success", amount: -19679, coinType: "btc", coins: 2 },
    { type: "Add Money", Date: "02-10-21", id: "1225262", status: "Success", amount: 200, coinType: "-", coins: "-" },
    { type: "Sell", Date: "12-02-20", id: "135fos62", status: "Failed", amount: "-", coinType: "-", coins: "-" },
    { type: "Sell", Date: "04-02-21", id: "shs773", status: "Success", amount: 1992.23, coinType: "Eth", coins: -3 }]
    return (
        <div>
            <div className="card m-5">
                <h2 className="card-header text-start bg-light.bg-gradient"><img src={img} alt="" id={Styles.img} /> Transaction History</h2>
                <div className="card-body">
                    <table className="table fs-5">
                        <thead>
                            <tr>
                                <th scope="col">Type</th>
                                <th scope="col">Date</th>
                                <th scope="col">ID</th>
                                <th scope="col">Status</th>
                                <th scope="col">Amount(&#8377;)</th>
                                <th scope="col">Coin Type</th>
                                <th scope="col">Coins</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((element) => {
                                return (
                                    <tr>
                                        <td className="fw-bold">{element.type}</td>
                                        <td>{element.Date}</td>
                                        <td>{element.id}</td>
                                        {element.status === "Success" &&
                                            <td className="text-success fw-bold">{element.status}</td>
                                        }
                                        {element.status !== "Success" &&
                                            <td className="text-danger fw-bold">{element.status}</td>
                                        }
                                        {element.amount <0 &&
                                            <td className="text-danger fw-bold">{element.amount}</td>
                                        }
                                        {element.amount >0 &&
                                            <td className="text-success fw-bold">+{element.amount}</td>
                                        }
                                        {element.amount==="-" &&
                                            <td className="fw-bold">{element.amount}</td>
                                        }
                                        <td>{element.coinType}</td>
                                        {element.coins <0 &&
                                            <td className="text-danger fw-bold">{element.coins} </td>
                                        }
                                        {element.coins >0 &&
                                            <td className="text-success fw-bold">+{element.coins}</td>
                                        }
                                        {element.coins==="-" &&
                                            <td className="fw-bold">{element.coins}</td>
                                        }
                                        <td><button type="button" className="btn btn-light bg-transparent"><i className="fa fa-chevron-right"></i></button></td>
                                    </tr>
                                );
                            })}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
