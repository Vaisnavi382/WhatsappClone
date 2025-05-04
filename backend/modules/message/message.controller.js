import { getMessages, sendMessages } from "./message.service.js";

export const sendMessage = (req, res) => {
  sendMessages(req, res);
};

export const getMessage = (req, res) => {
  getMessages(req, res);
};
