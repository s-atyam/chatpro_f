# Real-Time Chat Application Readme

Setup and Run Locally

## Prerequisites

1. Ensure you have Node.js installed. You can download it [here](https://nodejs.org/en).
2. Make sure MongoDB is installed locally or have access to a remote MongoDB instance.


## Installation

1. Clone the repository and then `cd ChatPro`
2. Install dependencies for both the server and client

// for frontend
`npm install`
    
// for backend
`cd Backend`
`npm install`


## Configuration

Configure the server by creating a .env file in the server directory with the following variables:
`MONGO_URI=''`   // write your MongoDB URI
`JWT_SECRET=''`   // write your Secret

Also on client side create a .env file and a variable:
`REACT_APP_SERVER_LINK=''`  // example http://localhost:5000


## Running the Application

1. Start the server
`cd Backend`
`npm start`

2. Start the client, open another terminal in ChatPro directory and
`npm start`

3. Open your browser and go to http://localhost:3000
