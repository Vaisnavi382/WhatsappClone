// export const user = {
//   userName: "JohnSmith",
//   password: "password123",
//   firstName: "John",
//   lastName: "Smith",
//   email: "john.doe@gmail.com",
// };

import { model, Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    fullname: {
      firstname: {
        type: String,
        required: true,
        minlength: [2, "First name must be at least 2 characters"],
        index: true,
        trim: true,
      },
      lastname: {
        type: String,
        trim: true,
      },
    },
    phonenumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      match: /^[0-9]{10}$/, // Regex for 10-digit phone number
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for email validation
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters"],
    },
    profilepic: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    about: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  const payload = {
    _id: this._id,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};

userSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcryptjs.hash(password, 10);
};

const User = model("User", userSchema);
export default User;
