import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String, 
    required: true 
  },
  sku: {
    type: String, 
    required: true, 
    unique: true 
  },
  stock: { 
    type: Number, 
    required: true, 
    min: 0 
  },
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);
