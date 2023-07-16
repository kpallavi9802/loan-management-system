const User = require("../../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const secretKey = process.env.API_TOKEN_KEY || "mysecretkey";
const expiresIn = 60 * 120;
const ALGORITHM = process.env.ALGORITHM || "HS256";

class UserService {
  async addUser(userRequest) {
    try {
      const existingUser = await User.findOne({ email: userRequest.email });
      if (existingUser) {
        return {
          status: 409,
          message: `User with email ${userRequest.email} already exists`,
        };
      }

      const user = new User();
      user.email = userRequest.email;
      user.password = await bcrypt.hash(userRequest.password, 10);
      user.firstName = userRequest.firstName;
      user.lastName = userRequest.lastName;
      user.role = userRequest.role;

      await user.save();
      return { status: 201, message: "User Added Successfully!" };
    } catch (err) {
      return { status: 500, message: `Failed to add user : ${err.message}` };
    }
  }

  async login(userRequest) {
    try {
      console.log("request = ", userRequest);
      if (!userRequest.email || !userRequest.password) {
        return { status: 403, message: "All fields are required!" };
      }

      const user = await User.findOne({ email: userRequest.email });
      if (!user) {
        return { status: 404, message: "User Not Found" };
      }
      const isPasswordMatch = await bcrypt.compare(
        userRequest.password,
        user.password
      );
      if (!isPasswordMatch) {
        return {
          status: 403,
          message: "Invalid Credentials - Password didn't match",
        };
      }
      const token = jwt.sign({ id: user.id, email: user.email }, secretKey, {
        expiresIn: expiresIn,
      });
      return {
        status: 200,
        message: "User Logged In Successfully",
        token: token,
      };
    } catch (err) {
      return { status: 500, message: `Login failed : ${err.message}` };
    }
  }
}

module.exports = UserService;
