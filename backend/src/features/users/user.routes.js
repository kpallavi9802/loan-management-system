const express = require("express");
const UserController = require("./user.controller.js");

const userRouter = express.Router();

userRouter.post("/add-user", UserController.addUser);
userRouter.post("/login", UserController.login);

module.exports = userRouter;
