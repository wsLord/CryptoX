import React, { useState } from "react";
import QRCode from 'qrcode.react'
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function Receive() {

    const data = {mail:"Sanskar@gmail.com",link:"http://localhost:3000/"}

    const [copy, setcopy] = useState("fa fa-clone fs-4");
    const copyHandler = () => {

        setcopy("fa fa-check-circle-o text-success fs-4");
        setTimeout(() => {
            setcopy("fa fa-clone fs-4");
        }, 3000);
    }
    return (
        <div>
            <div className="card m-4">
                <div className="card-body">
                    <QRCode className="m-3" value={data.link} fgColor="#d4af37" /><hr />
                    <div className="text-start">
                        <h4>Email ID</h4>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control fs-4 rounded-0 text-secondary border-white bg-white" value={data.mail} readOnly />
                            <CopyToClipboard text={data.mail} onCopy={copyHandler}>
                                <button className="btn btn-outline-white rounded-0 border-white"><i className={copy}></i></button>
                            </CopyToClipboard>
                        </div>
                        <p className="text-primary">*Share this registered mail ID to receive payment</p>
                    </div>
                </div>
            </div>
        </div >
    )
}
