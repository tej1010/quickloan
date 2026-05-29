import { Router } from "express";
import { applicationsRouter } from "./applications.routes.js";
import { healthRouter } from "./health.routes.js";

export const router = Router();

router.use("/health", healthRouter);
router.use("/applications", applicationsRouter);
