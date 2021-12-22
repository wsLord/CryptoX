import React, { useState } from "react";

export default function Settings() {
    const active = "btn btn-link fs-4 text-decoration-none";
    const unactive = "btn btn-link fs-4 text-decoration-none text-secondary"
    const valid = "form-control w-50 fs-3 p-2"
    const unvalid = "form-control w-50 fs-3 p-2 border border-danger border-3"

    const [validity, setvalidity] = useState({
        new: valid,
        confirm: valid
    })

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [mode, setmode] = useState({
        profile: active,
        security: unactive
    });
    const setProfile = () => {
        setmode({
            profile: active,
            security: unactive
        })
    }
    const setSecurity = () => {
        setmode({
            profile: unactive,
            security: active
        })
    }

    const newPasswordHandler = (event) =>{
        setNewPassword(event.target.value);
        if(confirmPassword !== event.target.value)
        {
            setvalidity({
                new:unvalid,
                confirm:unvalid
            })
        }
        else
        {
            setvalidity({
                new:valid,
                confirm:valid
            })
        }
    }

    const confirmPasswordHandler = (event) =>{
        setConfirmPassword(event.target.value);
        if(newPassword !== event.target.value)
        {
            setvalidity({
                new:unvalid,
                confirm:unvalid
            })
        }
        else
        {
            setvalidity({
                new:valid,
                confirm:valid
            })
        }
    }


    return (
        <div>
            <div className="h2 mt-5 ms-5 text-start">Settings</div>
            <div className="card m-5">
                <div className="card-body">
                    <div className="d-flex justify-content-start">
                        <button type="button" className={mode.profile} onClick={setProfile}>Profile</button>
                        <button type="button" className={mode.security} onClick={setSecurity}>Security</button>
                    </div>
                    <hr />
                    {mode.profile === active &&
                        <div>
                            <form className="d-flex p-3 flex-column align-items-start">
                                <label htmlFor="name" className="form-label fs-4 p-2">Display name</label>
                                <input type="text" className="form-control w-50 fs-3 p-2" id="name" defaultValue="Sanskar Jain" required />
                                <label htmlFor="phone" className="form-label  fs-4 p-2">Contact number</label>
                                <input type="phone" className="form-control w-50 fs-3 p-2" id="phone" defaultValue="99282888" required />
                                <label htmlFor="email" className="form-label  fs-4 p-2">Email ID</label>
                                <input type="email" className="form-control w-50 fs-3 p-2" id="email" value="sanskar@gmail.com" readOnly />
                                <button type="submit" className="btn btn-success fs-5 mt-3 p-2">Save</button>
                            </form>
                        </div>
                    }
                    {mode.security === active &&
                        <div>
                            <form className="d-flex p-3 flex-column align-items-start">
                                <label htmlFor="oldpassword" className="form-label fs-4 p-2">Old password</label>
                                <input type="text" className="form-control w-50 fs-3 p-2" id="oldpassword" required />

                                <label htmlFor="newpassword" className="form-label  fs-4 p-2">New password</label>
                                <input type="password" className={validity.new} id="newpassword" value={newPassword}
                                    onChange={newPasswordHandler} required />

                                <label htmlFor="confirmpassword" className="form-label  fs-4 p-2">Confirm password</label>
                                <input type="password" className={validity.confirm} id="confirmpassword" value={confirmPassword}
                                    onChange={confirmPasswordHandler} required />

                                <button type="submit" className="btn btn-success fs-5 mt-3 p-2">Change & Save</button>
                            </form>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
