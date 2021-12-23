import React from 'react'

export default function Order() {
    return (
        <div className="m-4">
            <form className="d-flex flex-column" action="">
                <label htmlFor="type" className="form-label h4 text-start mt-2">Transaction type</label>
                <div className="d-flex justify-content-evenly">
                    <div className="form-check form-check-inline fs-4">
                        <input className="form-check-input" type="radio" name="type" id="buy" value="buy" defaultChecked/>
                        <label className="form-check-label" for="buy">Buy</label>
                    </div>
                    <div className="form-check form-check-inline  fs-4">
                        <input className="form-check-input" type="radio" name="type" id="sell" value="sell" />
                        <label className="form-check-label" for="sell">Sell</label>
                    </div>
                </div>

                <label htmlFor="coin" className="form-label h4 text-start mt-2">Quantity</label>
                <input type="number" className="form-control mt-2" id="coin" min={0} required />
                <label htmlFor="price" className="form-label h4 text-start mt-2">Trigger price</label>
                <div className="input-group">
                    <span className="input-group-text fs-5 mt-2">&#8377;</span>
                    <input type="number" className="form-control mt-2" id="price" min={0} required />
                </div>
                <button type="button" className="btn btn-success mt-4 fs-5">Place order</button>
            </form>
        </div>
    )
}
