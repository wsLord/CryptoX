import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

export default function Graph(props) {
    var timestamp = Date.now();
    var date = new Date(timestamp);
    var interval = {
        start: 0,
        end: 0
    };
    if (props.mode === "y") {
        date.setFullYear(date.getFullYear() - 1);
        var startTimestamp = date.getTime();
        interval={
            start:startTimestamp/1000,
            end:timestamp/1000
        }
    }
    else if (props.mode === "m") {
        date.setMonth(date.getMonth() - 1);
        startTimestamp = date.getTime();
        interval={
            start:startTimestamp/1000,
            end:timestamp/1000
        }
    }
    else if (props.mode === "w") {
        date.setDate(date.getDate() - 7);
        startTimestamp = date.getTime();
        interval={
            start:startTimestamp/1000,
            end:timestamp/1000
        }
    }
    else if (props.mode === "d") {
        date.setDate(date.getDate() - 1);
        startTimestamp = date.getTime();
        interval={
            start:startTimestamp/1000,
            end:timestamp/1000
        }
    }
    else if (props.mode === "h") {
        date.setHours(date.getHours() - 1);
        startTimestamp = date.getTime();
        interval={
            start:startTimestamp/1000,
            end:timestamp/1000
        }
    }
    const plot = { x: [], y: [] };
    const [state, setstate] = useState({
        options: {
            chart: {
                id: ""
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
    });

    useEffect(() => {
        const fetchData = async () => {
            let url = `https://api.coingecko.com/api/v3/coins/${props.coin}/market_chart/range?vs_currency=inr&from=${interval.start}&to=${interval.end}`;
            let data = await fetch(url);
            let parseData = await data.json();
            parseData = parseData.prices;
            let i = 0;
            let d = props.divider;
            parseData.forEach(element => {
                if (i % d === 0) {
                    var xdate = new Date(element[0]);
                    const monthNameShort = xdate.toLocaleString("en-US", { month: "short" });
                    var x = "";
                    if(props.mode==='m' || props.mode==='w')
                    {
                        x=xdate.getDate() + "," + monthNameShort;
                    }
                    else if(props.mode==='y')
                    {
                        x=monthNameShort + "," + xdate.getFullYear();
                    }
                    else if(props.mode==='d' || props.mode==='h')
                    {
                        x=xdate.getHours()+":"+xdate.getMinutes();
                    }
                    plot.x.push(x);
                    plot.y.push(element[1].toFixed(2));
                }
                i++;
            });
            setstate({
                options: {
                    chart: {
                        id: ""
                    },
                    xaxis: {
                        categories: plot.x
                    }
                },
                series: [
                    {
                        name: "price",
                        data: plot.y
                    }
                ]
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
                        type={props.chart}
                        width="950"
                        height="400"
                    />
                </div>
            </div>
        </div>
    )
}
