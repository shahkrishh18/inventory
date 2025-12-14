// src/seeddata.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { Product } from "./src/models/product.model.js";
import { Transaction } from "./src/models/transaction.model.js";

const MON_URI = process.env.MONGO_URI;

const seedData = async () => {
  try {
    await mongoose.connect(MON_URI);
    console.log("MongoDB connected");

    // Clear existing data
    await Transaction.deleteMany();
    await Product.deleteMany();

    // Create products
    const products = await Product.insertMany([
      {
        name: "Laptop",
        sku: "LP101",
        stock: 20
      },
      {
        name: "Wireless Mouse",
        sku: "WM202",
        stock: 50
      }
    ]);

    // Create transactions
    await Transaction.insertMany([
      {
        productId: products[0]._id,
        type: "INCREASE",
        quantity: 20
      },
      {
        productId: products[1]._id,
        type: "INCREASE",
        quantity: 50
      }
    ]);

    console.log("Seed data inserted successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
