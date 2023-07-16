const mongoose = require("mongoose");
const Loan = require("../models/loan.model");

const LoanSchedule = new mongoose.Schema({
  loanId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: Loan },
  installmentNumber: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  principalAmount: { type: Number, required: true },
  interestAmount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paid: { type: Boolean, default: false },
});

LoanSchedule.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const LoanScheduleModel = mongoose.model("LoanSchedule", LoanSchedule);
module.exports = LoanScheduleModel;
