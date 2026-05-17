import { Router } from "express";
import { getDashboardInsightsHandler } from "../controllers/dashboard.controller";
import { protectRoute } from "../middleware/auth.middleware";

export const dashboardRouter = Router();

dashboardRouter.use(protectRoute);
dashboardRouter.get("/insights", getDashboardInsightsHandler);
