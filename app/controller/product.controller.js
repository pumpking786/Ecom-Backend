const slugify = require("slugify");

const ProductService = require("../services/product.service");
const { statusSchema } = require("../model/commom.schema");
class ProductController {
  constructor() {
    this.product_srv = new ProductService();
  }
  productStore = async (req, res, next) => {
    try {
      let data = req.body; // Initialize with request body or {...req.body}
      data.images = [];
      if (req.files) {
        req.files.map((item) => {
          data.images.push(item.filename);
        });
      }
      data.slug = slugify(data.name, {
        lower: true,
      });
      if (!data.brand || data.brand == "null") {
        data.brand = null;
      }
      if (!data.seller || data.seller == "null") {
        data.seller = null;
      }
      if (!data.category_id || data.category_id === "null") {
        data.category_id = null;
      } else {
        data.category_id = data.category_id.split(",");
      }
      data.actual_price =
        Number(data.price) - Number(data.price) * (Number(data.discount) / 100);
      data.is_featured = !!data.is_featured; //true
      console.log("hello bro", req.user.id);

      let response = await this.product_srv.createProduct(data, req.user.id);
      res.json({
        result: response,
        msg: "Product created successfully",
        status: true,
      });
    } catch (except) {
      console.log("ProductStore: ", except);
      next({ status: 400, msg: except.message });
    }
  };
  productUpdate = async (req, res, next) => {
    try {
      let data = req.body;
      const id = req.params.id;

      const existingProduct = await this.product_srv.getProductById(id);
      // Check if the authenticated user is the creator
      if (
        existingProduct.created_by &&
        existingProduct.created_by._id.toString() !== req.user.id &&
        !req.user.role === "admin"
      ) {
        throw new Error(
          "Unauthorized: Only the creator can update this product"
        );
      }
      data.images = existingProduct.images;
      //data.images=[] //replace all the older image with new images

      if (req.files) {
        req.files.map((item) => {
          data.images.push(item.filename);
        });
      }
      // else {
      //   data.image = existingProduct.images;
      // }

      data.slug = slugify(data.name, {
        lower: true,
      });

      if (!data.brand || data.brand == "null") {
        data.brand = null;
      }
      if (!data.seller || data.seller == "null") {
        data.seller = null;
      }
      if (!data.category_id || data.category_id === "null") {
        data.category_id = null;
      } else {
        data.category_id = data.category_id.split(",");
      }
      data.actual_price =
        Number(data.price) - Number(data.price) * (Number(data.discount) / 100);
      data.is_featured = data.is_featured == 1 ? true : false; //true

      let response = await this.product_srv.updateProduct(id, data);
      res.json({
        result: response,
        msg: `Product updated successfully`,
        status: true,
      });
    } catch (except) {
      console.log("ProductStore: ", except);
      next({ status: 400, msg: except.message });
    }
  };
  productDelete = async (req, res, next) => {
    try {
      const id = req.params.id;
      const existingProduct = await this.product_srv.getProductById(id);

      // Check if the authenticated user is the creator
      if (
        existingProduct.created_by &&
        existingProduct.created_by._id.toString() !== req.user.id &&
        !req.user.role === "admin"
      ) {
        throw new Error(
          "Unauthorized: Only the creator can delete this product"
        );
      }
      let response = await this.product_srv.deleteProduct(id);
      res.json({
        result: response,
        msg: `Product deleted successfully`,
        status: true,
      });
    } catch (except) {
      next({ status: 400, msg: except.message });
    }
  };
  productGetById = async (req, res, next) => {
    try {
      const id = req.params.id;

      let response = await this.product_srv.getProductById(id);
      res.json({
        result: response,
        msg: `Data fetched`,
        status: true,
      });
    } catch (except) {
      next({ status: 400, msg: except.message });
    }
  };
  getProductBySlug = async (req, res, next) => {
    try {
      const slug = req.params.slug;

      let response = await this.product_srv.getProductBySlug(slug);
      res.json({
        result: response,
        msg: `Data fetched`,
        status: true,
      });
    } catch (except) {
      next({ status: 400, msg: except.message });
    }
  };
  getProducts = async (req, res, next) => {
    try {
      const type = req.params.type;

      //total_count=101
      // per_page=10
      //total_page=11
      let paginate = {
        total_count: await this.product_srv.getAllCounts(),
        per_page: req.query.per_page ? parseInt(req.query.per_page) : 10,
        current_page: req.query.page ? parseInt(req.query.page) : 1,
      };
      //100=>
      //1,0-9=>0,
      //2=>10-19,10,
      //3=>20-29=>20
      let skip = (paginate.current_page - 1) * paginate.per_page;
      let data = await this.product_srv.getProducts(skip, paginate.per_page);
      res.json({
        result: data,
        status: true,
        paginate: paginate,
        msg: "Data fetched",
      });
    } catch (except) {
      next({ status: 400, msg: except });
    }
  };
  deleteImageByName = async (req, res, next) => {
    try {
      let res = await this.product_srv.deleteImageByName(
        req.params.product_id,
        req.params.image
      );
      res.json({
        status: true,
        result: res,
        msg: "Image deleted",
      });
    } catch (next) {
      next({ status: 400, msg: "Image could not be deleted." });
    }
  };
}
module.exports = ProductController;
