
import express from "express";
import cors from "cors";
import productRouter from "./routes/product.route.js";
import { notFound } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

export const app = express();

// CORS configuration - Allow requests from frontend
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",           // Local frontend
      "http://localhost:3000",           // Local testing
      "http://127.0.0.1:5173",          // Alternative localhost
      "https://inventory-gsv9.onrender.com", // Your deployed service
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // For development, you can temporarily allow all origins
      if (process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle preflight requests
app.options("*", cors(corsOptions));

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

app.use("/api", productRouter);

app.use(notFound);
app.use(errorHandler);

