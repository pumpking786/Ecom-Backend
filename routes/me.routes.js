const express = require("express");
const me_routes = express();
const MeController = require("../app/controller/me.controller");
const authenticateJWT = require("../app/middleware/authenticationJWT");
const meCtrl = new MeController();
me_routes.get("/", authenticateJWT, meCtrl.meProfile);

module.exports = me_routes;
