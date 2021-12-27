# CryptoX
A crypto-currency trading app

Server ENV File:

* PORT = //Port for server
* MONGODB_URL = //link to mongo db server
* JWT_PRIVATE_KEY = //Key for auth login token
* RAZORPAY_SECRET = <your razorpay secret>
* RAZORPAY_KEY_ID = <your razorpay ket id>

Client ENV File:

* REACT_APP_SERVER_URL = //url of server where apis are hosted
* REACT_APP_NEWS_API_KEY = 
* REACT_APP_RAZORPAY_KEY_ID = //razorpay key id
* GOOGLE_CLIENT_ID
* FB_CLIENT_ID

DB Specs:

transaction [id, ttype, 1_add_money, 2_withdraw_money, 3_buy_coin, 4_sell_coin, 5_buy_request, 6_sell_request]
wallet [id, userid, list of references of "transaction"]

each "transaction" has refernece to corresponding document and others are non-existent (not as null :*)

NewsAPI
CoinGecko Client:
DisplayCrypto - Home/components
Trade/CryptoList
CoinDetail****
WatchList**
Utilities/Exchange

