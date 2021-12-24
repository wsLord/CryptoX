import React, { useState } from "react";

export default function Send() {
    const assets = [{ coinID: "bitcoin", quantity: "212" }, { coinID: "dogecoin", quantity: "2312" }, { coinID: "ethereum", quantity: "500" }]

    const [Limit, setLimit] = useState(0)
    const [Selected, setSelected] = useState("");

    const handleSelect = (event) => {
        const selected = event.target.value;
        setSelected(selected);
        assets.forEach(element => {
            if (element.coinID === selected) {
                setLimit(element.quantity);
            }
        });
    }

    return (
        <div>
            <form className="d-flex m-5 flex-column align-items-start" action="">
                <select className="form-select fs-4 p-2" onChange={handleSelect}>
                    <option className="h3" selected value="">Pay with</option>
                    {assets.map((element) => {
                        return (
                            <option className="fs-4" value={element.coinID} >{element.coinID}</option>
                        )
                    })}
                </select>
                {Selected !== "" &&
                    <p className="text-primary mt-3">Available : <span className="h5">{Limit}</span> {Selected} in assets</p>
                }
                <div className="input-group mt-3 fs-3">
                    <span className="input-group-text fs-4 bg-white" id="basic-addon3">Amount</span>
                    <input type="number" className="form-control" id="amount" min="0" max={Limit} required />
                </div>
                <div className="input-group mt-3 fs-3">
                    <span className="input-group-text fs-4 bg-white" id="basic-addon3">To</span>
                    <input type="email" className="form-control" id="email" placeholder="Email ID" required />
                </div>
                <div className="input-group mt-3 fs-3">
                    <span className="input-group-text fs-4 bg-white" id="basic-addon3">Note</span>
                    <textarea className="form-control" id="msg" placeholder="Optional message" />
                </div>
                <button type="submit" className="btn btn-success fs-4 mt-3 w-100">Send</button>
            </form>
        </div>
    )
}
