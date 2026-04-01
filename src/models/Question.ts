import { Schema, model, Document, Types } from "mongoose";

/** Shape of a Question document */
export interface IQuestion extends Document {
  user: Types.ObjectId;       // owner (per-user isolation)
  category: Types.ObjectId;   // link to Category._id
  question: string;           // the prompt
  answer: string;             // the content
}

/** Define schema with field rules + options */
const QuestionSchema = new Schema<IQuestion>(
  {
    // Owner of the question; indexed for frequent filtering.
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

    // FK to category; we index because we filter by category a lot.
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },

    // Question text with reasonable validation.
    question: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 1000,
    },

    // Answers can be long; keep a generous upper bound.
    answer: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 20000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Uniqueness constraint to prevent accidental duplicates:
 * - For the same user and same category, the exact same question text can exist only once.
 */
// ✅ 1) Business rule: block duplicates per user+category+question
QuestionSchema.index({ user: 1, category: 1, question: 1 }, { unique: true });



// ✅ 2) Performance: listing questions by user/category sorted by newest
QuestionSchema.index({ user: 1, category: 1, createdAt: -1 });


// ✅ 3) Performance: listing “all my questions” sorted by newest (no category filter)
QuestionSchema.index({ user: 1, createdAt: -1 });




/** Optional: speed "my latest questions" sorted queries */
// QuestionSchema.index({ user: 1, createdAt: -1 });

export default model<IQuestion>("Question", QuestionSchema);
