import React from 'react'

export default function CompletedOrders() {
    const data = [{ type: "sell", date: "12 Dec 21", time: "12:33", coinID: "bitcoin", quantity: "123", triggerPrice: "1622", actualPrice: "1612", symbol: "btc" }]
    return (
        <div>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Type</th>
                        <th scope="col">Date/Time</th>
                        <th scope="col">Coin ID</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Triggered Price</th>
                        <th scope="col">Buy/Sell Price</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((element) => {
                        return (
                            <tr>
                                <td className='h5'>{element.type}</td>
                                <td>{element.data} {element.time}</td>
                                <td>{element.coinID}</td>
                                <td>{element.quantity} {element.symbol}</td>
                                <td>&#8377; {element.triggerPrice}</td>
                                <td>&#8377; {element.actualPrice}</td>
                                <button type="button" className="btn btn-light bg-transparent">
                                    <i className="fa fa-chevron-right"></i>
                                </button>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div >
    )
}
