const express = require("express");
const userRouter = require("./features/users/user.routes");
const loanRouter = require("./features/loans/loan.routes");

const authorizeUser = require("./middleware/auth.middleware");

const router = express.Router();

router.use("/user", userRouter);
router.use("/loan", authorizeUser, loanRouter);

module.exports = router;
