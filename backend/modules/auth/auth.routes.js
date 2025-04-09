import express from "express";
import { login, getUserData } from "./auth.controller.js";
import checkToken from "./middlewares/checkToken.js";

const router = express.Router();

router.post("/login", login);
router.get("/user", checkToken, getUserData);

export default router;
