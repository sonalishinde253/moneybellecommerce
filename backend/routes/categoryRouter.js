import express from "express";
import {
    getAllCategories,
    addCategory,
    getCategoryById
}from "../controllers/categoryController.js";
import { protect } from "../controllers/authController.js";
const router = express.Router();
router.get("/", getAllCategories);
router.post("/", protect, addCategory);
router.get("/:id", getCategoryById);

export default router;