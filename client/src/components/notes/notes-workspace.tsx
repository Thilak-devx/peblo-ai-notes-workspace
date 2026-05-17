"use client";

import { startTransition, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { WorkspaceHeader } from "@/components/layout/workspace-header";
import { NoteEditor } from "@/components/notes/note-editor";
import { NoteInsightsPanel } from "@/components/notes/note-insights-panel";
import { NoteList } from "@/components/notes/note-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/lib/api/errors";
import {
  archiveNote,
  createNote,
  deleteNote,
  disableNoteSharing,
  enableNoteSharing,
  fetchNotes,
  generateNoteAiInsights,
  updateNote,
} from "@/lib/api/notes";
import type { Note } from "@/types/note";

type SaveState = "idle" | "saving" | "saved" | "error";
type ArchiveFilter = "all" | "active" | "archived";
type SortMode = "recent" | "oldest";
type EditableNoteFields = {
  title: string;
  content: string;
  tags: string[];
  category: string;
};
type NoteDraft = {
  noteId: string;
  fields: EditableNoteFields;
};
type NoteAiState = {
  noteId: string | null;
  summary: string;
  actionItems: string[];
  suggestedTitle: string;
};

const searchDebounceMs = 250;
const autosaveDebounceMs = 900;

function normalizeTags(tags: string[] | undefined | null) {
  return Array.isArray(tags) ? tags : [];
}

function normalizeActionItems(items: string[] | undefined | null) {
  return Array.isArray(items) ? items : [];
}

function normalizeNote(note: Note): Note {
  return {
    ...note,
    title: note.title ?? "",
    content: note.content ?? "",
    tags: normalizeTags(note.tags),
    category: note.category ?? "General",
    aiSummary: note.aiSummary ?? "",
    aiActionItems: normalizeActionItems(note.aiActionItems),
    aiSuggestedTitle: note.aiSuggestedTitle ?? "",
    shareId: note.shareId ?? null,
  };
}

function getEditableFields(note?: Partial<Note>) {
  return {
    title: note?.title ?? "",
    content: note?.content ?? "",
    tags: normalizeTags(note?.tags),
    category: note?.category ?? "General",
  };
}

function createDraft(note: Note): NoteDraft {
  return {
    noteId: note.id,
    fields: getEditableFields(note),
  };
}

function createAiState(note?: Note | null): NoteAiState {
  if (!note) {
    return {
      noteId: null,
      summary: "",
      actionItems: [],
      suggestedTitle: "",
    };
  }

  return {
    noteId: note.id,
    summary: note.aiSummary ?? "",
    actionItems: normalizeActionItems(note.aiActionItems),
    suggestedTitle: note.aiSuggestedTitle ?? "",
  };
}

function getDraftSnapshot(fields: EditableNoteFields) {
  return JSON.stringify({
    title: fields.title,
    content: fields.content,
    tags: normalizeTags(fields.tags),
    category: fields.category,
  });
}

function sortNotes(notes: Note[], sortMode: SortMode) {
  return [...notes].sort((left, right) => {
    const leftTime = new Date(left.updatedAt || left.createdAt || 0).getTime();
    const rightTime = new Date(right.updatedAt || right.createdAt || 0).getTime();

    return sortMode === "recent" ? rightTime - leftTime : leftTime - rightTime;
  });
}

function formatLastUpdated(value?: string) {
  if (!value) {
    return "Unsaved locally";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unsaved locally";
  }

  return `Updated ${new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)}`;
}

export function NotesWorkspace() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [draft, setDraft] = useState<NoteDraft | null>(null);
  const [aiState, setAiState] = useState<NoteAiState>(createAiState(null));
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pageError, setPageError] = useState("");
  const [aiError, setAiError] = useState("");
  const [shareError, setShareError] = useState("");
  const [search, setSearch] = useState("");
  const [tagFilterInput, setTagFilterInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedTagFilterInput, setDebouncedTagFilterInput] = useState("");
  const [archiveFilter, setArchiveFilter] = useState<ArchiveFilter>("active");
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [focusTitleSignal, setFocusTitleSignal] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "error">("success");

  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const baselineSnapshotRef = useRef("");
  const latestDraftRef = useRef<NoteDraft | null>(null);
  const selectedNoteIdRef = useRef<string | null>(null);

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId) || null,
    [notes, selectedNoteId],
  );

  const editorFields = useMemo(() => {
    if (draft?.noteId === selectedNoteId) {
      return getEditableFields(draft.fields);
    }

    return getEditableFields(selectedNote ?? undefined);
  }, [draft, selectedNote, selectedNoteId]);

  const selectedEditorNote = useMemo(() => {
    if (!selectedNote) {
      return null;
    }

    return {
      ...selectedNote,
      ...editorFields,
    };
  }, [editorFields, selectedNote]);

  const displayedNotes = useMemo(() => {
    const notesWithDraftPreview = notes.map((note) =>
      draft?.noteId === note.id
        ? {
            ...note,
            ...draft.fields,
          }
        : note,
    );

    return sortNotes(notesWithDraftPreview, sortMode);
  }, [draft, notes, sortMode]);

  const tagFilters = useMemo(
    () =>
      debouncedTagFilterInput
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    [debouncedTagFilterInput],
  );

  const shareUrl = useMemo(() => {
    if (!selectedNote?.isPublic || !selectedNote.shareId) {
      return null;
    }

    if (typeof window === "undefined") {
      return `/shared/${selectedNote.shareId}`;
    }

    return `${window.location.origin}/shared/${selectedNote.shareId}`;
  }, [selectedNote]);

  useEffect(() => {
    latestDraftRef.current = draft;
  }, [draft]);

  useEffect(() => {
    selectedNoteIdRef.current = selectedNoteId;
  }, [selectedNoteId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setDebouncedTagFilterInput(tagFilterInput);
    }, searchDebounceMs);

    return () => clearTimeout(timer);
  }, [search, tagFilterInput]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setToastMessage("");
    }, 2600);

    return () => clearTimeout(timer);
  }, [toastMessage]);

  const showToast = (message: string, variant: "success" | "error" = "success") => {
    setToastVariant(variant);
    setToastMessage(message);
  };

  const activateNote = (note: Note | null) => {
    const nextDraft = note ? createDraft(note) : null;

    setSelectedNoteId(note?.id ?? null);
    setDraft(nextDraft);
    latestDraftRef.current = nextDraft;
    setAiState(createAiState(note));
    baselineSnapshotRef.current = nextDraft ? getDraftSnapshot(nextDraft.fields) : "";
    setHasUnsavedChanges(false);
    setSaveState(note ? "saved" : "idle");
    setAiError("");
    setShareError("");
  };

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        setIsLoading(true);
        setPageError("");

        const loadedNotes = (await fetchNotes({
          search: debouncedSearch,
          tags: tagFilters,
          archived:
            archiveFilter === "all"
              ? undefined
              : archiveFilter === "archived"
                ? "true"
                : "false",
        })).map(normalizeNote);

        if (!isMounted) {
          return;
        }

        const nextSelectedId =
          selectedNoteIdRef.current &&
          loadedNotes.some((note) => note.id === selectedNoteIdRef.current)
            ? selectedNoteIdRef.current
            : loadedNotes[0]?.id ?? null;
        const nextSelectedNote =
          loadedNotes.find((note) => note.id === nextSelectedId) || null;

        setNotes(loadedNotes);
        activateNote(nextSelectedNote);
      } catch (error) {
        if (isMounted) {
          setPageError(getApiErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      isMounted = false;
    };
  }, [archiveFilter, debouncedSearch, tagFilters]);

  const saveDraft = async (options?: {
    showSuccessToast?: boolean;
    draftOverride?: NoteDraft | null;
  }) => {
    const draftToSave = options?.draftOverride ?? latestDraftRef.current;

    if (!draftToSave) {
      return true;
    }

    const snapshot = getDraftSnapshot(draftToSave.fields);

    if (baselineSnapshotRef.current === snapshot) {
      if (selectedNoteIdRef.current === draftToSave.noteId) {
        setHasUnsavedChanges(false);
        setSaveState("saved");
      }

      return true;
    }

    if (selectedNoteIdRef.current === draftToSave.noteId) {
      setSaveState("saving");
      setPageError("");
    }

    try {
      const savedNote = normalizeNote(
        await updateNote(draftToSave.noteId, {
          title: draftToSave.fields.title,
          content: draftToSave.fields.content,
          tags: normalizeTags(draftToSave.fields.tags),
          category: draftToSave.fields.category,
        }),
      );

      setNotes((current) =>
        current.map((note) => (note.id === savedNote.id ? savedNote : note)),
      );
      setAiState((current) =>
        current.noteId === savedNote.id ? createAiState(savedNote) : current,
      );

      const latestDraft = latestDraftRef.current;
      const preservedNewerDraft =
        latestDraft?.noteId === draftToSave.noteId &&
        getDraftSnapshot(latestDraft.fields) !== snapshot;

      baselineSnapshotRef.current = snapshot;

      if (selectedNoteIdRef.current === draftToSave.noteId) {
        setHasUnsavedChanges(Boolean(preservedNewerDraft));
        setSaveState(preservedNewerDraft ? "idle" : "saved");

        if (options?.showSuccessToast && !preservedNewerDraft) {
          showToast("Saved");
        }
      }

      return true;
    } catch (error) {
      if (selectedNoteIdRef.current === draftToSave.noteId) {
        setSaveState("error");
        setPageError(getApiErrorMessage(error));
      }

      return false;
    }
  };

  const updateDraftField = <K extends keyof EditableNoteFields>(
    field: K,
    value: EditableNoteFields[K],
  ) => {
    if (!selectedNoteId) {
      return;
    }

    setDraft((current) => {
      const baseFields =
        current?.noteId === selectedNoteId ? current.fields : getEditableFields(selectedNote ?? undefined);

      return {
        noteId: selectedNoteId,
        fields: {
          ...baseFields,
          [field]: field === "tags" ? normalizeTags(value as string[]) : value,
        },
      };
    });

    setHasUnsavedChanges(true);
    setSaveState("idle");
    setPageError("");
  };

  const handleTitleChange = (value: string) => {
    updateDraftField("title", value);
  };

  const handleContentChange = (value: string) => {
    updateDraftField("content", value);
  };

  const handleTagsChange = (value: string[]) => {
    updateDraftField("tags", normalizeTags(value));
  };

  const handleCategoryChange = (value: string) => {
    updateDraftField("category", value);
  };

  const triggerAutosave = useEffectEvent(() => {
    void saveDraft();
  });

  useEffect(() => {
    if (!draft || !hasUnsavedChanges) {
      return;
    }

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      triggerAutosave();
    }, autosaveDebounceMs);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [draft, hasUnsavedChanges]);

  const handleCreateNote = async () => {
    if (hasUnsavedChanges) {
      const saved = await saveDraft();

      if (!saved) {
        return;
      }
    }

    setIsCreating(true);
    setPageError("");

    try {
      const createdNote = normalizeNote(
        await createNote({
          title: "Untitled note",
          content: "",
          tags: [],
          category: "General",
        }),
      );

      setNotes((current) => [createdNote, ...current]);
      activateNote(createdNote);
      setFocusTitleSignal((current) => current + 1);
    } catch (error) {
      setPageError(getApiErrorMessage(error));
      showToast("Unable to create note", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDuplicateNote = async () => {
    const currentDraft = latestDraftRef.current;

    if (!currentDraft) {
      return;
    }

    if (hasUnsavedChanges) {
      const saved = await saveDraft();

      if (!saved) {
        return;
      }
    }

    setIsCreating(true);
    setPageError("");

    try {
      const duplicatedNote = normalizeNote(
        await createNote({
          title: currentDraft.fields.title.trim()
            ? `${currentDraft.fields.title} copy`
            : "Untitled note copy",
          content: currentDraft.fields.content,
          tags: normalizeTags(currentDraft.fields.tags),
          category: currentDraft.fields.category,
        }),
      );

      setNotes((current) => [duplicatedNote, ...current]);
      activateNote(duplicatedNote);
      setFocusTitleSignal((current) => current + 1);
      showToast("Note duplicated");
    } catch (error) {
      setPageError(getApiErrorMessage(error));
      showToast("Unable to duplicate note", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectNote = async (noteId: string) => {
    if (noteId === selectedNoteIdRef.current) {
      return;
    }

    if (hasUnsavedChanges) {
      const saved = await saveDraft();

      if (!saved) {
        return;
      }
    }

    const nextNote = notes.find((note) => note.id === noteId) || null;

    activateNote(nextNote);
  };

  const handleSaveNow = async () => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    await saveDraft({ showSuccessToast: true });
  };

  const handleArchiveToggle = async () => {
    if (!selectedNote) {
      return;
    }

    if (hasUnsavedChanges) {
      const saved = await saveDraft();

      if (!saved) {
        return;
      }
    }

    setIsMutating(true);
    setPageError("");

    try {
      const updatedNote = normalizeNote(
        await archiveNote(selectedNote.id, !selectedNote.archived),
      );

      const nextNotes = notes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note,
      );

      setNotes(nextNotes);

      if (
        (archiveFilter === "active" && updatedNote.archived) ||
        (archiveFilter === "archived" && !updatedNote.archived)
      ) {
        startTransition(() => {
          const remainingNotes = nextNotes.filter((note) => note.id !== updatedNote.id);
          setNotes(remainingNotes);
          activateNote(remainingNotes[0] ?? null);
        });
      } else {
        activateNote(updatedNote);
      }
    } catch (error) {
      setPageError(getApiErrorMessage(error));
      showToast("Unable to update archive status", "error");
    } finally {
      setIsMutating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedNote) {
      return;
    }

    setIsMutating(true);
    setPageError("");

    try {
      await deleteNote(selectedNote.id);

      const remainingNotes = notes.filter((note) => note.id !== selectedNote.id);
      setNotes(remainingNotes);
      activateNote(remainingNotes[0] ?? null);
      showToast("Note deleted");
    } catch (error) {
      setPageError(getApiErrorMessage(error));
      showToast("Unable to delete note", "error");
    } finally {
      setIsMutating(false);
    }
  };

  const handleGenerateAi = async () => {
    if (!selectedNoteIdRef.current) {
      return;
    }

    if (hasUnsavedChanges) {
      const saved = await saveDraft();

      if (!saved) {
        return;
      }
    }

    setIsGeneratingAi(true);
    setAiError("");

    try {
      const enrichedNote = normalizeNote(
        await generateNoteAiInsights(selectedNoteIdRef.current),
      );

      setNotes((current) =>
        current.map((note) => (note.id === enrichedNote.id ? enrichedNote : note)),
      );

      if (selectedNoteIdRef.current === enrichedNote.id) {
        setAiState(createAiState(enrichedNote));
      }
    } catch (error) {
      setAiError(getApiErrorMessage(error));
      showToast("Unable to generate AI insights", "error");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleApplySuggestedTitle = () => {
    if (!aiState.suggestedTitle) {
      return;
    }

    handleTitleChange(aiState.suggestedTitle);
  };

  const handleShareNote = async () => {
    if (!selectedNote) {
      return;
    }

    setIsSharing(true);
    setShareError("");

    try {
      const sharedNote = normalizeNote(await enableNoteSharing(selectedNote.id));

      setNotes((current) =>
        current.map((note) => (note.id === sharedNote.id ? sharedNote : note)),
      );
      showToast("Public share link generated");
    } catch (error) {
      setShareError(getApiErrorMessage(error));
      showToast("Unable to generate share link", "error");
    } finally {
      setIsSharing(false);
    }
  };

  const handleDisableSharing = async () => {
    if (!selectedNote) {
      return;
    }

    setIsSharing(true);
    setShareError("");

    try {
      const unsharedNote = normalizeNote(await disableNoteSharing(selectedNote.id));

      setNotes((current) =>
        current.map((note) => (note.id === unsharedNote.id ? unsharedNote : note)),
      );
      showToast("Public sharing disabled");
    } catch (error) {
      setShareError(getApiErrorMessage(error));
      showToast("Unable to disable sharing", "error");
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyShareLink = async () => {
    if (!shareUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("Share link copied");
    } catch {
      showToast("Unable to copy share link", "error");
    }
  };

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    const isModifierPressed = event.metaKey || event.ctrlKey;

    if (!isModifierPressed) {
      return;
    }

    if (event.key.toLowerCase() === "s") {
      event.preventDefault();

      if (latestDraftRef.current && !isMutating && !isCreating) {
        if (autosaveTimerRef.current) {
          clearTimeout(autosaveTimerRef.current);
        }

        void saveDraft({ showSuccessToast: true });
      }
    }

    if (event.key.toLowerCase() === "n") {
      event.preventDefault();

      if (!isCreating && !isMutating) {
        void handleCreateNote();
      }
    }
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      handleKeyDown(event);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div className="space-y-6">
      <WorkspaceHeader
        title="Notes workspace"
        subtitle="Write, organize, and refine notes in a clean workspace with stable drafts, quiet autosave, and isolated AI suggestions."
      />

      <div className="grid w-full items-start gap-5 xl:grid-cols-[340px_minmax(0,1.35fr)_320px]">
        <div className="w-[340px] shrink-0 min-w-0">
          <Card className="notes-library-panel flex h-[720px] flex-col overflow-hidden p-0">
            <div className="notes-library-header sticky top-0 z-10 px-5 py-5 backdrop-blur-xl">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="notes-library-kicker text-xs font-semibold uppercase tracking-[0.24em]">
                      Notes library
                    </p>
                    <p className="notes-library-description mt-2 text-sm leading-7">
                      Search, filter, and move between notes without losing your current draft.
                    </p>
                  </div>
                  <Button disabled={isCreating || isMutating} onClick={handleCreateNote}>
                    {isCreating ? "Creating..." : "New note"}
                  </Button>
                </div>

                <Input
                  className="notes-library-field"
                  label="Search"
                  onChange={setSearch}
                  placeholder="Search notes"
                  value={search}
                />

                <Input
                  className="notes-library-field"
                  label="Filter by tags"
                  onChange={setTagFilterInput}
                  placeholder="research, weekly-review"
                  value={tagFilterInput}
                />

                <div className="grid gap-4">
                  <label className="block space-y-2">
                    <span className="notes-library-label text-sm font-medium">View</span>
                    <select
                      className="notes-library-field w-full min-w-0 rounded-2xl px-4 py-3 text-sm outline-none transition duration-200"
                      onChange={(event) => setArchiveFilter(event.target.value as ArchiveFilter)}
                      value={archiveFilter}
                    >
                      <option value="active">Active notes</option>
                      <option value="archived">Archived notes</option>
                      <option value="all">All notes</option>
                    </select>
                  </label>

                  <label className="block space-y-2">
                    <span className="notes-library-label text-sm font-medium">Sort</span>
                    <select
                      className="notes-library-field w-full min-w-0 rounded-2xl px-4 py-3 text-sm outline-none transition duration-200"
                      onChange={(event) => setSortMode(event.target.value as SortMode)}
                      value={sortMode}
                    >
                      <option value="recent">Recently updated</option>
                      <option value="oldest">Oldest first</option>
                    </select>
                  </label>
                </div>

                <p className="notes-library-description text-xs">
                  Search updates automatically after a short pause while typing.
                </p>

                {pageError ? (
                  <div className="rounded-[20px] border border-rose-200/80 bg-rose-50/90 px-4 py-3 text-sm leading-7 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
                    {pageError}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-5 pr-3">
              <div className="premium-scrollbar h-full overflow-y-auto pr-2">
                <NoteList
                  isLoading={isLoading}
                  notes={displayedNotes}
                  onSelect={handleSelectNote}
                  selectedNoteId={selectedNoteId}
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="min-w-0 w-full overflow-hidden">
          <NoteEditor
            category={editorFields.category}
            content={editorFields.content}
            focusTitleSignal={focusTitleSignal}
            hasNote={Boolean(selectedEditorNote)}
            hasUnsavedChanges={hasUnsavedChanges}
            isArchived={Boolean(selectedNote?.archived)}
            isBusy={isMutating || isCreating}
            lastUpdatedLabel={formatLastUpdated(selectedNote?.updatedAt || selectedNote?.createdAt)}
            onArchiveToggle={handleArchiveToggle}
            onCategoryChange={handleCategoryChange}
            onContentChange={handleContentChange}
            onCreateNote={handleCreateNote}
            onDelete={handleDelete}
            onDuplicateNote={handleDuplicateNote}
            onSaveNow={handleSaveNow}
            onTagsChange={handleTagsChange}
            onTitleChange={handleTitleChange}
            saveState={saveState}
            tags={editorFields.tags}
            title={editorFields.title}
          />
        </div>

        <div className="w-[320px] shrink-0 min-w-0">
          <NoteInsightsPanel
            aiActionItems={aiState.actionItems}
            aiSuggestedTitle={aiState.suggestedTitle}
            aiSummary={aiState.summary}
            hasNote={Boolean(selectedNote)}
            isGeneratingAi={isGeneratingAi}
            isPublic={Boolean(selectedNote?.isPublic)}
            isSharing={isSharing}
            onApplySuggestedTitle={handleApplySuggestedTitle}
            onCopyShareLink={handleCopyShareLink}
            onDisableSharing={handleDisableSharing}
            onGenerateAi={handleGenerateAi}
            onShare={handleShareNote}
            shareUrl={shareUrl}
          />
        </div>
      </div>

      {aiError ? (
        <div className="rounded-[24px] border border-rose-200/80 bg-rose-50/90 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
          {aiError}
        </div>
      ) : null}

      {shareError ? (
        <div className="rounded-[24px] border border-rose-200/80 bg-rose-50/90 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
          {shareError}
        </div>
      ) : null}

      {toastMessage ? <Toast message={toastMessage} variant={toastVariant} /> : null}
    </div>
  );
}
