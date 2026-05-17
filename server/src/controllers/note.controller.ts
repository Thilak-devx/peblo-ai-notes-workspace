import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import {
  archiveNote,
  createNote,
  deleteNote,
  disableNoteSharing,
  enableNoteSharing,
  generateNoteAiInsights,
  getSharedNote,
  getNoteById,
  getNotes,
  updateNote,
} from "../services/note.service";
import { ApiError } from "../utils/api-error";

function getRouteParam(value: string | string[] | undefined, name: string) {
  if (typeof value === "string") {
    return value;
  }

  throw new ApiError(400, `Invalid route parameter: ${name}`);
}

function requireUserId(request: Request) {
  const userId = request.user?._id;

  if (!userId) {
    throw new ApiError(401, "Authentication required");
  }

  return String(userId);
}

export const listNotes = asyncHandler(async (request: Request, response: Response) => {
  const userId = requireUserId(request);
  const tags =
    typeof request.query.tags === "string"
      ? request.query.tags.split(",")
      : undefined;

  const notes = await getNotes({
    userId,
    search: typeof request.query.search === "string" ? request.query.search : undefined,
    tags,
    archived:
      typeof request.query.archived === "string" ? request.query.archived : undefined,
  });

  response.status(200).json({
    status: "success",
    notes,
  });
});

export const createNoteHandler = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = requireUserId(request);
    const note = await createNote(userId, request.body);

    response.status(201).json({
      status: "success",
      note,
    });
  },
);

export const getNoteHandler = asyncHandler(async (request: Request, response: Response) => {
  const userId = requireUserId(request);
  const noteId = getRouteParam(request.params.id, "id");
  const note = await getNoteById(userId, noteId);

  response.status(200).json({
    status: "success",
    note,
  });
});

export const updateNoteHandler = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = requireUserId(request);
    const noteId = getRouteParam(request.params.id, "id");
    const note = await updateNote(userId, noteId, request.body);

    response.status(200).json({
      status: "success",
      note,
    });
  },
);

export const deleteNoteHandler = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = requireUserId(request);
    const noteId = getRouteParam(request.params.id, "id");
    await deleteNote(userId, noteId);

    response.status(200).json({
      status: "success",
      message: "Note deleted successfully",
    });
  },
);

export const archiveNoteHandler = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = requireUserId(request);
    const archived = typeof request.body.archived === "boolean" ? request.body.archived : true;
    const noteId = getRouteParam(request.params.id, "id");
    const note = await archiveNote(userId, noteId, archived);

    response.status(200).json({
      status: "success",
      note,
    });
  },
);

export const generateNoteAiHandler = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = requireUserId(request);
    const noteId = getRouteParam(request.params.id, "id");
    const note = await generateNoteAiInsights(userId, noteId);

    response.status(200).json({
      status: "success",
      note,
    });
  },
);

export const enableNoteSharingHandler = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = requireUserId(request);
    const noteId = getRouteParam(request.params.id, "id");
    const note = await enableNoteSharing(userId, noteId);

    response.status(200).json({
      status: "success",
      note,
    });
  },
);

export const disableNoteSharingHandler = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = requireUserId(request);
    const noteId = getRouteParam(request.params.id, "id");
    const note = await disableNoteSharing(userId, noteId);

    response.status(200).json({
      status: "success",
      note,
    });
  },
);

export const getSharedNoteHandler = asyncHandler(
  async (request: Request, response: Response) => {
    const shareId = getRouteParam(request.params.shareId, "shareId");
    const note = await getSharedNote(shareId);

    response.status(200).json({
      status: "success",
      note,
    });
  },
);
