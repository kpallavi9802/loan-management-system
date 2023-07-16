# Loan Management Backend System

This is a Express-MongoDB based microservice layer for a loan management application that generates detailed loan repayment schedules for customers.

## Set up

### step -1

install dependencies
go to `/backend/`
npm install

### Step-2 Database set up

- set up MongoDB Atlas and obtain the connection string
- edit DB_CONNECTION_STRING with your connection string inside /backend/.env file

### Step-3

Bring up the server using cmd

npm start

### Step-4

use Postman for api testing (use url - `http://localhost:9000/<all-defined-routes>`)

## Further improvements

- Nginx configuration and Deployment on EC2
