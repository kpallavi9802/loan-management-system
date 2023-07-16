const mongoose = require("mongoose");

const User = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: {
    type: String,
    enum: ["borrower", "loan officer"],
    required: true,
  },
});

User.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const UserModel = mongoose.model("User", User);
module.exports = UserModel;
