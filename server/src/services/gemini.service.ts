import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env";
import { ApiError } from "../utils/api-error";

type NoteAnalysisResult = {
  summary: string;
  actionItems: string[];
  suggestedTitle: string;
};

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
    });
  }

  return geminiClient;
}

const noteAnalysisSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: {
      type: "string",
      description:
        "A concise summary of the note in 2 to 4 sentences, focused on the most important ideas.",
    },
    actionItems: {
      type: "array",
      description:
        "A list of explicit or strongly implied next actions from the note. Return an empty array when no action items exist.",
      items: {
        type: "string",
      },
    },
    suggestedTitle: {
      type: "string",
      description:
        "A sharper, more useful title for the note. Keep it under 80 characters and make it specific.",
    },
  },
  required: ["summary", "actionItems", "suggestedTitle"],
};

function buildAnalysisPrompt(note: { title: string; content: string; category: string; tags: string[] }) {
  return `
You are an expert product and knowledge-work assistant helping organize notes.

Analyze the note below and return only structured JSON that matches the provided schema.

Rules:
- Write a practical summary, not a generic paraphrase.
- Extract action items only when they are explicit or strongly implied.
- If the note has no action items, return an empty array.
- Suggest a title that is specific, polished, and useful for a notes workspace.
- Keep the summary under 120 words.
- Return no more than 6 action items.
- Never include markdown, code fences, or commentary outside the JSON.

Note context:
Title: ${note.title || "Untitled note"}
Category: ${note.category || "General"}
Tags: ${note.tags.length ? note.tags.join(", ") : "None"}

Note content:
${note.content}
`.trim();
}

function sanitizeAnalysisResult(
  parsed: unknown,
  note: { title: string },
): NoteAnalysisResult {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Malformed Gemini response");
  }

  const candidate = parsed as Record<string, unknown>;
  const summary = typeof candidate.summary === "string" ? candidate.summary.trim() : "";
  const actionItems = Array.isArray(candidate.actionItems)
    ? candidate.actionItems
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 6)
    : [];
  const suggestedTitle =
    typeof candidate.suggestedTitle === "string" && candidate.suggestedTitle.trim()
      ? candidate.suggestedTitle.trim().slice(0, 80)
      : note.title.trim().slice(0, 80);

  if (!summary) {
    throw new Error("Gemini response did not include a valid summary");
  }

  return {
    summary,
    actionItems,
    suggestedTitle,
  };
}

export async function generateNoteAnalysis(note: {
  title: string;
  content: string;
  category: string;
  tags: string[];
}) {
  try {
    const client = getGeminiClient();

    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: buildAnalysisPrompt(note),
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: noteAnalysisSchema,
      },
    });

    if (!response.text) {
      throw new Error("Empty Gemini response");
    }

    const parsed = JSON.parse(response.text) as unknown;

    return sanitizeAnalysisResult(parsed, note);
  } catch {
    throw new ApiError(502, "Unable to generate AI insights for this note right now");
  }
}
