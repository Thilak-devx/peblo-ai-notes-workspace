import { Schema, Types, model, models } from "mongoose";

export type NoteDocument = {
  userId: Types.ObjectId;
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
};

const noteSchema = new Schema<NoteDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    content: {
      type: String,
      default: "",
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      default: "General",
      trim: true,
      maxlength: 80,
    },
    archived: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    shareId: {
      type: String,
      default: null,
      index: true,
    },
    aiSummary: {
      type: String,
      default: "",
    },
    aiActionItems: {
      type: [String],
      default: [],
    },
    aiSuggestedTitle: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

noteSchema.pre("save", function setShareId(next) {
  if (!this.isPublic) {
    this.shareId = null;
  }

  this.tags = Array.from(
    new Set(
      this.tags
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  );

  next();
});

noteSchema.index({ userId: 1, updatedAt: -1 });
noteSchema.index({ userId: 1, archived: 1, updatedAt: -1 });
noteSchema.index({ shareId: 1 }, { unique: true, sparse: true });

export const Note = models.Note || model<NoteDocument>("Note", noteSchema);
