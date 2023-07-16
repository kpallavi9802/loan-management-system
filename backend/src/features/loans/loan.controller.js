const express = require("express");
const LoanService = require("./loan.service");

class LoanController {
  async createLoan(req, res) {
    try {
      const { user } = req;
      const {
        customerId,
        loanType,
        amount,
        interestRate,
        duration,
        startDate,
      } = req.body;
      const response = await new LoanService().createLoan({
        user,
        customerId,
        loanType,
        amount,
        interestRate,
        duration,
        startDate,
      });
      res.json(response);
    } catch (err) {
      throw err.message;
    }
  }

  async getLoans(req, res) {
    try {
      const { user } = req;
      const response = await new LoanService().getLoans({ user });
      res.send(response);
    } catch (err) {
      throw err.message;
    }
  }

  async getLoanSchedules(req, res) {
    try {
      const loanId = req.params.id;
      const { user } = req;
      const response = await new LoanService().getLoanSchedules({
        user,
        loanId,
      });
      res.json(response);
    } catch (err) {
      throw err.message;
    }
  }
}

module.exports = new LoanController();
