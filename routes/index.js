const express = require("express");
const app_routes = express();

const auth_routes = require("./auth.routes");
app_routes.use(auth_routes);

const user_routes = require("./user.routes");
app_routes.use(user_routes);

const cat_routes = require("./category.routes");
app_routes.use("/category", cat_routes); // Mount at /category

const product_routes = require("./product.routes");
app_routes.use("/product", product_routes);

const order_routes = require("./order.routes");
app_routes.use("/order", order_routes);

const label_routes = require("./label.routes");
app_routes.use(label_routes);

module.exports = app_routes;
