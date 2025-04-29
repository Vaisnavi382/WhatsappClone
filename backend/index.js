import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";
import connectToDb from "./db.js";
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: "./.env" });
const app = express();

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

await connectToDb();

app.use("/auth", authRoutes);

app.get('/health', (req, res) => {
  res.send(true);
});

const options = {
  key: fs.readFileSync(path.join(__dirname, '../secrets/server.key')),
  cert: fs.readFileSync(path.join(__dirname, '../secrets/server.pem')),
  ca: fs.readFileSync(path.join(__dirname, '../secrets/CA.pem')),
};

https.createServer(options, app).listen(8000, () => {
  console.log('Server running on https://localhost:8000');
});