const express = require("express");
const authenticateJWT = require("../app/middleware/authenticationJWT");
const { isAdmin, isCustomer } = require("../app/middleware/rbac.middleware");
const uploader = require("../app/middleware/uploader.middleware");
const label_routes = express();
const LabelController = require("../app/controller/label.controller");
const labelCtrl = new LabelController();

const validateType = (req, res, next) => {
  if (req.params.type === "brand" || req.params.type === "banner") {
    next();
  } else {
    next({ status: 404, msg: "Resource not found" });
  }
};

label_routes.get("/:type/active", labelCtrl.getActiveLabels);

label_routes.post(
  "/:type",
  validateType,
  authenticateJWT,
  isAdmin,
  uploader.single("image"),
  labelCtrl.labelStore
);
label_routes.put(
  "/:type/:id",
  validateType,
  authenticateJWT,
  isAdmin,
  uploader.single("image"),
  labelCtrl.labelUpdate
);
label_routes.delete(
  "/:type/:id",
  validateType,
  authenticateJWT,
  isAdmin,
  labelCtrl.labelDelete
);
label_routes.get("/:type/:id", validateType, labelCtrl.labelGetById);
label_routes.get("/:type", validateType, labelCtrl.getLabels);

module.exports = label_routes;
