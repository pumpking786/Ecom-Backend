const authenticateJWT = require("../app/middleware/authenticationJWT");
const { isAdmin, isCustomer } = require("../app/middleware/rbac.middleware");
const uploader = require("../app/middleware/uploader.middleware");
const router = require("express").Router();
const CategoryController = require("../app/controller/category.controller");
const categoryCtrl = new CategoryController();

router.get("/slug/:slug", categoryCtrl.getProductByCatSlug);

router
  .route("/")
  .post(
    authenticateJWT,
    isAdmin,
    uploader.single("image"),
    categoryCtrl.categoryStore
  )
  .get(categoryCtrl.getCategories);

router
  .route("/:id")
  .put(
    authenticateJWT,
    isAdmin,
    uploader.single("image"),
    categoryCtrl.categoryUpdate
  )
  .delete(authenticateJWT, isAdmin, categoryCtrl.categoryDelete)
  .get(categoryCtrl.categoryGetById);

router.get("/active/only", categoryCtrl.getActiveCats);

module.exports = router;
