const User = require("../models/user.model");

async function verifyUser(email) {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return { status: false, message: "User Not Found" };
    }
    return { status: true, user: user };
  } catch (err) {
    throw err.message;
  }
}

module.exports = verifyUser;
