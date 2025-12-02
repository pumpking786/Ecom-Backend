const slugify = require("slugify");

const CategoryService = require("../services/category.service");
const { statusSchema } = require("../model/commom.schema");
class CategoryController {
  constructor() {
    this.category_srv = new CategoryService();
  }
  categoryStore = async (req, res, next) => {
    try {
      let data = req.body; // Initialize with request body or {...req.body}

      if (req.file) {
        data.image = req.file.filename;
      }

      data.slug = slugify(data.name, {
        lower: true,
      });

      if (!data.brands || data.brands == "null") {
        data.brands = null;
      }
      if (!data.parent_id || data.parent_id === "null") {
        data.parent_id = null;
      }

      // this.category_srv.storeValidate(data);
      let response = await this.category_srv.createCategory(data);
      res.json({
        result: response,
        msg: "Category created successfully",
        status: true,
      });
    } catch (except) {
      console.log("CategoryStore: ", except);
      next({ status: 400, msg: except.message });
    }
  };
  categoryUpdate = async (req, res, next) => {
    try {
      let data = req.body;
      const id = req.params.id;

      const existingCategory = await this.category_srv.getCategoryById(id);

      if (req.file) {
        data.image = req.file.filename;
      } else {
        data.image = existingCategory.image;
      }

      data.slug = slugify(data.name, {
        lower: true,
      });

      if (!data.brands || data.brands == "null") {
        data.brands = null;
      }
      if (!data.parent_id || data.parent_id === "null") {
        data.parent_id = null;
      }

      let response = await this.category_srv.updateCategory(id, data);
      res.json({
        result: response,
        msg: `Category updated successfully`,
        status: true,
      });
    } catch (except) {
      console.log("CategoryStore: ", except);
      next({ status: 400, msg: except.message });
    }
  };
  categoryDelete = async (req, res, next) => {
    try {
      const id = req.params.id;

      let response = await this.category_srv.deleteCategory(id);
      res.json({
        result: response,
        msg: `Category deleted successfully`,
        status: true,
      });
    } catch (except) {
      next({ status: 400, msg: except.message });
    }
  };
  categoryGetById = async (req, res, next) => {
    try {
      const id = req.params.id;

      let response = await this.category_srv.getCategoryById(id);
      res.json({
        result: response,
        msg: `Data fetched`,
        status: true,
      });
    } catch (except) {
      next({ status: 400, msg: except.message });
    }
  };
  getCategories = async (req, res, next) => {
    try {
      const type = req.params.type;

      //total_count=101
      // per_page=10
      //total_page=11
      let paginate = {
        total_count: await this.category_srv.getAllCounts(),
        per_page: req.query.per_page ? parseInt(req.query.per_page) : 10,
        current_page: req.query.page ? parseInt(req.query.page) : 1,
      };
      //100=>
      //1,0-9=>0,
      //2=>10-19,10,
      //3=>20-29=>20
      let skip = (paginate.current_page - 1) * paginate.per_page;
      let data = await this.category_srv.getCategories(skip, paginate.per_page);
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
  getActiveCats = async (req, res, next) => {
    try {
      let response = await this.category_srv.getAllActiveCats("active");
      res.json({
        result: response,
        status: true,
        msg: "Active Categories Fetched",
      });
    } catch (error) {
      next({ status: 400, msg: error });
    }
  };
}
module.exports = CategoryController;
