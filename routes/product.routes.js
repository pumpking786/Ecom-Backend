const authenticateJWT = require("../app/middleware/authenticationJWT");
const {
  isAdmin,
  isCustomer,
  isAdminSeller,
} = require("../app/middleware/rbac.middleware");
const uploader = require("../app/middleware/uploader.middleware");
const router = require("express").Router();
const ProductController = require("../app/controller/product.controller");
const productCtrl = new ProductController();

router.get("/slug/:slug", productCtrl.getProductBySlug);

router
  .route("/")
  .post(
    authenticateJWT,
    isAdminSeller,
    uploader.array("images"),
    productCtrl.productStore
  )
  .get(productCtrl.getProducts);

router
  .route("/:id")
  .put(
    authenticateJWT,
    isAdminSeller,
    uploader.array("images"),
    productCtrl.productUpdate
  )
  .delete(authenticateJWT, isAdmin, productCtrl.productDelete)
  .get(productCtrl.productGetById);

module.exports = router;
