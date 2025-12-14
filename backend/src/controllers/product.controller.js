import { Product } from "../models/product.model.js";
import { Transaction } from "../models/transaction.model.js";

export const listProducts = async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  res.json(products);
};

export const createProduct = async (req, res) => {
  const { name, sku, initialStock } = req.body;

  if (initialStock < 0) {
    return res
      .status(400)
      .json({ message: "Initial stock cannot be negative" });
  }

  const product = await Product.create({
    name,
    sku,
    stock: initialStock,
  });

  res.status(201).json(product);
};

export const increaseStock = async (req, res) => {
  const { quantity } = req.body;
  if (quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be greater than 0" });
  }

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  product.stock += quantity;
  await product.save();

  await Transaction.create({
    productId: product._id,
    type: "INCREASE",
    quantity,
  });

  res.json({ stock: product.stock });
};

export const decreaseStock = async (req, res) => {
  const { quantity } = req.body;
  if (quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be greater than 0" });
  }

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (product.stock < quantity) {
    return res.status(400).json({ message: "Insufficient stock" });
  }

  product.stock -= quantity;
  await product.save();

  await Transaction.create({
    productId: product._id,
    type: "DECREASE",
    quantity,
  });

  res.json({ stock: product.stock });
};

export const getProductSummary = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const transactions = await Transaction.find({ productId: product._id });

  const totalIncreased = transactions
    .filter((t) => t.type === "INCREASE")
    .reduce((sum, t) => sum + t.quantity, 0);

  const totalDecreased = transactions
    .filter((t) => t.type === "DECREASE")
    .reduce((sum, t) => sum + t.quantity, 0);

  res.json({
    product,
    currentStock: product.stock,
    totalIncreased,
    totalDecreased,
  });
};

export const getTransactions = async (req, res) => {
  const transactions = await Transaction.find({
    productId: req.params.id,
  }).sort({ timestamp: -1 });

  res.json(transactions);
};
