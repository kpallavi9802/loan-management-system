# Loan Management Backend System

An Express-MongoDB-based microservice application for loan management that generates detailed loan repayment schedules for customers.

## Technology Stack

Express.js
MongoDB
Docker
Nginx

## Set up

#### Using Docker
Replace the db string in the `docker-compose` file and run the following commands in `/` 

```sh
docker-compose build
docker-compose up -d
```
### Setting  up locally
##### step -1

Install dependencies

```sh
cd /backend/
npm install 
```

##### Step-2 
Database set up
- set up MongoDB Atlas and obtain the connection string
- edit DB_CONNECTION_STRING with your connection string inside /backend/.env file

##### Step-3

Bring up the server using cmd
```sh
npm start
```

##### Step-4

use Postman for API testing (use URL - `http://localhost:9000/<all-defined-routes>`)

## Links
- [Repository](https://github.com/kpallavi9802/loan-management-system/blob/main)
- [Postman API collections](https://github.com/kpallavi9802/loan-management-system/blob/main/Embifi_Loan_Management_System.postman_collection.json)


