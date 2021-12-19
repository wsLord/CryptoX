import React from 'react'
import SuccessLogo from "../shared/img/Success.gif";
import FailedLogo from "../shared/img/failed.gif";
import Styles from "./PaymentConfirm.module.css"

export default function PaymentConfirmation(props) {
  return (
    <div>
      {props.status &&
        <div class="card shadow p-3 mb-5 bg-body rounded" id={Styles.card}>
          <div class="card-body d-flex flex-column justify-content-center align-items-center">
            <img src={SuccessLogo} id={Styles.simg} alt="..." />
            <div className="details">
              <h2>Transaction Successful</h2>
              <p className="h4 text-primary">&#x20B9;100 is added to your wallet</p><hr />
              <div className="d-flex justify-content-between">
                <p className="h5">Transaction ID</p>                
                <p className="h5">123436</p>                
              </div><hr />
              <div className="d-flex justify-content-between">
                <p className="h5">RazorPay ID</p>                
                <p className="h5">fa1551</p>                
              </div><hr />
              <div className="d-flex justify-content-between">
                <p className="h5">Updated Balance</p>                
                <p className="h5">&#x20B9;200</p>                
              </div><hr />
            </div>
            <button type="button" class="btn btn-success" id={Styles.back}>Back to portfolio</button>
          </div>
        </div>
      }
      {!props.status &&
        <div class="card shadow p-3 mb-5 bg-body rounded" id={Styles.card}>
        <div class="card-body d-flex flex-column justify-content-center align-items-center">
          <img src={FailedLogo} id={Styles.simg} alt="..." />
          <div className="details">
            <h2>Transaction Failed</h2>
            <p className="h4 text-primary">Here's what we know</p><hr />
            <div className="d-flex justify-content-between">
              <p className="h5">Transaction ID</p>                
              <p className="h5">123436</p>                
            </div><hr />
            <div className="d-flex justify-content-between">
              <p className="h5">Error</p>                
              <p className="h5">Network failure</p>                
            </div><hr />
          </div>
          <button type="button" class="btn btn-danger" id={Styles.back}>Try Again</button>
        </div>
      </div>
      }
    </div>
  )
}
