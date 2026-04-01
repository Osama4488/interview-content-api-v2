import { Schema, model, Document, Types } from "mongoose";

/** Shape of a Category document */
export interface ICategory extends Document {
  user: Types.ObjectId;   // owner (per-user isolation)
  category: string;       // human name, e.g., "React"
  slug: string;           // normalized, lowercase version
}

/** Define schema with field rules + options */
const CategorySchema = new Schema<ICategory>(
  {
    // Owner: we index this because we filter by user very often.
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

    // Visible name; add basic validation & trim for cleanliness.
    category: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    // Normalized version for stable matching/links (e.g., "react").
    slug: { type: String, required: true, trim: true, lowercase: true },
  },
  {
    timestamps: true,     // adds createdAt / updatedAt
    versionKey: false,    // hides __v
  }
);

/**
 * Compound unique index enforces "unique per user":
 * - Same user cannot create duplicate category names.
 * - Different users CAN use the same category.
 */
CategorySchema.index({ user: 1, category: 1 }, { unique: true });

export default model<ICategory>("Category", CategorySchema);
