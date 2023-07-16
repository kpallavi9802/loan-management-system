const mongoose = require("mongoose");
const User = require("../models/user.model");

const Loan = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  amount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  duration: { type: Number, required: true },
  startDate: { type: Date, required: true },
  loanType: {
    type: String,
    enum: ["Personal Loan", "Home Loan", "Car Loan", "Education Loan"],
    required: true,
  },
  loanSchedules: [
    { type: mongoose.Schema.Types.ObjectId, ref: "LoanSchedule" },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
});

Loan.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const LoanModel = mongoose.model("Loan", Loan);
module.exports = LoanModel;
