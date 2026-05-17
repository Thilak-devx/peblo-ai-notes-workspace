import { Router } from "express";
import { authRouter } from "./auth.routes";
import { dashboardRouter } from "./dashboard.routes";
import { healthRouter } from "./health.routes";
import { noteRouter } from "./note.routes";
import { sharedRouter } from "./shared.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/health", healthRouter);
apiRouter.use("/notes", noteRouter);
apiRouter.use("/shared", sharedRouter);
