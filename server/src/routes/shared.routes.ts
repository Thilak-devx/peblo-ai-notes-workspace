import { Router } from "express";
import { getSharedNoteHandler } from "../controllers/note.controller";

export const sharedRouter = Router();

sharedRouter.get("/:shareId", getSharedNoteHandler);
