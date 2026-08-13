import mongoose from "mongoose";

const mattressDimensionSchema = new mongoose.Schema(
  {
    dimension: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const sizeSchema = new mongoose.Schema(
  {
    hight: {
      type: String,
      required: true,
      trim: true,
    },
    mattressDimension: {
      type: [mattressDimensionSchema],
      required: true,
    },
  },
  { _id: false }
);

const mainSizeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    size: {
      type: [sizeSchema],
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Size", mainSizeSchema);
