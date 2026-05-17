import { Router } from "express";
import {
  archiveNoteHandler,
  createNoteHandler,
  deleteNoteHandler,
  disableNoteSharingHandler,
  enableNoteSharingHandler,
  generateNoteAiHandler,
  getNoteHandler,
  listNotes,
  updateNoteHandler,
} from "../controllers/note.controller";
import { protectRoute } from "../middleware/auth.middleware";

export const noteRouter = Router();

noteRouter.use(protectRoute);
noteRouter.get("/", listNotes);
noteRouter.post("/", createNoteHandler);
noteRouter.get("/:id", getNoteHandler);
noteRouter.patch("/:id", updateNoteHandler);
noteRouter.delete("/:id", deleteNoteHandler);
noteRouter.patch("/:id/archive", archiveNoteHandler);
noteRouter.post("/:id/share", enableNoteSharingHandler);
noteRouter.post("/:id/share/disable", disableNoteSharingHandler);
noteRouter.post("/:id/generate-ai", generateNoteAiHandler);
