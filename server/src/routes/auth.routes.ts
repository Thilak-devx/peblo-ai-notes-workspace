import { Router } from "express";
import {
  getCurrentUser,
  login,
  logout,
  signup,
} from "../controllers/auth.controller";
import { protectRoute } from "../middleware/auth.middleware";

export const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", protectRoute, getCurrentUser);
