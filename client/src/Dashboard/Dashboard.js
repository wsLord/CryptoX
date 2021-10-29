import React, { Fragment, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import Styles from "./Dashboard.module.css";
import Spinner from "../shared/components/Spinner";
import News from "./News";

const totalArticles = 100;

const Dashboard = (props) => {
	const [articles, setArticles] = useState([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const initialize = async () => {
			setLoading(true);

			let url = `https://newsapi.org/v2/everything?sortBy=popularity&q=crypto&page=1&pageSize=10&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`;
			let data = await fetch(url);
			let parseData = await data.json();

			setArticles(parseData.articles);
			setLoading(false);
		};

		initialize();
	}, []);

	const fetchMoreData = async () => {
		setPage((lastPageNumber) => {
			return lastPageNumber + 1;
		});

		let url = `https://newsapi.org/v2/everything?sortBy=popularity&q=crypto&page=${page}&pageSize=10&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`;
		let data = await fetch(url);
		let parsedData = await data.json();

		setArticles((prevArticles) => {
			return [...prevArticles, ...parsedData.articles];
		});
	};

	return (
		<Fragment>
			<div className="card" id={Styles.top}>
				<div className="card-body">
					<h4>Welcome {props.username}</h4>
					<div className="card shadow-sm p-3 mb-5 bg-body rounded">
						{props.isverify && (
							<div className="card-body" id={Styles.verify}>
								<i className="fa fa-check-circle text-success">
									Account verified
								</i>
							</div>
						)}
						{!props.isverify && (
							<div className="card-body" id={Styles.verify}>
								<i className="fa fa-exclamation-triangle text-danger">
									Account not verified
								</i>
								<button type="button" className="btn btn-success">
									<strong>Verify your ID</strong>
								</button>
							</div>
						)}
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
				<div className="card-header">
					<h3>Top Stories</h3>
				</div>
				<div className="card-body">
					<InfiniteScroll
						dataLength={articles.length}
						next={fetchMoreData}
						hasMore={articles.length <= totalArticles - 1}
						loader={<Spinner />}
					>
						{loading && <Spinner />}
						{articles.map((element) => {
							return <News articles={element} key={element.url} />;
						})}
					</InfiniteScroll>
				</div>
			</div>
		</Fragment>
	);
};

export default Dashboard;
