import jwt from "jsonwebtoken";
import user from "../../models/user.model.js";
import { STATUS_MESSAGES, STATUS } from "../../constants.js";
import CustomError from "../../utils/customError.js";
import fieldValidation from "../../utils/fieldValidation.js";
import { StatusCodes } from "http-status-codes";

export const userData = async (req, res) => {
  try {
    if (!req.token) {
      throw new CustomError(
        StatusCodes.FORBIDDEN,
        STATUS_MESSAGES.PROTECTED_ROUTE_ERROR
      );
    }
    // jwt.verify(req.token, process.env.JWT_SECRET, (err, authorizedData) => {
    //   if (err) {
    //     console.error(STATUS_MESSAGES.PROTECTED_ROUTE_ERROR);
    //     throw new CustomError(StatusCodes.FORBIDDEN, STATUS_MESSAGES.PROTECTED_ROUTE_ERROR);
    //   }
    //   console.log(STATUS_MESSAGES.SUCCESSFUL_LOGIN, authorizedData);
    // });
    const token = jwt.verify(req.token, process.env.JWT_SECRET);
    if (!token) {
      throw new CustomError(
        StatusCodes.FORBIDDEN,
        STATUS_MESSAGES.PROTECTED_ROUTE_ERROR
      );
    }
    const loggedInUser = await user.findById(token._id).select("-password");
    if (!loggedInUser) {
      throw new CustomError(
        StatusCodes.FORBIDDEN,
        STATUS_MESSAGES.PROTECTED_ROUTE_ERROR
      );
    }
    // console.log(STATUS_MESSAGES.SUCCESSFUL_LOGIN, req.token, loggedInUser);
    res.send({
      status: STATUS.SUCCESS,
      message: STATUS_MESSAGES.SUCCESSFUL_USER_VALIDATION,
      data: loggedInUser,
    });
  } catch (error) {
    console.error("Error during data retrieval:", error);
    return res
      .status(error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error?.message || STATUS_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const userByEmail = async (req, res) => {
  try {
    if (!req.token) {
      throw new CustomError(
        StatusCodes.FORBIDDEN,
        STATUS_MESSAGES.PROTECTED_ROUTE_ERROR
      );
    }

    const { email } = req.body;

    const isFieldValid = fieldValidation({ email });
    if (!isFieldValid)
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        STATUS_MESSAGES.FIELD_VALIDATION_ERROR
      );

    const isUser = await user.findOne({ email }).select("-password");
    if (!isUser) {
      throw new CustomError(
        StatusCodes.NOT_FOUND,
        STATUS_MESSAGES.USER_NOT_FOUND
      );
    }

    res.send({
      status: STATUS.SUCCESS,
      message: STATUS_MESSAGES.SUCCESSFUL_USER_VALIDATION,
      data: {
        selectedUser: isUser,
      },
    });
  } catch (error) {
    console.log(`Error during getUserByEmail: ${error}`);
    return res
      .status(error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error?.message || STATUS_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};
