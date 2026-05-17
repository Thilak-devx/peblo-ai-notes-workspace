import crypto from "node:crypto";
import { FilterQuery, Types } from "mongoose";
import { Note } from "../models/Note";
import { ApiError } from "../utils/api-error";
import { generateNoteAnalysis } from "./gemini.service";

type NotePayload = {
  title?: unknown;
  content?: unknown;
  tags?: unknown;
  category?: unknown;
};

type GetNotesOptions = {
  userId: string;
  search?: string;
  tags?: string[];
  archived?: string;
};

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeTags(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .map((tag) => normalizeString(tag).toLowerCase())
        .filter(Boolean),
    ),
  );
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function validateNotePayload(payload: NotePayload, mode: "create" | "update") {
  const title = normalizeString(payload.title);
  const content = typeof payload.content === "string" ? payload.content : "";
  const category = normalizeString(payload.category) || "General";
  const tags = normalizeTags(payload.tags);

  if (mode === "create" && !title) {
    throw new ApiError(400, "Title is required");
  }

  if (title && title.length > 180) {
    throw new ApiError(400, "Title must be 180 characters or fewer");
  }

  if (category.length > 80) {
    throw new ApiError(400, "Category must be 80 characters or fewer");
  }

  return {
    ...(
      mode === "update"
        ? typeof payload.title === "string"
          ? { title: title || "Untitled note" }
          : {}
        : title
          ? { title }
          : { title: "Untitled note" }
    ),
    content,
    tags,
    category,
  };
}

function ensureValidNoteId(noteId: string) {
  if (!Types.ObjectId.isValid(noteId)) {
    throw new ApiError(400, "Invalid note id");
  }
}

function buildSearchQuery({
  userId,
  search,
  tags,
  archived,
}: GetNotesOptions): FilterQuery<typeof Note> {
  const query: FilterQuery<typeof Note> = {
    userId,
  };

  if (archived === "true") {
    query.archived = true;
  } else if (archived === "false") {
    query.archived = false;
  }

  const normalizedSearch = normalizeString(search);
  if (normalizedSearch) {
    const escapedSearch = escapeRegex(normalizedSearch);

    query.$or = [
      { title: { $regex: escapedSearch, $options: "i" } },
      { content: { $regex: escapedSearch, $options: "i" } },
      { category: { $regex: escapedSearch, $options: "i" } },
      { tags: { $elemMatch: { $regex: escapedSearch, $options: "i" } } },
    ];
  }

  if (tags?.length) {
    query.tags = {
      $all: tags.map((tag) => new RegExp(`^${escapeRegex(tag)}$`, "i")),
    };
  }

  return query;
}

export function sanitizeNote(note: {
  _id: unknown;
  userId: unknown;
  title: string;
  content: string;
  tags: string[];
  category: string;
  archived: boolean;
  isPublic: boolean;
  shareId?: string | null;
  aiSummary: string;
  aiActionItems: string[];
  aiSuggestedTitle: string;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: String(note._id),
    userId: String(note.userId),
    title: note.title,
    content: note.content,
    tags: note.tags,
    category: note.category,
    archived: note.archived,
    isPublic: note.isPublic,
    shareId: note.shareId || null,
    aiSummary: note.aiSummary,
    aiActionItems: note.aiActionItems,
    aiSuggestedTitle: note.aiSuggestedTitle,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
}

export function sanitizeSharedNote(note: {
  _id: unknown;
  title: string;
  content: string;
  tags: string[];
  updatedAt?: Date;
  category: string;
}) {
  return {
    id: String(note._id),
    title: note.title,
    content: note.content,
    tags: note.tags,
    category: note.category,
    updatedAt: note.updatedAt,
  };
}

export async function getNotes(options: GetNotesOptions) {
  const normalizedTags = options.tags
    ?.map((tag) => normalizeString(tag).toLowerCase())
    .filter(Boolean);

  const notes = await Note.find(
    buildSearchQuery({
      ...options,
      tags: normalizedTags,
    }),
  )
    .sort({ updatedAt: -1 });

  return notes.map(sanitizeNote);
}

export async function getNoteById(userId: string, noteId: string) {
  ensureValidNoteId(noteId);

  const note = await Note.findOne({ _id: noteId, userId });

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  return sanitizeNote(note);
}

export async function createNote(userId: string, payload: NotePayload) {
  const noteData = validateNotePayload(payload, "create");

  const note = await Note.create({
    userId,
    ...noteData,
  });

  return sanitizeNote(note);
}

export async function updateNote(userId: string, noteId: string, payload: NotePayload) {
  ensureValidNoteId(noteId);

  const note = await Note.findOne({ _id: noteId, userId });

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  const noteData = validateNotePayload(payload, "update");

  if (typeof payload.title === "string") {
    note.title = noteData.title || note.title;
  }

  if (typeof payload.content === "string") {
    note.content = noteData.content;
  }

  if (Array.isArray(payload.tags)) {
    note.tags = noteData.tags;
  }

  if (typeof payload.category === "string") {
    note.category = noteData.category;
  }

  await note.save();

  return sanitizeNote(note);
}

export async function archiveNote(userId: string, noteId: string, archived: boolean) {
  ensureValidNoteId(noteId);

  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId },
    { archived },
    { new: true },
  );

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  return sanitizeNote(note);
}

export async function deleteNote(userId: string, noteId: string) {
  ensureValidNoteId(noteId);

  const note = await Note.findOneAndDelete({ _id: noteId, userId });

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  return sanitizeNote(note);
}

export async function generateNoteAiInsights(userId: string, noteId: string) {
  ensureValidNoteId(noteId);

  const note = await Note.findOne({ _id: noteId, userId });

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  const normalizedTitle = normalizeString(note.title);
  const normalizedContent = normalizeString(note.content);

  if (!normalizedTitle && !normalizedContent) {
    throw new ApiError(400, "Add a title or some content before generating AI insights");
  }

  const aiResult = await generateNoteAnalysis({
    title: note.title,
    content: note.content,
    category: note.category,
    tags: note.tags,
  });

  note.aiSummary = aiResult.summary;
  note.aiActionItems = aiResult.actionItems;
  note.aiSuggestedTitle = aiResult.suggestedTitle;

  await note.save();

  return sanitizeNote(note);
}

async function createUniqueShareId() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = crypto.randomBytes(18).toString("hex");
    const existing = await Note.exists({ shareId: candidate });

    if (!existing) {
      return candidate;
    }
  }

  throw new ApiError(500, "Unable to generate a unique share link");
}

export async function enableNoteSharing(userId: string, noteId: string) {
  ensureValidNoteId(noteId);

  const note = await Note.findOne({ _id: noteId, userId });

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  note.isPublic = true;

  if (!note.shareId) {
    note.shareId = await createUniqueShareId();
  }

  await note.save();

  return sanitizeNote(note);
}

export async function disableNoteSharing(userId: string, noteId: string) {
  ensureValidNoteId(noteId);

  const note = await Note.findOne({ _id: noteId, userId });

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  note.isPublic = false;
  note.shareId = null;
  await note.save();

  return sanitizeNote(note);
}

export async function getSharedNote(shareId: string) {
  const normalizedShareId = normalizeString(shareId);

  if (!normalizedShareId || !/^[a-f0-9]{36}$/i.test(normalizedShareId)) {
    throw new ApiError(400, "Invalid share link");
  }

  const note = await Note.findOne({
    shareId: normalizedShareId,
    isPublic: true,
  });

  if (!note) {
    throw new ApiError(404, "Shared note not found");
  }

  return sanitizeSharedNote(note);
}
