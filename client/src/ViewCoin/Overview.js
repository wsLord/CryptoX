import React, { useState } from "react";
import Graph from "./Graph"
import line from "../shared/img/line.jpg";
import bar from "../shared/img/bar.jpg";
import candlestick from "../shared/img/candlestick.jpg";
import Styles from "./Graph.module.css";

export default function Overview(props) {
    const active = "btn btn-outline-secondary active";
    const unactive = "btn btn-outline-secondary";
    const [mode, setMode] = useState({
        y: active,
        m: unactive,
        w: unactive,
        d: unactive,
        h: unactive,
        type: "y"
    });
    const setYear = () => {
        setMode({
            y: active,
            m: unactive,
            w: unactive,
            d: unactive,
            h: unactive,
            type: "y"
        });
    }
    const setMonth = () => {
        setMode({
            y: unactive,
            m: active,
            w: unactive,
            d: unactive,
            h: unactive,
            type: "m"
        });
    }
    const setWeek = () => {
        setMode({
            y: unactive,
            m: unactive,
            w: active,
            d: unactive,
            h: unactive,
            type: "w"
        });
    }
    const setDay = () => {
        setMode({
            y: unactive,
            m: unactive,
            w: unactive,
            d: active,
            h: unactive,
            type: "d"
        });
    }
    const setHour = () => {
        setMode({
            y: unactive,
            m: unactive,
            w: unactive,
            d: unactive,
            h: active,
            type: "h"
        });
    }

    const [chart, setChart] = useState({
        line: active,
        bar: unactive,
        candle: unactive,
        type: "line"
    })
    const selectLine = () => {
        setChart({
            line: active,
            bar: unactive,
            candle: unactive,
            type: "line"
        });
    }
    const selectBar = () => {
        setChart({
            line: unactive,
            bar: active,
            candle: unactive,
            type: "bar"
        });
    }
    const selectCandle = () => {
        setChart({
            line: unactive,
            bar: unactive,
            candle: active,
            type: "candle"
        });
    }
    return (
        <div>
            <div className="top m-2">
                <div class="btn-group" role="group">
                    <button type="button" class={mode.y} onClick={setYear}>1Y</button>
                    <button type="button" class={mode.m} onClick={setMonth}>1M</button>
                    <button type="button" class={mode.w} onClick={setWeek}>1W</button>
                    <button type="button" class={mode.d} onClick={setDay}>1D</button>
                    <button type="button" class={mode.h} onClick={setHour}>1H</button>
                </div>
            </div>
            <div className="d-flex">
                <div className="col-1">
                    <div class="btn-group-vertical" role="group">
                        <button type="button" class={chart.line} onClick={selectLine}><img className={Styles.img} src={line} alt="" /></button>
                        <button type="button" class={chart.bar} onClick={selectBar}><img className={Styles.img} src={bar} alt="" /></button>
                        <button type="button" class={chart.candle} onClick={selectCandle}><img className={Styles.img} src={candlestick} alt="" /></button>
                    </div>
                </div>
                <div className="col-11">
                    {chart.type !== "candle" &&
                        <Graph coin={props.coin} chart={chart.type} mode={mode.type}/>
                    }
                    {chart.type === "candle" &&
                        <div>CandleStick</div>
                    }
                </div>
            </div>
        </div>
    )
}
