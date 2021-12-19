import React, { useState } from "react";

import Styles from './CoinDetail.module.css'

const CoinDetail = () => {

    const [modes, setModes] = useState({
        buy: "nav-link active",
        sell: "nav-link",
        order: "nav-link"
    });

    const [visibility, setVisibility] = useState({
        buy: "d-block",
        sell: "d-none",
        order: "d-none"
    });

    const onClickBuy = () => {
        setModes({
            buy: "nav-link active",
            sell: "nav-link",
            order: "nav-link"
        });
        setVisibility({
            buy: "d-block",
            sell: "d-none",
            order: "d-none"
        });
    }

    const onClickSell = () => {
        setModes({
            buy: "nav-link",
            sell: "nav-link active",
            order: "nav-link"
        });
        setVisibility({
            buy: "d-none",
            sell: "d-block",
            order: "d-none"
        });
    }
    const onClickOrder = () => {
        setModes({
            buy: "nav-link",
            sell: "nav-link",
            order: "nav-link active"
        });
        setVisibility({
            buy: "d-none",
            sell: "d-none",
            order: "d-block"
        });
    }
    return (
        <div>
            <div class="card m-3">
                <div class="card-body d-flex justify-content-between">
                    <div className="title d-flex align-items-center">
                        <img className={Styles.logo} src="https://logos-world.net/wp-content/uploads/2020/08/Bitcoin-Logo.png" alt="" />
                        <h1>Bitcoin </h1>
                        <p className="sym text-secondary h3"> (BTC)</p>
                    </div>
                    <button type="button" class="btn btn-outline-secondary"><p class="fa fa-star-o h4"> Add to Watchlist</p></button>
                </div>
            </div>
            <div className="main m-3 p-1 d-flex justify-content-between">
                <div class="card col-8" id={Styles.overview}>
                    <div class="card-header h3 text-start">
                        Overview
                    </div>
                    <div class="card-body">
                        <span className="placeholder col-12"></span>
                        <span className="placeholder col-12"></span>
                        <span className="placeholder col-12"></span>
                        <span className="placeholder col-12"></span>
                    </div>
                </div>
                <div class="col-4 p-10">
                    <div class="card">
                        <div class="card-header h3 text-start">
                            Assets
                        </div>
                        <div class="card-body">
                            <p className="text-secondary h3">Total BTC:100</p>
                            <p className="text-secondary h3">Total price :&#x20B9; 22939.1991</p>
                        </div>
                    </div>
                    <div class="card" id={Styles.options}>
                        <div class="card-body">
                            <ul class="nav nav-tabs d-flex" id={Styles.tabs}>
                                <li class="nav-item h3">
                                    <button class={modes.buy} onClick={onClickBuy}>Buy</button>
                                </li>
                                <li class="nav-item h3">
                                    <button class={modes.sell} onClick={onClickSell}>Sell</button>
                                </li>
                                <li class="nav-item h3">
                                    <button class={modes.order} onClick={onClickOrder}>Order</button>
                                </li>
                            </ul>
                            <div className={visibility.buy}>
                                <p className="text-end text-primary">Available &#x20B9; 100 in Wallet</p>
                                <form className="d-flex flex-column" action="" method="get" id={Styles.buyform}>
                                    <label for="amount" class="form-label h4 text-start">Pay(&#x20B9;)</label>
                                    <div class="input-group mb-3">
                                        <input type="number" class="form-control" id="amount" min={0}/>
                                        <span class="input-group-text"><p className="h4">.</p></span>
                                        <input type="number" class="form-control" id="decimal" min={0}/>
                                    </div>
                                    <label for="coin" class="form-label h4 text-start">Coins</label>
                                    <input type="number" class="form-control" id="coin" min={0} />
                                    <button type="button" class="btn btn-success" id={Styles.submit}>Buy BTC</button>
                                </form>
                            </div>
                            <div className={visibility.sell}>
                                <p className="text-end text-primary">Available  100 BTC in Assets</p>
                                <form className="d-flex flex-column" action="" method="get" id={Styles.sellform}>
                                    <label for="coin" class="form-label h4 text-start">Coins</label>
                                    <input type="number" class="form-control" id="coin" min={0} />
                                    <label class="form-label h4 text-start">Eqivalent currency amount</label>
                                    <div class="input-group mb-3">
                                        <span class="input-group-text">&#x20B9;</span>
                                        <input type="text" class="form-control" value={1233} readOnly />
                                        <span class="input-group-text">.56</span>
                                    </div>
                                    <button type="button" class="btn btn-success" id={Styles.submit}>Sell BTC</button>
                                </form>
                            </div>
                            <div className={visibility.order}>
                                order
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CoinDetail;