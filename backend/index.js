import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import messageRoutes from "./modules/message/message.routes.js";
import connectToDb from "./db.js";
import { app, server } from "./socket/socket.main.js";

dotenv.config({ path: "./.env" });
// const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

await connectToDb();

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/message", messageRoutes);

app.get("/", (_req, res) => {
  res.send(`Server is ready. Testing Nodemon`);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
