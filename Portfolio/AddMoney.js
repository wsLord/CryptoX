import React from 'react'
import Styles from './portfolio.module.css'

export default function AddMoney() {
    return (
        <div>
            <div className="card">
                <div className="card-header"><h3>Add Money</h3></div>
                <div className="card-body d-flex justify-content-center">
                    <form className="card shadow p-3 mb-5 bg-body rounded" id={Styles.addMoney}>
                        <label for="amount" className="form-label">Amount</label>
                        <div className="input-group mb-3">
                            <span className="input-group-text">&#8377;</span>
                            <input type="number" className="form-control" defaultValue="100" id="amount" min="100" required/>
                            <span className="input-group-text">.00</span>
                        </div>
                        <div className="mb-3">
                            <label for="upi" className="form-label">UPI ID</label>
                            <input type="text" className="form-control" id="upi" required/>
                        </div>
                        <button type="submit" className="btn btn-success"><strong>ADD</strong></button>
                    </form>
                </div>
            </div><br/>
        </div>
    )
}
