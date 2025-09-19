import express from "express";
import { signup,login,forgotPassword,resetPassword, protect, updatePassword }  from "../controllers/authController.js";
const router = express.Router();
router.post('/signup',signup);
router.post('/login',login);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updatePassword", protect, updatePassword);
export default router;