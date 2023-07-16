const express = require("express");
const LoanController = require("./loan.controller");

const loanRouter = express.Router();

loanRouter.post("/create-loan", LoanController.createLoan);
loanRouter.get("/get-loans", LoanController.getLoans);
loanRouter.get("/schedule/:id", LoanController.getLoanSchedules);

module.exports = loanRouter;
