# Loan Management Backend System

An Express-MongoDB based microservice application for a loan management that generates detailed loan repayment schedules for customers.

## Set up

#### Using Docker
Replace db string in `docker-compose` file and run following commands in `/` 

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

use Postman for api testing (use url - `http://localhost:9000/<all-defined-routes>`)

## Links
- [Repository](https://github.com/kpallavi9802/loan-management-system/blob/main)
- [Postman API collections](https://github.com/kpallavi9802/loan-management-system/blob/main/Embifi_Loan_Management_System.postman_collection.json)

## Scope(Pending works)
- Bringing up production server using nginx reverse proxy  
- Deployment on ec2
