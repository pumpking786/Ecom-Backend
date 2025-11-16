const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { SMTP } = require("../../config/config");
const DbService = require("./db.service");
const UserModel = require("../model/user.model");
const { response } = require("express");
const { AuthValidation } = require("../../validation/Auth.validation");
class UserService extends DbService {
  constructor() {
    super();
    this.authValidation = new AuthValidation();
    this.pendingUsers = [];
  }

  createUser = async (data) => {
    try {
      // Validate input
      this.authValidation.validateRegister(data);
      // Check for duplicate email in MongoDB
      const existingUser = await UserModel.findOne({ email: data.email });

      if (existingUser) {
        throw new Error("Email already registered");
      }
      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000);

      // New pending user object
      const pendingUser = {
        ...data,
        password: hashedPassword, // always hashed
        otp, // ✅ must include OTP
      };

      // Check if email already exists in pendingUsers
      const index = this.pendingUsers.findIndex((u) => u.email === data.email);

      if (index !== -1) {
        // Overwrite the existing pending user
        this.pendingUsers[index] = pendingUser;
      } else {
        // Add new pending user
        this.pendingUsers.push(pendingUser);
      }

      // Send OTP via email (commented out as in original)
      // let transporter = nodemailer.createTransport({
      //   host: SMTP.HOST,
      //   port: SMTP.PORT,
      //   secure: SMTP.TLS,
      //   auth: {
      //     user: SMTP.USER,
      //     pass: SMTP.PASS,
      //   },
      // });
      // await transporter.sendMail({
      //   to: data.email,
      //   from: SMTP.FROM,
      //   subject: "Verify your Email",
      //   text: `Dear ${data.name}, Your OTP is: ${otp}`,
      //   html: `<b> Dear ${data.name},Your OTP for registration is ${otp}</b>`,
      // });

      return {
        result: `Your otp for registration is ${otp}`,
        status: true,
        msg: "OTP sent to your email. Enter it to complete registration",
      };
    } catch (err) {
      console.error("Create user error:", err.message);
      throw new Error(err.message);
    }
  };

  verifyOtp = async (data) => {
    try {
      this.authValidation.validateVerifyOtp(data);
      const { email, otp } = data;
      // Find pending user
      const index = this.pendingUsers.findIndex(
        (u) => u.email === email && u.otp == otp
      );
      if (index === -1) {
        throw new Error("Invalid OTP or email");
      }

      // Move user to registered
      const user = this.pendingUsers.splice(index, 1)[0];
      let user_obj = new UserModel(user);
      return await user_obj.save();
      // await this.db.collection("users").insertOne({
      //   name: user.name,
      //   email: user.email,
      //   password: user.password,
      // });

      // return {
      //   name: user.name,
      //   email: user.email,
      // };
    } catch (err) {
      console.error("Verify OTP error:", err.message);
      throw new Error(err.message);
    }
  };

  login = async (data) => {
    try {
      // Validate input
      this.authValidation.validateLogin(data);
      const { email, password, role } = data;

      // Find user in MongoDB
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("Email does not match");
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Password do not match");
      }

      // Create JWT token
      const token = jwt.sign(
        { email: user.email, name: user.name, id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return {
        token,
        user,
      };
    } catch (err) {
      console.error("Login service error:", err.message);
      throw new Error(err.message);
    }
  };
  getUserById = async (id) => {
    try {
      let user = await UserModel.findById(id);
      return user;
    } catch (err) {
      throw err;
    }
  };
}

module.exports = UserService;
