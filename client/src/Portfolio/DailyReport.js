import React, { Fragment, useContext, useEffect, useState } from "react";
import axios from "axios";
import Pdf from "react-to-pdf";
import AuthContext from "../store/authContext";



export default function DailyReport() {

    const ctx = useContext(AuthContext);
    const ref = React.createRef();
    const options = {
        orientation: 'landscape',
        unit: 'in'
    };

    const [report, setReport] = useState({
        date: "",
        data: []
    })

    useEffect(() => {
        // Getting daily report Info
        const fetchData = async () => {
            try {
                const { data } = await axios.get(
                    `${process.env.REACT_APP_SERVER_URL}/user/assetsReport`,
                    {
                        headers: {
                            Authorization: "Bearer " + ctx.token,
                        },
                    }
                );
                console.log(data);
                var updatedAt = new Date(data[0].last_updated).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' });
                setReport({
                    date: updatedAt,
                    data: data
                });
            } catch (err) {
                // Error in fetching report
                console.log(err);
            }
        };

        fetchData();
    }, [ctx]);
    return (
        <Fragment>
            <div>
                <Pdf targetRef={ref} filename="daily_report.pdf" options={options}>
                    {({ toPdf }) => <button onClick={toPdf} className='btn btn-success mt-3'><i class="fa fa-file-pdf-o fs-5"></i> Generate pdf</button>}
                </Pdf>
                <div ref={ref}>
                    <p className="text-secondary text-end">Update at: {report.date}</p>
                    <div className="d-flex flex-column">
                        {report.data.map((element) => {
                            return (
                                <div class="card" key={element.id}>
                                    <div class="card-body d-flex align-items-center justify-content-evenly">
                                        <div>
                                            <div className="d-flex align-items-center">
                                                <img className="me-3" src={element.image.small} alt="" />
                                                <h6>{element.name} <p className="fs-6 text-secondary">{element.symbol}</p></h6>
                                            </div>
                                            <p className="text-primary fs-6">*Available : <p>{element.quantity} {element.symbol}</p></p>
                                        </div>
                                        <div className="vr"></div>
                                        <h6>Total Current value <p className="fs-6 text-secondary">	&#8377; {element.currentTotalValue.Rupees}.{element.currentTotalValue.Paise}</p></h6>
                                        <div className="vr"></div>
                                        <h6>Money Invested <p className="fs-6 text-secondary">	&#8377; {element.moneyInvested.Rupees}.{element.moneyInvested.Paise}</p></h6>
                                        <div className="vr"></div>
                                        {element.market_data.price_change_percentage_1h_in_currency.inr >= 0 &&
                                            <h6>Change (24h) <p className="fs-6 text-success"> {element.market_data.price_change_percentage_1h_in_currency.inr} %</p></h6>
                                        }
                                        {element.market_data.price_change_percentage_1h_in_currency.inr < 0 &&
                                            <h6>Change (24h) <p className="fs-6 text-danger"> {element.market_data.price_change_percentage_1h_in_currency.inr} %</p></h6>
                                        }
                                        <div className="vr"></div>
                                        <div>
                                            <h6>High 24h <p className="text-secondary fs-6">&#8377; {element.market_data.high_24h.inr}</p></h6>
                                            <h6>Low 24h <p className="text-secondary fs-6">&#8377; {element.market_data.low_24h.inr}</p></h6>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
