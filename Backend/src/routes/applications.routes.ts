import { Router } from "express";
import {
  getApplicationSession,
  upsertApplicationSession,
} from "../stores/applicationSessions.js";

export const applicationsRouter = Router();

applicationsRouter.get("/sessions/:sessionId", (req, res) => {
  const session = getApplicationSession(req.params.sessionId);
  if (!session) {
    res.status(404).json({ success: false, message: "Application session not found" });
    return;
  }
  res.json({ success: true, data: session });
});

applicationsRouter.post("/sessions", (req, res) => {
  const { sessionId, customerMobile } = req.body ?? {};
  if (!sessionId || !customerMobile) {
    res.status(400).json({ success: false, message: "sessionId and customerMobile are required" });
    return;
  }
  const session = upsertApplicationSession(req.body);
  res.status(201).json({ success: true, data: session });
});

applicationsRouter.put("/sessions/:sessionId", (req, res) => {
  const existing = getApplicationSession(req.params.sessionId);
  if (!existing) {
    res.status(404).json({ success: false, message: "Application session not found" });
    return;
  }
  const session = upsertApplicationSession({
    ...existing,
    ...req.body,
    sessionId: req.params.sessionId,
    customerMobile: req.body.customerMobile ?? existing.customerMobile,
  });
  res.json({ success: true, data: session });
});
