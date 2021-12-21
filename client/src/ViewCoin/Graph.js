import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

export default function Graph(props) {
    var timestamp = Date.now();
    var date = new Date(timestamp);
    date.setMonth(date.getMonth() - 1);
    var startTimestamp = date.getTime();
    const [interval, setInterval] = useState({
        start: startTimestamp / 1000,
        end: timestamp / 1000
    });


    const state = {
        options: {
            chart: {
                id: "basic-bar"
            },
            xaxis: {
                categories: []
            }
        },
        series: [
            {
                name: "price",
                data: []
            }
        ]
    };

    useEffect(() => {
        const fetchData = async () => {
            let url = `https://api.coingecko.com/api/v3/coins/${props.coin}/market_chart/range?vs_currency=inr&from=${interval.start}&to=${interval.end}`;
            let data = await fetch(url);
            let parseData = await data.json();
            parseData = parseData.prices;
            let i = 0;
            parseData.forEach(element => {
                if (i % 24 === 0) {
                    var xdate = new Date(element[0]);
                    const monthNameShort = xdate.toLocaleString("en-US", { month: "short" });
                    var x = xdate.getDate() + "," + monthNameShort;
                    state.options.xaxis.categories.push(x);
                    state.series[0].data.push(element[1]);
                }
                i++;
            });
        };
        fetchData();
    });
    return (
        <div>
            <div className="row">
                <div className="mixed-chart">
                    <Chart
                        options={state.options}
                        series={state.series}
                        type="line"
                        width="1000"
                        height="400"
                    />
                </div>
            </div>
        </div>
    )
}
