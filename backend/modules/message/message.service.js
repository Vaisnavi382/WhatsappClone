import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { STATUS, STATUS_MESSAGES } from "../../constants.js";
import Conversation from "../../models/conversation.model.js";
import CustomError from "../../utils/customError.js";
import Message from "../../models/message.model.js";

function getUserDetails(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new CustomError(
      StatusCodes.FORBIDDEN,
      STATUS_MESSAGES.PROTECTED_ROUTE_ERROR,
    );
  }
}

export const sendMessages = async (req, res) => {
  try {
    if (!req.token) {
      throw new CustomError(
        StatusCodes.FORBIDDEN,
        STATUS_MESSAGES.PROTECTED_ROUTE_ERROR,
      );
    }

    const { message } = req.body;
    const { receiverId } = req.params;
    const senderId = getUserDetails(req.token)._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    const newMessage = await Message.create({
      senderid: senderId,
      receiverid: receiverId,
      content: message,
    });

    conversation.messages.push(newMessage._id);
    await conversation.save();

    res.send({
      status: STATUS.SUCCESS,
      message: STATUS_MESSAGES.SUCCESSFUL_MESSAGE_SEND,
      data: newMessage,
    });
  } catch (error) {
    console.error(`Error during sending message: ${error}`);
    return res
      .status(error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error?.message || STATUS_MESSAGES.MESSAGE_SEND_ERROR);
  }
};

export const getMessages = async (req, res) => {
  try {
    if (!req.token) {
      throw new CustomError(
        StatusCodes.FORBIDDEN,
        STATUS_MESSAGES.PROTECTED_ROUTE_ERROR,
      );
    }

    const { receiverId } = req.params;
    const senderId = getUserDetails(req.token)._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) {
      res.send({
        status: STATUS.SUCCESS,
        message: STATUS_MESSAGES.NO_MESSAGES_FOUND,
        data: [],
      });
    }

    const messages = conversation.messages;

    res.send({
      status: STATUS.SUCCESS,
      message: STATUS_MESSAGES.SUCCESSFUL_MESSAGE_GET,
      data: messages,
    });
  } catch (error) {
    console.error(`Error during getting message: ${error}`);
    return res
      .status(error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error?.message || STATUS_MESSAGES.MESSAGE_GET_ERROR);
  }
};
