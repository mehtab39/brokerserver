This is a back-end for mock stock-broker application developed using NodeJs, Express, and MongoDB. You might not be familiar with what stock broker is.
Briefly, The role of a stock broker is to facilitate the buying and selling of stocks at the stock markets, on behalf of investors. 
Believe me, there is nothing else to understand to understand the features of the application.

## Table of contents

* [Demo](#demo)
* [How to run the app](#how-to-run-the-app)
* [Technology](#technology)
* [Added Functionalities](#added-functionalities)
* [Issues with the project](#issues-with-the-project)


## Demo

The application is deployed to Vercel and can be accessed through the following link:

[Client](https://brouse-broker.vercel.app)

[Server](https://brouseserver.herokuapp.com)

#### Important:

You will not able to search for equities, add them to watchlist, and get realtime price of equities from the deployed application. 

To get the realtime stock market  data, you need to run this application along with frontend application on localhost. You can find the instructions below. But Why?

Unfortunately, API Calls for stock market data from server will fail when made from browser due to 'OPTIONS' request sent by browsers before making an API call and Have few 'insecure' headers set which fails when changed from browser. Anyhow, It works perfectly fine when running on localhost.


## How to run the app

To run this application, you have to clone this github repo. You also need to clone [repo](https://github.com/mehtab39/brouse) for running frontend application. You will find the instructions for running frontend on given repo's readme.md file. 

After cloning this repo, 

To run this application, you have to set your own environmental variables. For security reasons, some variables have been hidden from view and used as environmental variables with the help of dotenv package. Below are the variables that you need to set in order to run the application:

* MONGO_URI: this is the connection string of your MongoDB Atlas database.
* JWT_ACCESS_KEY: This is a key which is used to authencticate user. You can put any strings here.
* JsonWebToken: This is a token created by JWT library used to authenticate user. You can put any strings here.
* PORT: Set PORT to 2550.

After you've set these environmental variables in the .env file at the root of the project.

Now you can run "npm start" in the terminal and the application should work.



## Technology
### The application includes following packages:
    "axios": "^0.26.1",
    "bcryptjs": "^2.4.3",
    "express": "^4.17.3",
    "json2csv": "^5.0.7",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^6.2.4",
    "validatorjs": "^3.22.1"

## Added Functionalities


* [API](https://brouseserver.herokuapp.com/user) for creating, updating and login an account using validatorjs for validating the form and bcryptjs for hashing the password.
* [API](https://brouseserver.herokuapp.com/nse) for searching any national stock exchange(NSE) equity, buying, selling, and add/remove it to/from watchlist.
* [API](https://brouseserver.herokuapp.com/user) to add/withdraw money from their account and sending a trasanction file in .csv format using json2csv.
* [API](https://brouseserver.herokuapp.com/order) for fetching user's orders (buy/sell/failed).
* [API](https://brouseserver.herokuapp.com/gift) for sending stocks as a gift to someone using their email id (registed with the application.) Gifted stocks will be sent to recipient's account.
* [API](https://brouseserver.herokuapp.com/ticket) for creating tickets for the users facing trouble. 



## Issues with the project

* Stock market data is not real when using deployed link. Hence, you will never get updated profit/loss data of purchased stocks. I explained the reason already. I       found the national stock exchange(NSE) APIs from this [library](https://www.npmjs.com/package/indian-stock-exchange). 
    -Help me out if there is a way to deploy the nodejs application with the real nsecontroller instead of that dummycontroller.
* There is no validation on adding funds to the account. Update the fake bank details and that's it. 
* There is no admin or customer-service api to read and resolve issued raised by tickets for the users. So ticket status will remain pending.

