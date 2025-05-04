import { userData, userByEmail } from "./user.service.js";

export const getUserData = (req, res) => {
  userData(req, res);
};
export const getUserByEmail = (req, res) => {
  userByEmail(req, res);
};
