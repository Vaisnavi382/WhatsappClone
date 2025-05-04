import express from "express";
import { login, logout, signup } from "./auth.controller.js";
import checkToken from "../../middlewares/checkToken.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", checkToken, logout);

export default router;
