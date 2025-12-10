const ProductModel = require("../model/product.model");
const OrderModel = require("../model/order.model");

class OrderService {
  createOrder = async (data, userId) => {
    try {
      let order_data = {
        buyer_id: userId,
        cart: [],
        sub_total: 0,
        discount: {
          ...data.discount,
        },
        service_charge: data.service_charge,
        delivery_charge: data.delivery_charge,
        vat: 0,
        total_amt: 0,
        order_data: Date.now(),
        status: "pending",
        is_paid: {
          paid: data.is_paid,
          mode: data?.transaction_code ? "online" : "cod",
          transaction: data?.transaction_code || null,
        },
        created_by: userId,
      };
      let cart = [];
      let sub_total = 0;
      let cart_product_ids = data.cart.map((item) => item.product_id);
      let cart_product = await ProductModel.find({
        _id: {
          $in: cart_product_ids,
        },
      });
      cart_product.map((prod) => {
        let curr_qty = 0;
        data.cart.map((item) => {
          if (prod._id.equals(item.product_id)) {
            curr_qty = Number(item.qty);
          }
        });
        let item_total = curr_qty * prod.actual_price;
        let single_item = {
          product_id: prod._id,
          qty: curr_qty,
          total_amt: item_total,
        };
        cart.push(single_item);
        sub_total += item_total;
      });
      order_data.cart = cart;
      order_data.sub_total = sub_total;
      let discount_amt = 0;
      if (order_data.discount) {
        if (order_data.discount.discount_type === "flat") {
          discount_amt = Number(order_data.discount.amount);
        } else {
          discount_amt = (sub_total * Number(order_data.discount.amount)) / 100;
        }
      }
      order_data.total_amt = Math.ceil(
        sub_total -
          discount_amt +
          Number(order_data.service_charge) +
          Number(order_data.vat) +
          Number(order_data.delivery_charge)
      );
      let order = new OrderModel(order_data);
      await order.save();
      if (order) {
        //Online payment===> trigger Payment gatemway SDK ===> our url, eu===>url
        // success Response => json body , order id, transaction code
        return {
          result: order_data,
          msg: "Order created successfully",
          status: true,
        };
      } else {
        next({ status: 400, msg: order });
      }
    } catch (err) {
      throw new Error(err.message || "Error creating order");
    }
  };
  getCartDetail = async (data) => {
    try {
      let cart = [];
      // let sub_total = 0;
      let cart_product_ids = data.cart.map((item) => item.product_id);
      let cart_product = await ProductModel.find({
        _id: {
          $in: cart_product_ids,
        },
      });
      cart_product.map((prod) => {
        let curr_qty = 0;
        data.cart.map((item) => {
          if (prod._id.equals(item.product_id)) {
            curr_qty = Number(item.qty);
          }
        });
        let item_total = curr_qty * prod.actual_price;
        let single_item = {
          product_id: prod._id,
          product_name: prod.name,
          actual_price: prod.actual_price,
          qty: curr_qty,
          total_amt: item_total,
        };
        cart.push(single_item);
        // sub_total += item_total;
      });
      return {
        result: { cart },
        //if subtotal want to do with bend, uncomment
        status: true,
        msg: "Cart Detail",
      };
    } catch (err) {
      throw err;
    }
  };
}

module.exports = OrderService;
