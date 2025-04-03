import express, { Request, Response, NextFunction } from "express";
import http from "http";
import { Server } from "socket.io";
import morgan from "morgan";
import dotenv from "dotenv";
import session from "express-session";
import defaultRouter from "../routes/";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.MODE == "development" ? "http://localhost:5173" : "/",
    credentials: true,
  },
});
const dbWorker = new PrismaClient();
app.use(express.json());
app.use(
  cors({
    origin: process.env.MODE == "development" ? "http://localhost:5173" : "/",
    credentials: true,
  })
);
interface User {
  id: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
  otp_enabled: boolean;
  otp_verified: boolean;
}

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

app.use(
  session({
    secret: process.env.SECRET || "optional_secret_key_123abc456def789ghi",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 24 * 60 * 60, // 1 month
      secure: process.env.NODE_ENV === "production" ? true : "auto",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// app.use("/",);
app.use("/api", defaultRouter);
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "No matching route found" });
  //   res.sendFile(path.join(FRONTEND_PATH, "index.html"));
});

app.use(morgan("dev"));

io.on("connection", (socket) => {
  console.log(socket.id, " : connected");
});
export { io, server, app, dbWorker };
