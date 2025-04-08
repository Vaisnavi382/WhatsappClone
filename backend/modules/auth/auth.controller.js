import { loginUser, userData } from './auth.service.js';

export const login = (req, res) => {
    loginUser(req, res);
};

export const getUserData = [
    (req, res) => userData(req, res)
];