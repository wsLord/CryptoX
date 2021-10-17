import React from 'react'
import Styles from './watchlist.module.css';

export default function watchitems({ data }) {
    let change_1h = data.market_data.price_change_percentage_1h_in_currency.inr;
    let change_24h = data.market_data.price_change_percentage_24h;
    return (
        <tr>
            <td>
                <button id="add" type="button" className="btn btn-light" data-bs-toggle="tooltip" data-bs-placement="left" title="Remove from Watchlist">
                    <i className="fa fa-star"></i>
                </button>
            </td>
            <td>
                <div>
                    <h5>{data.name} <img className={Styles.coins} src={data.image.small} alt=""></img></h5>
                    <h6>({data.symbol})</h6>
                </div>
            </td>
            <td>
                <strong>&#8377; </strong>{data.market_data.current_price.inr}
            </td>
            <td>
                {change_1h < 0 && <p className="text-danger">{change_1h}<strong> %</strong></p>}
                {change_1h >= 0 && <p className="text-success">{change_1h}<strong> %</strong></p>}
            </td>
            <td>
                {change_24h < 0 && <p className="text-danger">{change_24h}<strong> %</strong></p>}
                {change_24h >= 0 && <p className="text-success">{change_24h}<strong> %</strong></p>}
            </td>
            <td><strong>&#8377; </strong>{data.market_data.market_cap.inr}</td>
            <td><button type="button" className="btn btn-success">Buy</button></td>
        </tr>
    )
}
