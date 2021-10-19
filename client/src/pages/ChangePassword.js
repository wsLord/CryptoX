import { useState } from 'react'
import Styles from './Changepassword.module.css'

export default function ChangePassword() {

    const [Style, setStyle] = useState({
        backgroundColor: ""
    });

    const [enteredPassword, setEnteredPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    let passwordHandler = (event) => {
        setEnteredPassword(event.target.value);

        if (confirmPassword !== event.target.value) {
            setStyle({
                backgroundColor: "lightcoral"
            });
        } else {
            setStyle({
                backgroundColor: "white"
            });
        }
    }

    let confirmPasswordHandler = (event) => {
        setConfirmPassword(event.target.value);

        if (enteredPassword !== event.target.value) {
            setStyle({
                backgroundColor: "lightcoral"
            });
        } else {
            setStyle({
                backgroundColor: "white"
            });
        }
    }

    return (
        <div className={Styles.box}>
            <div className="card" id={Styles.card}>
                <h2>Set New Password</h2>
                <form id={Styles.form}>
                    <div className="mb-3">
                        <label HtmlFor="password" className="form-label">New Password</label>
                        <input style={Style} type="password" className="form-control" id="password" onChange={passwordHandler} minLength={6} required />
                    </div>
                    <div className="mb-3">
                        <label HtmlFor="confirm-password" className="form-label">Confirm Password</label>
                        <input style={Style} type="password" className="form-control" id="confirm-password" onChange={confirmPasswordHandler} minLength={6} required />
                    </div>
                    <button type="submit" className="btn btn-primary p-2.5 w-100"><strong> Change </strong><i className="fa fa-chevron-right"></i></button>
                </form>
            </div>
        </div>
    )
}
