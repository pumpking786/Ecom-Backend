const slugify = require("slugify");

const LabelService = require("../services/label.service");
const { statusSchema } = require("../model/commom.schema");
class LabelController {
  constructor() {
    this.label_srv = new LabelService();
  }
  labelStore = async (req, res, next) => {
    try {
      let data = req.body; // Initialize with request body or {...req.body}

      if (req.file) {
        data.image = req.file.filename;
      }
      data.type = req.params.type;

      if (!data.link || data.link == "null") {
        data.link = slugify(data.title, {
          lower: true,
        });
      }

      // this.label_srv.storeValidate(data);
      let response = await this.label_srv.createLabel(data);
      res.json({
        result: response,
        msg: data.type + " created successfully",
        status: true,
      });
    } catch (except) {
      console.log("LabelStore: ", except);
      next({ status: 400, msg: except.message });
    }
  };
  labelUpdate = async (req, res, next) => {
    try {
      let data = req.body;
      const id = req.params.id;
      const type = req.params.type;

      const existingLabel = await this.label_srv.getLabelById(type, id);

      if (req.file) {
        data.image = req.file.filename;
      } else {
        data.image = existingLabel.image;
      }

      if (!data.link || data.link === "null") {
        data.link = slugify(data.title, { lower: true });
      }

      let response = await this.label_srv.updateLabel(id, data);
      res.json({
        result: response,
        msg: `${type} updated successfully`,
        status: true,
      });
    } catch (except) {
      console.log("LabelStore: ", except);
      next({ status: 400, msg: except.message });
    }
  };
  labelDelete = async (req, res, next) => {
    try {
      const id = req.params.id;
      const type = req.params.type;

      let response = await this.label_srv.deleteLabel(id);
      res.json({
        result: response,
        msg: `${type} deleted successfully`,
        status: true,
      });
    } catch (except) {
      next({ status: 400, msg: except.message });
    }
  };
  labelGetById = async (req, res, next) => {
    try {
      const id = req.params.id;
      const type = req.params.type;

      let response = await this.label_srv.getLabelById(type, id);
      res.json({
        result: response,
        msg: `Data fetched`,
        status: true,
      });
    } catch (except) {
      next({ status: 400, msg: except.message });
    }
  };
  getLabels = async (req, res, next) => {
    try {
      //total_count=101
      // per_page=10
      //total_page=11
      let paginate = {
        total_count: await this.label_srv.getAllCounts(req.params.type),
        per_page: req.query.per_page ? parseInt(req.query.per_page) : 10,
        current_page: req.query.page ? parseInt(req.query.page) : 1,
      };
      //100=>
      //1,0-9=>0,
      //2=>10-19,10,
      //3=>20-29=>20
      let skip = (paginate.current_page - 1) * paginate.per_page;
      let data = await this.label_srv.getLabels(
        { type: req.params.type },
        skip,
        paginate.per_page
      );
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
  getActiveLabels = async (req, res, next) => {
    try {
      // const type = req.params.type;

      //total_count=101
      // per_page=10
      //total_page=11
      let paginate = {
        total_count: await this.label_srv.getAllCounts(req.params.type),
        per_page: req.query.per_page ? parseInt(req.query.per_page) : 10,
        current_page: req.query.page ? parseInt(req.query.page) : 1,
      };
      //100=>
      //1,0-9=>0,
      //2=>10-19,10,
      //3=>20-29=>20
      let skip = (paginate.current_page - 1) * paginate.per_page;
      let data = await this.label_srv.getLabels(
        { type: req.params.type, status: "active" },
        skip,
        paginate.per_page
      );
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
}
module.exports = LabelController;
