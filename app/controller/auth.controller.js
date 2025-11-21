const UserService = require("../services/user.service");

class AuthController {
  constructor() {
    this.user_svc = new UserService();
  }

  registerUser = async (req, res, next) => {
    try {
      const response = await this.user_svc.createUser(req.body);
      res.json(response);
    } catch (err) {
      console.error("Register error:", err.message);
      next({ status: 400, msg: err.message });
    }
  };

  verifyOtp = async (req, res, next) => {
    try {
      const { email, otp } = req.body;
      const user = await this.user_svc.verifyOtp({ email, otp });
      res.json({
        status: true,
        msg: "Registration completed successfully",
        result: user,
      });
    } catch (err) {
      console.error("Verify OTP error:", err.message);
      next({ status: 400, msg: err.message });
    }
  };

  loginUser = async (req, res, next) => {
    try {
      const loggedInUser = await this.user_svc.login(req.body);
      res.json({
        result: loggedInUser,
        status: true,
        msg: "Logged in successfully",
      });
    } catch (err) {
      console.error("Login error:", err.message);
      next({ status: 400, msg: err.message });
    }
  };

  logoutUser = (req, res) => {
    res.json({ status: true, msg: "Logout not implemented" });
  };

  // changepwd = (req, res) => {
  //   res.json({ status: true, msg: "Password change not implemented" });
  // };
}

module.exports = AuthController;
