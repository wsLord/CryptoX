import React, { Component } from 'react'
import Cryptoitem from '../shared/components/CryptoItem'
import Styles from '../shared/components/crypto.module.css'
import Spinner from '../shared/components/Spinner';
import InfiniteScroll from "react-infinite-scroll-component";

export default class CryptoList extends Component {
    constructor() {
        super();
        this.state = {
            articles: [],
            loading: false,
            page: 1,
            total: 0,
            left:0
        }
    }
    async componentDidMount() {
        this.setState({ loading: true })
        let url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=25&sparkline=false&price_change_percentage=1h%2C%2024h%2C%207d%2C%2014d%2C%2030d%2C%20200d%2C%201y";
        let data = await fetch(url);
        let parseDate = await data.json();
        console.log(parseDate);
        this.setState({
            articles: parseDate,
            total: parseDate.length,
            loading: false,
            left:parseDate.length
        })
    }
    fetchMoreData = async () => {
        this.setState({
            page: this.state.page + 1,
        });
        let url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=25&page=${this.state.page}&sparkline=false&price_change_percentage=1h%2C%2024h%2C%207d%2C%2014d%2C%2030d%2C%20200d%2C%201y`;
        let date = await fetch(url);
        let parseDate = await date.json();
        this.setState({
            articles: this.state.articles.concat(parseDate),
            total:this.state.total+parseDate.length,
            left:parseDate.length
        })
    };
    render() {
        return (
            <div className="container">
                <div className="d-flex flex-column justify-content-center">
                    <nav className="d-flex justify-content-center m-3 navbar navbar-light">
                        <form className="d-flex">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </nav>
                    <InfiniteScroll
                        dataLength={this.state.articles.length}
                        next={this.fetchMoreData}
                        hasMore={this.state.total<500}
                        loader={<Spinner />}
                    >
                        {this.state.loading && <Spinner />}
                        <ul className="list-group list-group-horizontal" id={Styles.groups}>
                            <li className="list-group-item" id={Styles.cryptoid1}>Name</li>
                            <li className="list-group-item" id={Styles.cryptoid1}>Price</li>
                            <li className="list-group-item" id={Styles.cryptoid1}>Change(%)</li>
                            <li className="list-group-item" id={Styles.cryptoid1}>Trade</li>
                        </ul>
                        {this.state.left && this.state.articles.map((element) => {
                            var change=element.price_change_percentage_1h_in_currency;
                            if(change===null)
                                change=0;
                            return (
                                <>
                                    <Cryptoitem name={element.name}
                                        img={element.image}
                                        price={element.current_price}
                                        symbol={element.symbol}
                                        change={change.toPrecision(4)}
                                    />
                                </>
                            )
                        })}
                    </InfiniteScroll>
                </div>
            </div>
        )
    }
}
