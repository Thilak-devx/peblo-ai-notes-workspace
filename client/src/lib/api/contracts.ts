import type {
  AuthResponse,
  AuthUser,
  AuthStatusResponse,
} from "@/types/auth";
import type {
  DashboardInsights,
  DashboardInsightsResponse,
} from "@/types/dashboard";
import type {
  Note,
  NoteListResponse,
  NoteResponse,
  SharedNote,
  SharedNoteResponse,
} from "@/types/note";
import { ApiClientError } from "@/lib/api/errors";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function expectString(value: unknown, label: string) {
  if (typeof value !== "string") {
    throw new ApiClientError(`Invalid API response: ${label} must be a string`);
  }

  return value;
}

function expectOptionalString(value: unknown, label: string) {
  if (value === undefined || value === null) {
    return undefined;
  }

  return expectString(value, label);
}

function expectBoolean(value: unknown, label: string) {
  if (typeof value !== "boolean") {
    throw new ApiClientError(`Invalid API response: ${label} must be a boolean`);
  }

  return value;
}

function expectNumber(value: unknown, label: string) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new ApiClientError(`Invalid API response: ${label} must be a number`);
  }

  return value;
}

function expectStringArray(value: unknown, label: string) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new ApiClientError(`Invalid API response: ${label} must be a string array`);
  }

  return value;
}

function expectStatus(value: unknown) {
  if (value !== "success" && value !== "ok") {
    throw new ApiClientError("Invalid API response: status is missing or unsupported");
  }

  return value;
}

function parseAuthUser(value: unknown): AuthUser {
  if (!isRecord(value)) {
    throw new ApiClientError("Invalid API response: user payload is missing");
  }

  return {
    id: expectString(value.id, "user.id"),
    name: expectString(value.name, "user.name"),
    email: expectString(value.email, "user.email"),
    createdAt: expectOptionalString(value.createdAt, "user.createdAt"),
    updatedAt: expectOptionalString(value.updatedAt, "user.updatedAt"),
  };
}

function parseNote(value: unknown): Note {
  if (!isRecord(value)) {
    throw new ApiClientError("Invalid API response: note payload is missing");
  }

  return {
    id: expectString(value.id, "note.id"),
    userId: expectString(value.userId, "note.userId"),
    title: expectString(value.title, "note.title"),
    content: expectString(value.content, "note.content"),
    tags: expectStringArray(value.tags, "note.tags"),
    category: expectString(value.category, "note.category"),
    archived: expectBoolean(value.archived, "note.archived"),
    isPublic: expectBoolean(value.isPublic, "note.isPublic"),
    shareId:
      value.shareId === null || value.shareId === undefined
        ? null
        : expectString(value.shareId, "note.shareId"),
    aiSummary: expectString(value.aiSummary, "note.aiSummary"),
    aiActionItems: expectStringArray(value.aiActionItems, "note.aiActionItems"),
    aiSuggestedTitle: expectString(value.aiSuggestedTitle, "note.aiSuggestedTitle"),
    createdAt: expectOptionalString(value.createdAt, "note.createdAt"),
    updatedAt: expectOptionalString(value.updatedAt, "note.updatedAt"),
  };
}

function parseSharedNote(value: unknown): SharedNote {
  if (!isRecord(value)) {
    throw new ApiClientError("Invalid API response: shared note payload is missing");
  }

  return {
    id: expectString(value.id, "note.id"),
    title: expectString(value.title, "note.title"),
    content: expectString(value.content, "note.content"),
    tags: expectStringArray(value.tags, "note.tags"),
    category: expectString(value.category, "note.category"),
    updatedAt: expectOptionalString(value.updatedAt, "note.updatedAt"),
  };
}

