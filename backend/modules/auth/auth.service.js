import jwt from "jsonwebtoken";
import user from "../../models/user.model.js";
import { STATUS_MESSAGES, STATUS } from "./constants.js";
import CustomError, { cookieOptions } from "../../utils/customError.js";
import fieldValidation from "../../utils/fieldValidation.js";
import { StatusCodes } from "http-status-codes";

export const signupUser = async (req, res) => {
  try {
    const { fullname, phonenumber, email, password, profilepic, about } =
      req.body;
    const { firstname, lastname } = fullname;

    const isFieldValid = fieldValidation({
      firstname,
      phonenumber,
      email,
      password,
    });
    if (!isFieldValid)
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        STATUS_MESSAGES.FIELD_VALIDATION_ERROR,
      );

    const isUser = await user.findOne({
      $or: [{ email: email }, { phonenumber: phonenumber }],
    });
    if (isUser)
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        STATUS_MESSAGES.USER_ALREADY_EXISTS,
      );

    const hashedPassword = await user.hashPassword(password);

    const newUser = await user.create({
      fullname: {
        firstname,
        lastname,
      },
      phonenumber,
      email,
      password: hashedPassword,
    });
    if (profilepic) {
      newUser.profilepic = profilepic;
    }
    if (about) {
      newUser.about = about;
    }
    await newUser.save();

    const token = newUser.generateAuthToken();

    const signedInUser = await user.findById(newUser._id).select("-password");

    res.cookie("token", token, cookieOptions).send({
      status: STATUS.SUCCESS,
      data: {
        user: signedInUser,
        token: token,
      },
      message: "User created successfully",
    });
  } catch (error) {
    console.error(`Error during signup: ${error}`);
    return res
      .status(error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error?.message || STATUS_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isFieldValid = fieldValidation({ email, password });
    if (!isFieldValid)
      throw new CustomError(
        StatusCodes.UNAUTHORIZED,
        STATUS_MESSAGES.FIELD_VALIDATION_ERROR,
      );

    const isUser = await user.findOne({ email });
    if (!isUser)
      throw new CustomError(
        StatusCodes.UNAUTHORIZED,
        STATUS_MESSAGES.INVALID_CREDENTIALS,
      );

    const isPasswordValid = await isUser.comparePassword(password);
    if (!isPasswordValid)
      throw new CustomError(
        StatusCodes.UNAUTHORIZED,
        STATUS_MESSAGES.INVALID_CREDENTIALS,
      );

    const loggedInUser = await user.findById(isUser._id).select("-password");
    const token = loggedInUser.generateAuthToken();

    res.cookie("token", token, cookieOptions).send({
      status: STATUS.SUCCESS,
      message: STATUS_MESSAGES.SUCCESSFUL_LOGIN,
      data: {
        user: loggedInUser,
        token: token,
      },
    });
  } catch (error) {
    console.error(`Error during login: ${error}`);
    return res
      .status(error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error?.message || STATUS_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const userData = async (req, res) => {
  try {
    if (!req.token) {
      throw new CustomError(
        StatusCodes.FORBIDDEN,
        STATUS_MESSAGES.PROTECTED_ROUTE_ERROR,
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
        STATUS_MESSAGES.PROTECTED_ROUTE_ERROR,
      );
    }
    const loggedInUser = await user.findById(token._id).select("-password");
    if (!loggedInUser) {
      throw new CustomError(
        StatusCodes.FORBIDDEN,
        STATUS_MESSAGES.PROTECTED_ROUTE_ERROR,
      );
    }
    // console.log(STATUS_MESSAGES.SUCCESSFUL_LOGIN, req.token, loggedInUser);
    res.send({
      status: STATUS.SUCCESS,
      message: STATUS_MESSAGES.SUCCESSFUL_LOGIN,
      data: loggedInUser,
    });
  } catch (error) {
    console.error("Error during data retrieval:", error);
    return res
      .status(error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error?.message || STATUS_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const logoutUser = (req, res) => {
  try {
    if (!req.token)
      throw new CustomError(
        StatusCodes.FORBIDDEN,
        STATUS_MESSAGES.PROTECTED_ROUTE_ERROR,
      );
    res
      .clearCookie("token", cookieOptions)
      .send({ status: STATUS.SUCCESS, message: "Logged out successfully" });
  } catch (error) {
    console.error(`Error during logout: ${error}`);
    return res
      .status(error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error?.message || STATUS_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const userByEmail = async (req, res) => {
  try {
    if (!token) {
      throw new CustomError(
        StatusCodes.FORBIDDEN,
        STATUS_MESSAGES.PROTECTED_ROUTE_ERROR,
      );
    }

    const { email } = req.body;

    const isFieldValid = fieldValidation({ email });
    if (!isFieldValid)
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        STATUS_MESSAGES.FIELD_VALIDATION_ERROR,
      );

    const isUser = await user.findOne({ email }).select("-password");
    if (!isUser) {
      throw new CustomError(
        StatusCodes.NOT_FOUND,
        STATUS_MESSAGES.USER_NOT_FOUND,
      );
    }

    res.send({
      status: STATUS.SUCCESS,
      message: STATUS_MESSAGES.USER_FOUND,
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
