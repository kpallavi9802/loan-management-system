const jwt = require("jsonwebtoken");
const verifyUser = require("../utils/verify-user.util");
const dotenv = require("dotenv");

dotenv.config();

const config = process.env;

async function authorizeUser(req, res, next) {
  let token = req.body.token || req.query.token || req.headers?.authorization;
  token = token?.replace("Bearer ", "");

  if (!token) {
    return res.status(403).send({
      status: false,
      message: "A token is required for authorization",
    });
  }
  try {
    const decoded = jwt.verify(token, config.API_TOKEN_KEY);
    const verifiedUser = await verifyUser(decoded.email);
    if (!verifiedUser.status) {
      return res.status(403).send({
        status: false,
        message: "Invalid Token",
      });
    }
    req.user = verifiedUser.user;
  } catch (err) {
    return res.status(403).send({
      status: false,
      message: "Invalid token",
    });
  }
  return next();
}

module.exports = authorizeUser;
