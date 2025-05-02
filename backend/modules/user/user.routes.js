import checkToken from "../../middlewares/checkToken";
import { getUserByEmail, getUserData } from "./user.controller.js";

router.get("/user", checkToken, getUserData);
router.get("/user/email", checkToken, getUserByEmail);
