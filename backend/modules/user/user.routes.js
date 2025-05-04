import express from "express";
import checkToken from "../../middlewares/checkToken.js";
import { getUserByEmail, getUserData } from "./user.controller.js";

const router = express.Router();

router.get("/", checkToken, getUserData);
router.get("/email", checkToken, getUserByEmail);

export default router;
