import React, { useCallback, useEffect, useState } from "react";

let logoutTimer;

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
	userID: '',
  login: (token, userid, expirationTime) => {},
  logout: () => {},
});

const calcRemainingTime = (expirationTime) => {
	const nowTime = new Date().getTime();
	const expireTime = new Date(expirationTime).getTime();

	const remainingTime = expireTime - nowTime; // in milliseconds
	return remainingTime;
};

const retrieveStoredData = () => {
	const rawStoredData = localStorage.getItem("userData");
	if(!rawStoredData) {
		return null;
	}
	
	const storedData = JSON.parse(rawStoredData);
	const remainingTime = calcRemainingTime(storedData.expirationTime);

	if(remainingTime <= 60000) {
		localStorage.removeItem("userData");
		return null;
	}

	return {
		token: storedData.token,
		leftTime: remainingTime,
		id: storedData.userID
	};
};

export const AuthContextProvider = props => {
	const tokenData = retrieveStoredData();

	let initialToken = null;
	let initialUID = null;
  if (tokenData) {
    initialToken = tokenData.token;
		initialUID = tokenData.id;
  }

	const [token, setToken] = useState(initialToken);
	const [uid, setUID] = useState(initialUID);

	let currentlyLoggedIn = !!token;

	const logoutHandler = useCallback(() => {
		setToken(null);
		setUID(null);
		localStorage.removeItem("userData");

		if(logoutTimer) {
			clearTimeout(logoutTimer);
		}
	}, []);

	const loginHandler = (token, userid, expirationTime) => {
		setToken(token);
		setUID(userid);
		localStorage.setItem("userData", JSON.stringify({
			token: token,
			userID: userid,
			expirationTime: expirationTime
		}));

		const remainingTime = calcRemainingTime(expirationTime);

		logoutTimer = setTimeout(logoutHandler, remainingTime);
	};

	useEffect(() => {
		if(tokenData) {
			console.log("Time left for Auto-Logout: " + tokenData.leftTime);
			setTimeout(logoutHandler, tokenData.leftTime);
		}
	}, [tokenData, logoutHandler]);

	const contextValue = {
		token: token,
		isLoggedIn: currentlyLoggedIn,
		userID: uid,
		login: loginHandler,
		logout: logoutHandler
	};

	return (
		<AuthContext.Provider value={contextValue}>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthContext;