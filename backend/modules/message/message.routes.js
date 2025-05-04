import express from "express";
import checkToken from "../../middlewares/checkToken.js";
import { getMessage, sendMessage } from "./message.controller.js";

const router = express.Router();

router.post("/send/:receiverId", checkToken, sendMessage);
router.get("/get/:receiverId", checkToken, getMessage);

export default router;
