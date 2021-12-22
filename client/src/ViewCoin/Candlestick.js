import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

export default function Candlestick(props) {
    const [state, setstate] = useState({
        options: {
            chart: {
                id: ""
            },
            xaxis: {
                labels: {
                    formatter: function (value) {
                        return value;
                    }
                }
            }
        },
        series: [{
            data: []
        }]
    });
    useEffect(() => {
        const fetchData = async () => {
            let url = `https://api.coingecko.com/api/v3/coins/${props.coin}/ohlc?vs_currency=inr&days=${props.days}`;
            let data = await fetch(url);
            let parseData = await data.json();
            var temp = []
            parseData.forEach(element => {
                temp.push(element);
            });
            if (state.series[0].data.length === 0) {
                setstate({
                    options: {
                        chart: {
                            id: ""
                        },
                        xaxis: {
                            labels: {
                                formatter: function (value) {
                                    var date = new Date(value)
                                    const monthNameShort = date.toLocaleString("en-US", { month: "short" });
                                    if (props.days === 365) {
                                        date = monthNameShort + "," + date.getFullYear();
                                        return date;
                                    }
                                    else if (props.days === 30) {
                                        var time = date.toTimeString()
                                        time = time.substring(0, 5);
                                        date = date.getDate() + "," + monthNameShort;
                                        time += "," + date
                                        return time;
                                    }
                                    else if (props.days === 7) {
                                        time = date.toTimeString()
                                        time = time.substring(0, 5);
                                        date = date.getDate() + "," + monthNameShort;
                                        time += "," + date
                                        return time;
                                    }
                                    else if (props.days === 1) {
                                        date = date.toTimeString()
                                        return date.substring(0, 5);
                                    }
                                }
                            }
                        }
                    },
                    series: [{
                        data: temp
                    }]
                })
            }
        };
        fetchData();
    });

    return (
        <div className="app">
            <div className="row">
                <div className="mixed-chart">
                    <Chart
                        options={state.options}
                        series={state.series}
                        type="candlestick"
                        width="950"
                        height="500"
                    />
                </div>
            </div>
        </div>
    )
}
