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

// const tlsOptions = {
//   key: fs.readFileSync("../secrets/client.key"),
//   cert: fs.readFileSync("../secrets/client.crt"),
//   ca: [fs.readFileSync("../secrets/rootCA.pem")],
//   requestCert: true,
//   rejectUnauthorized: true,
// };
let tlsOptions
try {
  tlsOptions = {
    key: fs.readFileSync(path.resolve(__dirname, "../secrets/client.key")),
    cert: fs.readFileSync(path.resolve(__dirname, "../secrets/client.crt")),
    ca: [fs.readFileSync(path.resolve(__dirname, "../secrets/rootCA.pem"))],
    requestCert: true,
    rejectUnauthorized: true,
  };
} catch (error) {
  console.error("Error reading TLS files:", error);
  process.exit(1);
}
const server = https.createServer(tlsOptions, app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
server.on("error", (err) => {
  console.error("Server error:", err);
});