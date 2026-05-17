export type Note = {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  archived: boolean;
  isPublic: boolean;
  shareId: string | null;
  aiSummary: string;
  aiActionItems: string[];
  aiSuggestedTitle: string;
  createdAt?: string;
  updatedAt?: string;
};

export type NoteListResponse = {
  status: "success";
  notes: Note[];
};

export type NoteResponse = {
  status: "success";
  note: Note;
};

export type SharedNote = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  updatedAt?: string;
};

export type SharedNoteResponse = {
  status: "success";
  note: SharedNote;
};
