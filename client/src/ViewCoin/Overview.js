import React, { useState } from "react";
import Parse from "html-react-parser";

import Graph from "./Graph";
import Candlestick from "./Candlestick";
import line from "../shared/img/line.jpg";
import bar from "../shared/img/bar.jpg";
import candlestick from "../shared/img/candlestick.jpg";
import Styles from "./Graph.module.css";

const Overview = ({ id, coinData }) => {
	const coinid = id;

	const active = "btn btn-outline-secondary active";
	const unactive = "btn btn-outline-secondary";
	const [change, setChange] = useState(
		coinData ? coinData.market_data.price_change_percentage_24h : 0
	);
	// const [coinData, setCoinData] = useState(null);
	// // {
	// // 	data: {},
	// // 	flag: false,
	// // });
	const [mode, setMode] = useState({
		y: active,
		m: unactive,
		w: unactive,
		d: unactive,
		h: unactive,
		type: "y",
	});
	const setYear = () => {
		setMode({
			y: active,
			m: unactive,
			w: unactive,
			d: unactive,
			h: unactive,
			type: "y",
		});
		setChange(coinData.market_data.price_change_percentage_1y);
	};
	const setMonth = () => {
		setMode({
			y: unactive,
			m: active,
			w: unactive,
			d: unactive,
			h: unactive,
			type: "m",
		});
		setChange(coinData.market_data.price_change_percentage_30d);
	};
	const setWeek = () => {
		setMode({
			y: unactive,
			m: unactive,
			w: active,
			d: unactive,
			h: unactive,
			type: "w",
		});
		setChange(coinData.market_data.price_change_percentage_7d);
	};
	const setDay = () => {
		setMode({
			y: unactive,
			m: unactive,
			w: unactive,
			d: active,
			h: unactive,
			type: "d",
		});
		setChange(coinData.market_data.price_change_percentage_24h);
	};
	const setHour = () => {
		setMode({
			y: unactive,
			m: unactive,
			w: unactive,
			d: unactive,
			h: active,
			type: "h",
		});
		setChange(coinData.market_data.price_change_percentage_1h_in_currency.inr);
	};

	const [chart, setChart] = useState({
		line: active,
		bar: unactive,
		candle: unactive,
		type: "line",
	});
	const selectLine = () => {
		setChart({
			line: active,
			bar: unactive,
			candle: unactive,
			type: "line",
		});
	};
	const selectBar = () => {
		setChart({
			line: unactive,
			bar: active,
			candle: unactive,
			type: "bar",
		});
	};
	const selectCandle = () => {
		setChart({
			line: unactive,
			bar: unactive,
			candle: active,
			type: "candle",
		});
	};

	return (
		<div>
			<div className="top m-4 d-flex justify-content-between">
				<div className="price">
					{coinData && (
						<span className={Styles.size}>
							&#x20B9;
							{parseFloat(coinData.market_data.current_price.inr).toFixed(
								2
							)}{" "}
						</span>
					)}
					{change > 0 && <span className="text-success h3">({change}%)</span>}
					{change < 0 && <span className="text-danger h3">({change}%)</span>}
				</div>
				<div className="btn-group h-100" role="group">
					<button type="button" className={mode.y} onClick={setYear}>
						1Y
					</button>
					<button type="button" className={mode.m} onClick={setMonth}>
						1M
					</button>
					<button type="button" className={mode.w} onClick={setWeek}>
						1W
					</button>
					<button type="button" className={mode.d} onClick={setDay}>
						1D
					</button>
					<button type="button" className={mode.h} onClick={setHour}>
						1H
					</button>
				</div>
			</div>
			<div className="d-flex">
				<div className="col-1">
					<div className="btn-group-vertical" role="group">
						<button type="button" className={chart.line} onClick={selectLine}>
							<img className={Styles.img} src={line} alt="" />
						</button>
						<button type="button" className={chart.bar} onClick={selectBar}>
							<img className={Styles.img} src={bar} alt="" />
						</button>
						<button
							type="button"
							className={chart.candle}
							onClick={selectCandle}
						>
							<img className={Styles.img} src={candlestick} alt="" />
						</button>
					</div>
				</div>
				<div className="col-11">
					{chart.type === "line" && (
						<div>
							{mode.type === "y" && (
								<Graph
									coin={coinid}
									chart={chart.type}
									mode={mode.type}
									divider={30}
								/>
							)}
							{mode.type === "m" && (
								<Graph
									coin={coinid}
									chart={chart.type}
									mode={mode.type}
									divider={24}
								/>
							)}
							{mode.type === "w" && (
								<Graph
									coin={coinid}
									chart={chart.type}
									mode={mode.type}
									divider={24}
								/>
							)}
							{mode.type === "d" && (
								<Graph
									coin={coinid}
									chart={chart.type}
									mode={mode.type}
									divider={12}
								/>
							)}
							{mode.type === "h" && (
								<Graph
									coin={coinid}
									chart={chart.type}
									mode={mode.type}
									divider={1}
								/>
							)}
						</div>
					)}
					{chart.type === "bar" && (
						<div>
							{mode.type === "y" && (
								<Graph
									coin={coinid}
									chart={chart.type}
									mode={mode.type}
									divider={30}
								/>
							)}
							{mode.type === "m" && (
								<Graph
									coin={coinid}
									chart={chart.type}
									mode={mode.type}
									divider={24}
								/>
							)}
							{mode.type === "w" && (
								<Graph
									coin={coinid}
									chart={chart.type}
									mode={mode.type}
									divider={24}
								/>
							)}
							{mode.type === "d" && (
								<Graph
									coin={coinid}
									chart={chart.type}
									mode={mode.type}
									divider={12}
								/>
							)}
							{mode.type === "h" && (
								<Graph
									coin={coinid}
									chart={chart.type}
									mode={mode.type}
									divider={1}
								/>
							)}
						</div>
					)}
					{chart.type === "candle" && (
						<div>
							{mode.type === "y" && <Candlestick coin={coinid} days={365} />}
							{mode.type === "m" && <Candlestick coin={coinid} days={30} />}
							{mode.type === "w" && <Candlestick coin={coinid} days={7} />}
							{mode.type === "d" && <Candlestick coin={coinid} days={1} />}
							{mode.type === "h" && (
								<div className="fs-4 mt-5">Not Available</div>
							)}
						</div>
					)}
				</div>
			</div>
			<hr />
			<div className="m-3">
				<div className="h3 p-2 text-start">Market Stats</div>
				<div className="d-flex justify-content-evenly">
					<div className="d-flex flex-column">
						<div className="h5">Popularity</div>
						{coinData && (
							<div className="h5 text-secondary">
								#{coinData.market_cap_rank}
							</div>
						)}
					</div>
					<div className="vr"></div>
					<div className="d-flex flex-column">
						<div className="h5">Market cap</div>
						{coinData && (
							<div className="h5 text-secondary">
								&#x20B9; {coinData.market_data.market_cap.inr}
							</div>
						)}
					</div>
					<div className="vr"></div>
					<div className="d-flex flex-column">
						<div className="h5">Total volume</div>
						{coinData && (
							<div className="h5 text-secondary">
								&#x20B9; {coinData.market_data.total_volume.inr}
							</div>
						)}
					</div>
				</div>
			</div>
			<hr />
			<div className="m-3">
				<div className="h3 p-2 text-start">About</div>
				{coinData && (
					<div className="text-secondary fs-6 text-start">
						{Parse(coinData.description.en)}
					</div>
				)}
			</div>
		</div>
	);
};

export default Overview;