function parseDashboardInsights(value: unknown): DashboardInsights {
  if (!isRecord(value)) {
    throw new ApiClientError("Invalid API response: insights payload is missing");
  }

  const recentlyEditedNotes = value.recentlyEditedNotes;
  const mostUsedTags = value.mostUsedTags;
  const weeklyActivity = value.weeklyActivity;

  if (!Array.isArray(recentlyEditedNotes) || !Array.isArray(mostUsedTags) || !Array.isArray(weeklyActivity)) {
    throw new ApiClientError("Invalid API response: dashboard collections are malformed");
  }

  return {
    totalNotes: expectNumber(value.totalNotes, "insights.totalNotes"),
    archivedNotes: expectNumber(value.archivedNotes, "insights.archivedNotes"),
    activeNotes: expectNumber(value.activeNotes, "insights.activeNotes"),
    aiSummariesGenerated: expectNumber(
      value.aiSummariesGenerated,
      "insights.aiSummariesGenerated",
    ),
    recentlyEditedNotes: recentlyEditedNotes.map((note, index) => {
      if (!isRecord(note)) {
        throw new ApiClientError(`Invalid API response: insights.recentlyEditedNotes[${index}]`);
      }

      return {
        id: expectString(note.id, `insights.recentlyEditedNotes[${index}].id`),
        title: expectString(note.title, `insights.recentlyEditedNotes[${index}].title`),
        category: expectString(
          note.category,
          `insights.recentlyEditedNotes[${index}].category`,
        ),
        archived: expectBoolean(
          note.archived,
          `insights.recentlyEditedNotes[${index}].archived`,
        ),
        updatedAt: expectOptionalString(
          note.updatedAt,
          `insights.recentlyEditedNotes[${index}].updatedAt`,
        ),
      };
    }),
    mostUsedTags: mostUsedTags.map((tag, index) => {
      if (!isRecord(tag)) {
        throw new ApiClientError(`Invalid API response: insights.mostUsedTags[${index}]`);
      }

      return {
        tag: expectString(tag.tag, `insights.mostUsedTags[${index}].tag`),
        count: expectNumber(tag.count, `insights.mostUsedTags[${index}].count`),
      };
    }),
    weeklyActivity: weeklyActivity.map((day, index) => {
      if (!isRecord(day)) {
        throw new ApiClientError(`Invalid API response: insights.weeklyActivity[${index}]`);
      }

      return {
        label: expectString(day.label, `insights.weeklyActivity[${index}].label`),
        date: expectString(day.date, `insights.weeklyActivity[${index}].date`),
        count: expectNumber(day.count, `insights.weeklyActivity[${index}].count`),
      };
    }),
  };
}

export function parseAuthResponse(payload: unknown): AuthResponse {
  if (!isRecord(payload)) {
    throw new ApiClientError("Invalid API response: auth payload is missing");
  }

  return {
    status: expectStatus(payload.status) as AuthResponse["status"],
    message:
      payload.message === undefined ? undefined : expectString(payload.message, "message"),
    user: parseAuthUser(payload.user),
    token:
      payload.token === undefined || payload.token === null
        ? undefined
        : expectString(payload.token, "token"),
  };
}

export function parseAuthStatusResponse(payload: unknown): AuthStatusResponse {
  if (!isRecord(payload)) {
    throw new ApiClientError("Invalid API response: status payload is missing");
  }

  return {
    status: expectStatus(payload.status) as AuthStatusResponse["status"],
    message:
      payload.message === undefined ? undefined : expectString(payload.message, "message"),
  };
}

export function parseNoteListResponse(payload: unknown): NoteListResponse {
  if (!isRecord(payload) || !Array.isArray(payload.notes)) {
    throw new ApiClientError("Invalid API response: notes payload is missing");
  }

  return {
    status: expectStatus(payload.status) as NoteListResponse["status"],
    notes: payload.notes.map(parseNote),
  };
}

export function parseNoteResponse(payload: unknown): NoteResponse {
  if (!isRecord(payload)) {
    throw new ApiClientError("Invalid API response: note response is missing");
  }

  return {
    status: expectStatus(payload.status) as NoteResponse["status"],
    note: parseNote(payload.note),
  };
}

export function parseSharedNoteResponse(payload: unknown): SharedNoteResponse {
  if (!isRecord(payload)) {
    throw new ApiClientError("Invalid API response: shared note response is missing");
  }

  return {
    status: expectStatus(payload.status) as SharedNoteResponse["status"],
    note: parseSharedNote(payload.note),
  };
}

export function parseDashboardInsightsResponse(payload: unknown): DashboardInsightsResponse {
  if (!isRecord(payload)) {
    throw new ApiClientError("Invalid API response: dashboard response is missing");
  }

  return {
    status: expectStatus(payload.status) as DashboardInsightsResponse["status"],
    insights: parseDashboardInsights(payload.insights),
  };
}
