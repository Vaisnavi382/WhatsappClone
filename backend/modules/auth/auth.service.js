import jwt from 'jsonwebtoken';
import { user } from '../../models/user.model.js';
import { STATUS_MESSAGES, STATUS } from './constants.js';
import CustomError, { cookieOptions } from '../../utils/customError.js';

export const loginUser = (req, res) => {
    const { username, password } = req.body;
    try {
        if (username === user.userName && password === user.password) {
            jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
                if (err) {
                    console.error(err);
                    throw new CustomError(400, STATUS_MESSAGES.TOKEN_GENERATION_ERROR);
                }
                res.cookie("token", token, cookieOptions).send({ status: STATUS.SUCCESS, message: token });
            });
        } else {
            throw new CustomError(401, STATUS_MESSAGES.INVALID_CREDENTIALS);
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(error?.statusCode || 500).json(error?.message || STATUS_MESSAGES.INTERNAL_SERVER_ERROR);

    }
};

export const userData = (req, res) => {

    try {

        if (!req.token) {
            throw new CustomError(403, STATUS_MESSAGES.PROTECTED_ROUTE_ERROR);
        }
        let user = '';
        jwt.verify(req.token, process.env.JWT_SECRET, (err, authorizedData) => {
            if (err) {
                console.error(STATUS_MESSAGES.PROTECTED_ROUTE_ERROR);
                throw new CustomError(403, STATUS_MESSAGES.PROTECTED_ROUTE_ERROR);
            }
            console.log(STATUS_MESSAGES.SUCCESSFUL_LOGIN, authorizedData);
            req.user = authorizedData;
            user = authorizedData;
        });
        console.log(STATUS_MESSAGES.SUCCESSFUL_LOGIN, req.token);
        res.send({
            status: STATUS.SUCCESS,
            message: STATUS_MESSAGES.SUCCESSFUL_LOGIN,
            data: user,
        });
    } catch (error) {
        console.error('Error during data retrieval:', error);
        return res.status(error?.statusCode || 500).send(error?.message || STATUS_MESSAGES.INTERNAL_SERVER_ERROR);

    }
};