const mongoose = require("mongoose");
const { trigger, statusSchema, created_by } = require("./commom.schema");
const { required, boolean } = require("joi");
const ProductSchemaDef = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      unique: false,
    },
    category_id: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        default: null,
      },
    ],
    price: { type: Number, required: true, min: 1 },
    discount: { type: Number, default: 0, required: true, min: 1, max: 100 },
    actual_price: {
      type: Number,
      default: 1,
      required: true,
      min: 1,
    },
    images: [String],
    //   type: String,
    //   enum: ["brand", "banner"],
    //   default: "banner",
    // },
    brand: { type: mongoose.Types.ObjectId, ref: "Label", default: null },
    is_featured: {
      type: Boolean,
      default: false,
    },
    seller: created_by,
    status: statusSchema,
    created_by: created_by,
  },
  trigger
);
const ProductModel = mongoose.model("Product", ProductSchemaDef);
module.exports = ProductModel;
