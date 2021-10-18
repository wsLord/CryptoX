import React, { Component } from 'react'
import bitimg from '../shared/img/bit.jpg'
import Styles from './watchlist.module.css';
import Watchitems from './watchitems';

export default class Watchlist extends Component {
    constructor() {
        super();
        this.state = {
            articles: [],
            total: 0
        }
    }
    async componentDidMount() {
        const data = ["bitcoin", "ethereum", "tether", "binancecoin", "solana"] //Add id of coins in watchlist from database
        for (var element in data) {
            let url = `https://api.coingecko.com/api/v3/coins/${data[element]}?tickers=false&community_data=false&developer_data=false&sparkline=false`;
            let Data = await fetch(url);
            let parseData = await Data.json();
            this.setState({
                articles: this.state.articles.concat(parseData),
                total: this.state.total + 1
            })
        }
    }
    render() {
        return (
            <div>
                <div className="card shadow p-3 mb-5 bg-body rounded" id={Styles.watch}>
                    <div className="card-header "><h3>Watchlist</h3></div>
                    <div className="card-body">
                        {this.state.total === 0 &&
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                <img src={bitimg} className={Styles.bitcoin} alt="" />
                                <h4>Start building your watchlist</h4>
                                <h6 className="text-secondary">Wherever you see the star icon, you can use it to add assets here.</h6>
                                <a className="btn btn-success m-10" href="/list">Explore</a>
                            </div>
                        }
                        {this.state.total > 0 &&
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">*</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Change(1h)</th>
                                        <th scope="col">Change(24h)</th>
                                        <th scope="col">Market Cap</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.articles.map((element) => {
                                        return (
                                           <Watchitems data={element} key={element.symbol}/>
                                        );
                                    })}
                                </tbody>
                            </table>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
