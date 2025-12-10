const authenticateJWT = require("../app/middleware/authenticationJWT");
const { isCustomer } = require("../app/middleware/rbac.middleware");
const router = require("express").Router();
const OrderController = require("../app/controller/order.controller");
const orderCtrl = new OrderController();

router.post("/detail", orderCtrl.getCartDetail);
router.post("/", authenticateJWT, isCustomer, orderCtrl.createOrder);

module.exports = router;
