import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRouter  from "./routes/authRouter.js";
import userRouter  from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import orderRouter from "./routes/orderRouter.js";
import { protect } from "./controllers/authController.js";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Define __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
dotenv.config();
app.use(cors());
// Get env vars
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/ecommerce';

// Connect MongoDB
mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error(' MongoDB connection error:', err.message);
    process.exit(1);
  });
// app.use(express.json());
// app.use(express.urlencoded({ extended: true })); 
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/api/users',authRouter);
app.use('/api/users',userRouter);
app.use("/api/profile", userRouter);
app.use("/api/products", productRouter); 
app.use("/api/categories",categoryRouter);
app.use("/api/orders", protect, orderRouter);
// app.use('/api/users',authRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});