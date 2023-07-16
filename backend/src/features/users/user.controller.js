const UserService = require("./user.service");

class UserController {
  async addUser(req, res) {
    try {
      const role = req.body.role ? req.body.role : "borrower";
      const { email, password, firstName, lastName } = req.body;
      const response = await new UserService().addUser({
        email,
        password,
        firstName,
        lastName,
        role,
      });
      res.json(response);
    } catch (error) {
      throw error.message;
    }
  }

  async login(req, res) {
    try {
      const { password, email } = req.body;
      const response = await new UserService().login({
        email,
        password,
      });

      res.json(response);
    } catch (error) {
      throw error.message;
    }
  }
}

module.exports = new UserController();
