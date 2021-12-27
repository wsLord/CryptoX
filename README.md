<h1 align="center">CryptoX</h1>
<p align="center">
<img alt="Logo" width="142px" src="client/src/shared/img/icon.png"/>
</p>

<p align="center">
CryptoX is a safe and simple gateway to build a strong crypto portfolio for everyone.
</p>

<br>

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![](https://visitor-badge.laobi.icu/badge?page_id=wsLord.CryptoX)

## Introduction
  Webster 2k21 Project - A Crypto-currency trading site

## Table of Contents:

1) [Features](#fet)
2) [Installation](#install)
3) [Go-through Videos](#gothru)
4) [Tech-Stack Used](#depend)
5) [APIs Used](#apis)
6) [Contributors](#contri)

<a name="fet"></a>
## Features

### Basic
* Login/Signup with social logins such as Google, Facebook
* Show different cryptocurrencies detail
* Add different cryptocurrencies to the watchlist 
* View price variation on a graph
* Payment gateway integration to add funds to wallet
* Allow users to buy/sell cryptocurrencies using wallet
* Portfolio section to view current holdings
* Calculate profit and loss on each holding
* List of transactions performed with basic info
* Generate a daily report of the current portfolio
* Settings to change basic info, password etc.

### Advanced
* Ability to change the scale of the graph to a certain interval. (1 year, 1 month, 1 week, 1 day, 1 hour, 15 min, etc)
* Change graph plotting style. (Candle Sticks, Bars, Line, etc. )
* Users can place orders including Buy-Limit order and Sell-Limit Order
* Detailed transaction info view for each type
* Referral scheme to earn wallet money with invite link
* Feature to transfer cryptocurrency to another user's wallet (with transaction charge deduction)
* Feature to exchange one cryptocurrency with another (with transaction charge deduction)
* Notifications when an order is processed, coins are received etc.

<a name="install"></a> 
## Installation
1) Clone the repository using:
```bash
https://github.com/wsLord/CryptoX.git
```
2) Run following in both "client" and "server" folders:
```bash
npm install 
```
3) Start MongoDB and set up following ENV files:
##### Client
```
REACT_APP_SERVER_URL
REACT_APP_NEWS_API_KEY
REACT_APP_RAZORPAY_KEY_ID
GOOGLE_CLIENT_ID
FB_CLIENT_ID
```
##### Server
```
PORT
CLIENT_URL
MONGODB_URL
JWT_PRIVATE_KEY
MAILER_ID
MAILER_PWD
RAZORPAY_KEY_ID
RAZORPAY_SECRET
```
5) Run following in both "client" and "server" folders:
```bash
npm start
```

<a name="gothru"></a> 
## Go-through Videos

* [CryptoX](https://www.youtube.com/watch?v=L_1lqI3QkWQ)


<a name="depend"></a>
## Tech-Stack Used

* NodeJS (ExpressJS)
* React JS
* CSS3
* Bootstrap
* JavaScript
* MongoDB (as Database)

<a name="apis"></a>
## APIs Used

* Coingecko
* RazorPay
* NewsApi

<a name="contri"></a>
## Contributors

* [Priyanshu Gupta](https://github.com/wsLord)
* [Nilotpal Das](https://github.com/god-ctrl)
* [Sanskar Jain](https://github.com/skj-7)

## Feedback
Feel free to file an issue if you come across any bugs

### Made at:

<p align="center">
<img width="112px" src="https://scontent.flko4-1.fna.fbcdn.net/v/t39.30808-6/247395021_4810221262322028_8169788296240690130_n.png?_nc_cat=103&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=MjB37MvQffgAX8Xd9Mw&_nc_ht=scontent.flko4-1.fna&oh=00_AT_avrvTgmqCNnrIDrLKz6t8xeIpCaW8rIMo-jOA9GDieQ&oe=61CE5FCA" />
</p>
<p align="center">
<img alt="MNNIT" width="112px" src="http://www.mnnit.ac.in/institutelogo/MNNIT%20(logo)png.png" />
</p>
