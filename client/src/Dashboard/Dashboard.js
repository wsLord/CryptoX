import React, { Component } from 'react'
import Styles from './dashboard.module.css'
import InfiniteScroll from "react-infinite-scroll-component"
import Spinner from '../shared/components/Spinner';
import News from './News'


export default class dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            page: 1,
            total: 0,
            loading: false
        }
    }
    async componentDidMount() {
        this.setState({ loading: true })
        let url = `https://newsapi.org/v2/everything?sortBy=popularity&q=crypto&page=${this.state.page}&pageSize=10&apiKey=b9f009ee2e9c41a2be4b97d2fca59d35`;
        let date = await fetch(url);
        let parseDate = await date.json();
        this.setState({
            articles: parseDate.articles,
            total: 100,
            loading: false
        })
    }
    fetchMoreData = async () => {
        this.setState({
            page: this.state.page + 1,
        });
        let url = `https://newsapi.org/v2/everything?sortBy=popularity&q=crypto&page=${this.state.page}&pageSize=10&apiKey=b9f009ee2e9c41a2be4b97d2fca59d35`;
        let date = await fetch(url);
        let parseDate = await date.json();
        this.setState({
            articles: this.state.articles.concat(parseDate.articles),
        })
    };
    render() {
        return (
            <div>
                <div className="card" id={Styles.top}>
                    <div className="card-body">
                        <h4>Welcome {this.props.username}</h4>
                        <div className="card shadow-sm p-3 mb-5 bg-body rounded">
                            {this.props.isverify &&
                                <div className="card-body" id={Styles.verify}>
                                    <i className="fa fa-check-circle text-success"> Account verified</i>
                                </div>
                            }
                            {!this.props.isverify &&
                                <div className="card-body" id={Styles.verify}>
                                    <i className="fa fa-exclamation-triangle text-danger"> Account not verified</i>
                                    <button type="button" className="btn btn-success"><strong>Verify your ID</strong></button>
                                </div>
                            }
                        </div>
                        <div className="card shadow-sm p-3 mb-5 bg-body rounded">
                            <div className="card-body">
                                <h3>Total balance ₹ 0.00</h3>
                                <h4>Total amount earned from referral ₹ 0.00</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card" id={Styles.body}>
                    <div className="card-header"><h3>Top Stories</h3></div>
                    <div className="card-body">
                        <InfiniteScroll
                            dataLength={this.state.articles.length}
                            next={this.fetchMoreData}
                            hasMore={this.state.articles.length !== this.state.total - 1}
                            loader={<Spinner />}
                        >
                            {this.state.loading && <Spinner />}
                            {this.state.articles.map((element) => {
                                return (
                                    <News articles={element} key={element.url} />
                                );
                            })}
                        </InfiniteScroll>
                    </div>
                </div>
            </div>
        )
    }
}
