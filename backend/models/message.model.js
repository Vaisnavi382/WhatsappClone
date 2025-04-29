import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    senderid: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverid: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }
    ],
    content: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "video", "audio", "file"],
      default: "text",
    },
    messageStatus: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },
  },
  { timestamps: true }
);

const Message = model("Message", messageSchema);

export default Message;
