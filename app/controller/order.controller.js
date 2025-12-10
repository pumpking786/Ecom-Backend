const ProductModel = require("../model/product.model");
const OrderService = require("../services/order.service");
class OrderController {
  constructor() {
    this.order_srv = new OrderService();
  }
  createOrder = async (req, res, next) => {
    try {
      const response = await this.order_srv.createOrder(req.body, req.user.id);
      res.json(response);
    } catch (except) {
      next({ status: 400, msg: except.msg });
    }
  };
  getCartDetail = async (req, res, next) => {
    try {
      const response = await this.order_srv.getCartDetail(req.body);
      res.json(response);
    } catch (except) {
      next({ status: 400, msg: except.msg });
    }
  };
}
module.exports = OrderController;
