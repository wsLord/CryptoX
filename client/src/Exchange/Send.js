import React, { useState } from "react";

export default function Send() {
    const assets = [{ coinID: "bitcoin", quantity: "212" }, { coinID: "dogecoin", quantity: "2312" }, { coinID: "ethereum", quantity: "500" }]

    const [Limit, setLimit] = useState(0)
    const [Selected, setSelected] = useState("");

    const [verifyState, setverifyState] = useState("verify")
    const [email, setEmail] = useState("");
    const [user,setUser] = useState("");

    const handleSelect = (event) => {
        const selected = event.target.value;
        setSelected(selected);
        assets.forEach(element => {
            if (element.coinID === selected) {
                setLimit(element.quantity);
            }
        });
    }
    const handleEmail = (event) => {
        setEmail(event.target.value);
        setverifyState("verify");
    }
    const verifyUser = () => {

        // //verify email here

        // //set if verified
        // setverifyState("verified"); 
        // setUser("Sanskar Jain");

        // //set if invalid
        setverifyState("invalid");
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
                    <input type="email" className="form-control" id="email" placeholder="Email ID" value={email} onChange={handleEmail} required />
                    {verifyState === "verify" &&
                        <button class="btn btn-link fs-5" type="button" id="button-addon2" onClick={verifyUser}>Verify</button>
                    }
                    {verifyState === "verified" &&
                        <button class="btn btn-link" type="button" id="button-addon2" onClick={verifyUser}><i class="fa fa-check-circle text-success fs-4"></i></button>
                    }
                    {verifyState === "invalid" &&
                        <button class="btn btn-link" type="button" id="button-addon2" onClick={verifyUser}><i class="fa fa-times-circle text-danger fs-4"></i></button>
                    }
                </div>
                {verifyState === "verified" &&
                    <p className="text-success">* User Name : {user}</p>
                }
                {verifyState === "invalid" &&
                    <p className="text-danger">* No user regiested with given email ID</p>
                }
                <div className="input-group mt-3 fs-3">
                    <span className="input-group-text fs-4 bg-white" id="basic-addon3">Note</span>
                    <textarea className="form-control" id="msg" placeholder="Optional message" />
                </div>
                <button type="submit" className="btn btn-success fs-4 mt-3 w-100">Send</button>
            </form>
        </div>
    )
}
