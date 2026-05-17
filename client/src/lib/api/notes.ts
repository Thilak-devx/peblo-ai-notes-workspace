import { api } from "@/lib/api/axios";
import {
  parseNoteListResponse,
  parseNoteResponse,
  parseSharedNoteResponse,
} from "@/lib/api/contracts";
import { toApiClientError } from "@/lib/api/errors";

type NoteFilters = {
  search?: string;
  tags?: string[];
  archived?: "true" | "false";
};

type NotePayload = {
  title?: string;
  content?: string;
  tags?: string[];
  category?: string;
  isPublic?: boolean;
};

export async function fetchNotes(filters: NoteFilters) {
  try {
    const response = await api.get("/notes", {
      params: {
        search: filters.search || undefined,
        tags: filters.tags?.length ? filters.tags.join(",") : undefined,
        archived: filters.archived,
      },
    });

    return parseNoteListResponse(response.data).notes;
  } catch (error) {
    throw toApiClientError(error, "Unable to load notes");
  }
}

export async function createNote(payload: NotePayload) {
  try {
    const response = await api.post("/notes", payload);
    return parseNoteResponse(response.data).note;
  } catch (error) {
    throw toApiClientError(error, "Unable to create note");
  }
}

export async function updateNote(noteId: string, payload: NotePayload) {
  try {
    const response = await api.patch(`/notes/${noteId}`, payload);
    return parseNoteResponse(response.data).note;
  } catch (error) {
    throw toApiClientError(error, "Unable to update note");
  }
}

export async function archiveNote(noteId: string, archived: boolean) {
  try {
    const response = await api.patch(`/notes/${noteId}/archive`, {
      archived,
    });
    return parseNoteResponse(response.data).note;
  } catch (error) {
    throw toApiClientError(error, "Unable to update archive status");
  }
}

export async function deleteNote(noteId: string) {
  try {
    await api.delete(`/notes/${noteId}`);
  } catch (error) {
    throw toApiClientError(error, "Unable to delete note");
  }
}

export async function generateNoteAiInsights(noteId: string) {
  try {
    const response = await api.post(`/notes/${noteId}/generate-ai`);
    return parseNoteResponse(response.data).note;
  } catch (error) {
    throw toApiClientError(error, "Unable to generate AI insights");
  }
}

export async function enableNoteSharing(noteId: string) {
  try {
    const response = await api.post(`/notes/${noteId}/share`);
    return parseNoteResponse(response.data).note;
  } catch (error) {
    throw toApiClientError(error, "Unable to enable note sharing");
  }
}

export async function disableNoteSharing(noteId: string) {
  try {
    const response = await api.post(`/notes/${noteId}/share/disable`);
    return parseNoteResponse(response.data).note;
  } catch (error) {
    throw toApiClientError(error, "Unable to disable note sharing");
  }
}

export async function fetchSharedNote(shareId: string) {
  try {
    const response = await api.get(`/shared/${shareId}`);
    return parseSharedNoteResponse(response.data).note;
  } catch (error) {
    throw toApiClientError(error, "Unable to load shared note");
  }
}
