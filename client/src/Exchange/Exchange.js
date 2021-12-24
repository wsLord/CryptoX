import React, { useState } from "react";
import Send from "./Send";
import Receive from "./Receive"
import Convert from "./Convert";
import img from "../shared/img/coin.gif"

export default function Exchange() {

    const activeItem = "nav-item border-top border-primary border-3 rounded";
    const unactiveItem = "nav-item";
    const activeLink = "nav-link active";
    const unactiveLink = "nav-link";
    const [style, setstyle] = useState({
        sendItem: activeItem,
        sendLink: activeLink,
        receiveItem: unactiveItem,
        receiveLink: unactiveLink,
        convertItem: unactiveItem,
        convertLink: unactiveLink
    });

    const handleClick = (event) => {
        if (event === 'send') {
            setstyle({
                sendItem: activeItem,
                sendLink: activeLink,
                receiveItem: unactiveItem,
                receiveLink: unactiveLink,
                convertItem: unactiveItem,
                convertLink: unactiveLink
            })
        }
        else if (event === 'receive') {
            setstyle({
                sendItem: unactiveItem,
                sendLink: unactiveLink,
                receiveItem: activeItem,
                receiveLink: activeLink,
                convertItem: unactiveItem,
                convertLink: unactiveLink
            })
        }
        else {
            setstyle({
                sendItem: unactiveItem,
                sendLink: unactiveLink,
                receiveItem: unactiveItem,
                receiveLink: unactiveLink,
                convertItem: activeItem,
                convertLink: activeLink
            })
        }
    }
    return (
        <div>
            <div className="card m-5">
                <div className="card-body">
                    <ul className="nav nav-tabs fs-4">
                        <li className={style.sendItem}>
                            <button className={style.sendLink} value='send' onClick={() => handleClick('send')}>Send</button>
                        </li>
                        <li className={style.receiveItem}>
                            <button className={style.receiveLink} onClick={() => handleClick('receive')}>Receive</button>
                        </li>
                        <li className={style.convertItem}>
                            <button className={style.convertLink} onClick={() => handleClick('convert')}>Convert</button>
                        </li>
                    </ul>
                    <div className="d-flex">
                        <div className="col-6">
                            {style.sendItem === activeItem &&
                                <Send />
                            }
                            {style.receiveItem === activeItem &&
                                <Receive />
                            }
                            {style.convertItem === activeItem &&
                                <Convert />
                            }
                        </div>
                        <img className="col-6 mt-3" src={img} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}
