import express from "express";
import { 
    getAllProducts, 
    createProduct, 
    getProductById, 
    updateProduct, 
    deleteProduct, 
    decreaseProductStock, 
    getProductCountByBrand, 
    uploadProductImage,
    createBrand,
    getBrands,
    updateBrand,
    deleteBrand
} from '../controllers/productController.js';
import multer from "multer";
import path from "path";
import { protect } from "../controllers/authController.js";

const router = express.Router();
const uploadStructure = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});
// Multer storage
const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, "uploads/"),
        filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ 
    storage, 
    limits: { fileSize: 10 * 1024 * 1024 },
});
router.get("/brands", getBrands);
router.post("/brand", createBrand); 
router.put("/brand/:id", updateBrand);
router.delete("/brand/:id", deleteBrand);

router.get("/", getAllProducts);
router.post("/", upload.fields([{name:"images", maxCount:5}]),protect, createProduct);
router.get('/product-counts-by-brand', getProductCountByBrand);
router.get("/:id", getProductById);
router.put("/:id", upload.fields([{name:"images", maxCount:5}]),protect, updateProduct);
router.delete("/:id", protect, deleteProduct);
router.post("/decrease-stock", decreaseProductStock);

router.patch(
    "/updateImage",
    protect,
    uploadStructure.fields([{ name: "images", maxCount: 5 }]),
    uploadProductImage
);

export default router;