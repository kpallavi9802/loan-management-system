const Loan = require("../../models/loan.model");
const User = require("../../models/user.model");
const LoanSchedule = require("../../models/loan_schedule.model");

class LoanService {
  async createLoan(loanRequest) {
    try {
      if (!(loanRequest.user.role == "loan officer")) {
        return {
          status: 403,
          message:
            "Access Denied: only loan officer can create loan for customers",
        };
      }
      const existingCustomer = await User.findOne({
        _id: loanRequest.customerId,
      });
      if (!existingCustomer) {
        return { status: 404, message: `Customer not found` };
      }
      const loan = await new Loan();
      loan.customerId = loanRequest.customerId;
      loan.loanType = loanRequest.loanType;
      loan.amount = loanRequest.amount;
      loan.interestRate = loanRequest.interestRate;
      loan.duration = loanRequest.duration;
      loan.startDate = loanRequest.startDate;
      loan.createdBy = loanRequest.user.id;
      await loan.save();

      let loanSchedules = this.generateRepaymentSchedule(loan);
      loanSchedules = await LoanSchedule.insertMany(loanSchedules);
      loan.loanSchedules = loanSchedules;
      await loan.save();

      return {
        status: 201,
        message: "Loan and repayment schedule created successfully",
      };
    } catch (err) {
      return {
        status: 500,
        message: `Failed to create loan or repayment schedule: ${err.message}`,
      };
    }
  }

  async getLoans(userRequest) {
    try {
      let loans = [];
      if (userRequest.user.role == "borrower") {
        loans = await this.getCustomerLoanDetails(userRequest.user.id);
      } else if (userRequest.user.role == "loan officer") {
        loans = await this.getLoanOfficerCreatedLoans(userRequest.user.id);
      }

      if (loans.length === 0) {
        return {
          status: 404,
          message: `No loan found for ${userRequest.user.firstName} ${userRequest.user.lastName}`,
        };
      }

      const customerLoanDetails = {
        name: `${userRequest.user.firstName} ${userRequest.user.lastName}`,
        email: `${userRequest.user.email}`,
        role: `${userRequest.user.role}`,
        loanInfo: loans,
      };

      return customerLoanDetails;
    } catch (err) {
      return {
        status: 500,
        message: err.message || "Failed to get loans",
      };
    }
  }

  async getLoanSchedules(loanIdRequest) {
    try {
      const existingLoan = await Loan.findOne({
        _id: loanIdRequest.loanId,
      }).populate({ path: "customerId", select: "_id, email" });
      if (!existingLoan) {
        return { res: 404, message: "Loan not found" };
      }
      if (loanIdRequest.user.role == "borrower") {
        if (!(existingLoan.customerId.email === loanIdRequest.user.email)) {
          return {
            status: 409,
            message: `Customer can see their loan schedules only`,
          };
        }
      }
      const loanSchedules = await LoanSchedule.find({
        loanId: loanIdRequest.loanId,
      });
      const loanScheduleDetails = [];
      loanSchedules.forEach((schedule) => {
        const loanScheduleData = {
          loanScheduleId: schedule.id,
          installmentNumber: schedule.installmentNumber,
          principalAmount: schedule.principalAmount,
          interestAmount: schedule.interestAmount,
          totalAmount: schedule.totalAmount,
          dueDate: schedule.dueDate,
        };
        loanScheduleDetails.push(loanScheduleData);
      });

      return {
        status: 200,
        data: loanScheduleDetails,
      };
    } catch (err) {
      return {
        status: 500,
        message: `Failed to retrieve repayment schedule: ${err.message}`,
      };
    }
  }

  async getCustomerLoanDetails(customerId) {
    try {
      const loans = await Loan.find({ customerId: customerId })
        .populate({
          path: "createdBy",
          select: "firstName lastName",
        })
        .populate({
          path: "loanSchedules",
          select:
            "-_id installmentNumber principalAmount interestAmount totalAmount dueDate paid",
        })
        .exec();

      const loanDetails = [];
      const loanAllScheduleData = loans.forEach((loanData) => {
        const loan = {
          loanOfficerName: `${loanData.createdBy.firstName} ${loanData.createdBy.lastName}`,
          loanType: loanData.loanType,
          amount: loanData.amount,
          interestRate: loanData.interestRate,
          duration: loanData.duration,
          startDate: loanData.startDate,
          loanSchedules: loanData.loanSchedules,
        };
        loanDetails.push(loan);
      });
      return loanDetails;
    } catch (err) {
      throw err.message;
    }
  }

  async getLoanOfficerCreatedLoans(loanOfficerId) {
    try {
      const loans = await Loan.find({ createdBy: loanOfficerId })
        .populate({
          path: "customerId",
          select: "firstName lastName",
        })
        .populate({
          path: "loanSchedules",
          select:
            "-_id installmentNumber principalAmount interestAmount totalAmount dueDate paid",
        })
        .exec();
      const loanDetails = [];
      loans.forEach((loanData) => {
        const loan = {
          customerName: `${loanData.customerId.firstName} ${loanData.customerId.lastName}`,
          loanType: loanData.loanType,
          amount: loanData.amount,
          interestRate: loanData.interestRate,
          duration: loanData.duration,
          startDate: loanData.startDate,
          loanSchedules: loanData.loanSchedules,
        };
        loanDetails.push(loan);
      });
      return loanDetails;
    } catch (err) {
      throw err.message;
    }
  }

  generateRepaymentSchedule(loan) {
    const { amount, interestRate, duration, startDate } = loan;

    const repaymentSchedule = [];
    let currentDueDate = new Date(startDate);

    for (
      let installmentNumber = 1;
      installmentNumber <= duration;
      installmentNumber++
    ) {
      const principalAmount = amount / duration;
      const interestAmount =
        ((amount - (installmentNumber - 1) * principalAmount) * interestRate) /
        100;
      const totalAmount = principalAmount + interestAmount;
      const loanSchedule = new LoanSchedule();
      loanSchedule.loanId = loan._id;
      loanSchedule.loanType = loan.loanType;
      loanSchedule.installmentNumber = installmentNumber;
      loanSchedule.dueDate = currentDueDate;
      loanSchedule.principalAmount = principalAmount;
      loanSchedule.interestAmount = interestAmount;
      loanSchedule.totalAmount = totalAmount;
      loanSchedule.paid = false;
      repaymentSchedule.push(loanSchedule);

      const nextDueDate = new Date(currentDueDate);
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);
      currentDueDate = nextDueDate;
    }

    return repaymentSchedule;
  }
}

module.exports = LoanService;
