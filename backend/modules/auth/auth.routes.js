import express from "express";
import {
  login,
  getUserData,
  logout,
  signup,
  getUserByEmail,
} from "./auth.controller.js";
import checkToken from "./middlewares/checkToken.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", checkToken, getUserData);
router.get("/logout", checkToken, logout);
router.get("/user/email", checkToken, getUserByEmail);

export default router;
