import { loginUser, logoutUser, signupUser } from "./auth.service.js";

export const signup = (req, res) => {
  signupUser(req, res);
};

export const login = (req, res) => {
  loginUser(req, res);
};

export const logout = (req, res) => {
  logoutUser(req, res);
};
