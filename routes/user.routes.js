const express = require("express");
const user_routes = express();
const UserController = require("../app/controller/user.controller");
const authenticateJWT = require("../app/middleware/authenticationJWT");
const userCtrl = new UserController();
user_routes.get("/user-profile", authenticateJWT, userCtrl.userProfile);

module.exports = user_routes;
