
import express from "express";
import cors from "cors";
import productRouter from "./routes/product.route.js";
import { notFound } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

export const app = express();

// CORS configuration to allow frontend to access backend
const corsOptions = {
  origin: [
    "http://localhost:5173",      // Local development
    "http://localhost:3000",       // Local backend access
    "https://inventory-gsv9.onrender.com", // Your deployed frontend (if any)
    // Add your frontend domain here when deployed
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", productRouter);

app.use(notFound);
app.use(errorHandler);

