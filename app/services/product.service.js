const slugify = require("slugify");
const Joi = require("joi");
const ProductValidation = require("../../validation/Product.validation");
const ProductModel = require("../model/product.model");
class ProductService {
  constructor() {
    this.productValidation = new ProductValidation();
  }
  createProduct = async (data, created_by) => {
    try {
      if (created_by) {
        data.created_by = created_by;
      }
      console.log("Data before validation in service:", data); // Debug log
      this.productValidation.storeValidate(data);
      const product_obj = new ProductModel(data);
      return await product_obj.save();
    } catch (err) {
      console.log("ProductStore: ", err);
      throw new Error(err.message);
    }
  };
  updateProduct = async (id, data) => {
    try {
      this.productValidation.storeValidate(data);
      const product_obj = await ProductModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!product_obj) {
        throw new Error("Product not found");
      }
      return product_obj;
    } catch (err) {
      console.log("ProductStore: ", err);
      throw new Error(err.message);
    }
  };
  deleteProduct = async (id) => {
    try {
      const product_obj = await ProductModel.findByIdAndDelete(id);
      if (!product_obj) {
        throw new Error("Product Not Found");
      }
      return product_obj;
    } catch (err) {
      throw new Error(err.message);
    }
  };
  getProductById = async (id) => {
    try {
      const product_obj = await ProductModel.findById(id)
        .populate("category_id")
        .populate("brand")
        .populate("seller")
        .populate({
          path: "created_by",
          select: "-password", // Exclude password field
        });
      if (!product_obj) {
        throw new Error("Product Not Found");
      }
      return product_obj;
    } catch (err) {
      throw new Error(err.message);
    }
  };
  getAllCounts = async () => {
    let all_data = await ProductModel.find();
    return all_data.length;
  };
  getProducts = async (skip, limit) => {
    return await ProductModel.find()
      .populate("category_id")
      .populate("brand")
      .populate("seller")
      .populate({
        path: "created_by",
        select: "-password", // Exclude password field
      })
      .skip(skip)
      .limit(limit);
  };
  deleteImageByName = async (prod_id, image_name) => {
    let product = ProductModel.findById(prod_id);
    let all_images = product.images;
    let index = all_images.indexOf(image_name);
    if (index >= 0) {
      all_images.splice(index, 1);
    }
    product.images = all_images;
    return product.save();
  };
}
module.exports = ProductService;
