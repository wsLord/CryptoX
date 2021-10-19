import React from 'react'
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

export default function Sociallogin() {

    const responseSuccess = (user) => {
        console.log(user.profileObj);
        //Bhai yeh data h user me 
    }
    const responseFailure = (err) => {
        console.log(err);
    }

    const responseFacebook = (response) => {
        console.log(response);
    }
    return (
        <div className="d-flex justify-content-evenly">
            <GoogleLogin
                clientId={process.env.GOOGLE_CLIENT_ID}
                buttonText="Sign in with Google"
                onSuccess={responseSuccess}
                onFailure={responseFailure}
                cookiePolicy={'single_host_origin'}
            />
            <FacebookLogin
                appId={process.env.FB_CLIENT_ID}
                autoLoad={true}
                fields="name,email,picture"
                callback={responseFacebook}
                cssClass="btn btn-primary"
                icon="fa fa-facebook-official"
            />
        </div>
    )
}
