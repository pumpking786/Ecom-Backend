const slugify = require("slugify");

const UserService = require("../services/user.service");
const { statusSchema } = require("../model/commom.schema");
class UserController {
  constructor() {
    this.user_srv = new UserService();
  }
  userCreate = async (req, res, next) => {
    try {
      let data = req.body; // Initialize with request body or {...req.body}

      if (req.file) {
        data.image = req.file.filename;
      }

      // this.user_srv.storeValidate(data);
      let response = await this.user_srv.createUserByAdmin(data);
      res.json({
        result: response,
        msg: "User created successfully",
        status: true,
      });
    } catch (except) {
      console.log("UserStore: ", except);
      next({ status: 400, msg: except.message });
    }
  };
  userUpdate = async (req, res, next) => {
    try {
      let data = req.body;
      const id = req.params.id;

      const existingUser = await this.user_srv.getUserById(id);

      if (req.file) {
        data.image = req.file.filename;
      } else {
        data.image = existingUser.image;
      }

      let response = await this.user_srv.updateUser(id, data);
      res.json({
        result: response,
        msg: `User updated successfully`,
        status: true,
      });
    } catch (except) {
      console.log("UserStore: ", except);
      next({ status: 400, msg: except.message });
    }
  };
  userDelete = async (req, res, next) => {
    try {
      const id = req.params.id;

      let response = await this.user_srv.deleteUser(id);
      res.json({
        result: response,
        msg: `User deleted successfully`,
        status: true,
      });
    } catch (except) {
      next({ status: 400, msg: except.message });
    }
  };
  userGetById = async (req, res, next) => {
    try {
      const id = req.params.id;

      let response = await this.user_srv.getUserById(id);
      res.json({
        result: response,
        msg: `Data fetched`,
        status: true,
      });
    } catch (except) {
      next({ status: 400, msg: except.message });
    }
  };
  getUsers = async (req, res, next) => {
    try {
      //total_count=101
      // per_page=10
      //total_page=11
      let paginate = {
        total_count: await this.user_srv.getAllCounts(),
        per_page: req.query.per_page ? parseInt(req.query.per_page) : 10,
        current_page: req.query.page ? parseInt(req.query.page) : 1,
      };
      //100=>
      //1,0-9=>0,
      //2=>10-19,10,
      //3=>20-29=>20

      let skip = (paginate.current_page - 1) * paginate.per_page;
      let data = await this.user_srv.getUsers(
        req.user.id,
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
module.exports = UserController;
