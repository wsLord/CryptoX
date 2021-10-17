import React from 'react'
import Styles from './portfolio.module.css'

export default function AddMoney() {
    return (
        <div>
            <div className="card">
                <div className="card-header"><h3>Withdraw</h3></div>
                <div className="card-body d-flex justify-content-center">
                    <form className="card shadow p-3 mb-5 bg-body rounded" id={Styles.addMoney}>
                        <label for="amount" className="form-label">Amount</label>
                        <div className="input-group mb-3">
                            <span className="input-group-text">&#8377;</span>
                            <input type="number" className="form-control" id="amount" defaultValue="100" min="100" required/>
                            <span className="input-group-text">.00</span>
                        </div>
                        <div className="mb-3">
                            <label for="account" className="form-label">Account Number</label>
                            <input type="text" className="form-control" id="account" required/>
                        </div>
                        <div className="mb-3">
                            <label for="ifsc" className="form-label">IFSC Code</label>
                            <input type="text" className="form-control" id="ifsc" required/>
                        </div>
                        <div className="mb-3">
                            <label for="bank" className="form-label">Bank</label>
                            <input type="text" className="form-control" id="bank" required/>
                        </div>
                        <button type="submit" className="btn btn-success"><i className="fa fa-sign-out"></i></button>
                    </form>
                </div>
            </div><br/>
        </div>
    )
}
