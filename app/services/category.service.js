const slugify = require("slugify");
const Joi = require("joi");
const CategoryValidation = require("../../validation/Category.validation");
const CategoryModel = require("../model/category.model");
class CategoryService {
  constructor() {
    this.categoryValidation = new CategoryValidation();
  }
  createCategory = async (data) => {
    try {
      this.categoryValidation.storeValidate(data);
      // id,id,id=>["id","id","id"]
      data.brands = data.brands ? data.brands.split(",") : null; // One-line split
      const category_obj = new CategoryModel(data);
      return await category_obj.save();
    } catch (err) {
      console.log("CategoryStore: ", err);
      throw new Error(err.message);
    }
  };
  updateCategory = async (id, data) => {
    try {
      this.categoryValidation.storeValidate(data);
      // id,id,id=>["id","id","id"]
      data.brands = data.brands ? data.brands.split(",") : null; // One-line split
      const category_obj = await CategoryModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!category_obj) {
        throw new Error("Category not found");
      }
      return category_obj;
    } catch (err) {
      console.log("CategoryStore: ", err);
      throw new Error(err.message);
    }
  };
  deleteCategory = async (id) => {
    try {
      const category_obj = await CategoryModel.findByIdAndDelete(id);
      if (!category_obj) {
        throw new Error("Category Not Found");
      }
      return category_obj;
    } catch (err) {
      throw new Error(err.message);
    }
  };
  getCategoryById = async (id) => {
    try {
      const category_obj = await CategoryModel.findById(id)
        .populate("parent_id")
        .populate("brands");
      if (!category_obj) {
        throw new Error("Category Not Found");
      }
      return category_obj;
    } catch (err) {
      throw new Error(err.message);
    }
  };
  getAllCounts = async () => {
    let all_data = await CategoryModel.find();
    return all_data.length;
  };
  getCategories = async (skip, limit) => {
    return await CategoryModel.find()
      .populate("parent_id")
      .populate("brands")
      .skip(skip)
      .limit(limit);
  };
  getAllActiveCats = async (status) => {
    try {
      let response = await CategoryModel.find({ status: status })
        .populate("parent_id")
        .populate("brands");
      return response;
    } catch (error) {
      throw error;
    }
  };
  getCatByFilter = async (filter) => {
    try {
      let result = await CategoryModel.find(filter)
        .populate("parent_id")
        .populate("brands");
      return result;
    } catch (error) {
      throw error;
    }
  };
}
module.exports = CategoryService;
