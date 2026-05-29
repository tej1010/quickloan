import cors from "cors";
import express from "express";
import { router } from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(",") || [
        "http://localhost:5173",
        "http://localhost:4173",
      ],
    }),
  );
  app.use(express.json());

  app.use("/api", router);

  return app;
}
