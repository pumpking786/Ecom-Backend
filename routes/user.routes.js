const express = require("express");
const authenticateJWT = require("../app/middleware/authenticationJWT");
const { isAdmin, isCustomer } = require("../app/middleware/rbac.middleware");
const uploader = require("../app/middleware/uploader.middleware");
const user_routes = express();
const UserController = require("../app/controller/user.controller");
const userCtrl = new UserController();

user_routes.post(
  "/",
  authenticateJWT,
  isAdmin,
  uploader.single("image"),
  userCtrl.userCreate
);
user_routes.put(
  "/:id",
  authenticateJWT,
  isAdmin,
  uploader.single("image"),
  userCtrl.userUpdate
);
user_routes.put(
  "/changePassword/user",
  authenticateJWT,
  userCtrl.changePassword
);
user_routes.put(
  "/changePasswordByAdmin/:id",
  authenticateJWT,
  isAdmin,
  userCtrl.changePasswordByAdmin
);
user_routes.delete("/:id", authenticateJWT, isAdmin, userCtrl.userDelete);
user_routes.get("/:id", userCtrl.userGetById);
user_routes.get("/", authenticateJWT, isAdmin, userCtrl.getUsers);

module.exports = user_routes;
