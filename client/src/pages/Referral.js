import React from 'react'
import { useState } from "react";
import Styles from './referral.module.css'
import img from "../shared/img/referral.jpg"
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FacebookShareButton, FacebookIcon, WhatsappShareButton, WhatsappIcon, TelegramShareButton, TelegramIcon} from "react-share";

export default function Referral(props) {
    const [link, setlink] = useState({
        value: `CryptoX.com/register/${props.referralCode}`,
        copied: false,
        btntext: "Copy link"
    })
    let copied = () => {
        setlink({
            copied: true,
            btntext: "Copied!"
        })
        setTimeout(() => {
            setlink({
                copied: false,
                btntext: "Copy link"
            })
        }, 3000)
    }
    return (
        <div className="d-flex" id={Styles.body}>
            <div className="w-100" id={Styles.left}>
                <h1>Invite a friend to CryptoX and you'll both get ₹100</h1>
                <p className="text-secondary" id={Styles.text}>The referral program lets you earn a bonus for each friend (“invitee”) who signs up and makes a crypto trade using your personal signup link.</p>
                <form className="input-group mb-3" id={Styles.send}>
                    <input type="email" className="form-control" placeholder="Enter email address" required />
                    <button className="btn btn-success" type="submit"><strong> Send </strong></button>
                </form>
                <div id={Styles.send} className="input-group mb-3">
                    <input id={Styles.link} type="text" value={link.value} className="form-control" readOnly />
                    <CopyToClipboard text={link.value} onCopy={copied}>
                        <button className="btn btn-link" type="button"><strong> {link.btntext} </strong></button>
                    </CopyToClipboard>
                </div>
                <div id={Styles.share} className="card text-dark mb-3">
                    <div className="card-header bg-white">Share your link</div>
                    <div className="card-body d-flex justify-content-center">
                        <FacebookShareButton
                            url={link.value}
                            quote={"Join CryptoX"}
                            className={Styles.social}>
                            <FacebookIcon size={45} round={true}/>
                        </FacebookShareButton>
                        <WhatsappShareButton
                            url={link.value}
                            title={"Join CryptoX"}
                            separator=": "
                            className={Styles.social}>
                            <WhatsappIcon size={45} round={true}/>
                        </WhatsappShareButton>
                        <TelegramShareButton
                            url={link.value}
                            title={"Join CryptoX"}
                            separator=": "
                            className={Styles.social}>
                            <TelegramIcon size={45} round={true}/>
                        </TelegramShareButton>
                    </div>
                </div>
            </div>
            <div className="w-100">
                <img className="img-fluid" src={img} alt="" />
            </div>
        </div>
    )
}
