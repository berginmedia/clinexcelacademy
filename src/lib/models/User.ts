import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "student" | "admin";
  avatarSeed: string;
  lastActive?: Date;
  joinedAt: Date;
  suspended?: boolean;
  tokenVersion?: number;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    avatarSeed: { type: String, required: true },
    lastActive: { type: Date },
    joinedAt: { type: Date, default: Date.now },
    suspended: { type: Boolean, default: false },
    tokenVersion: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from recompiling the model upon hot reloads, but since we updated the schema, we must delete the cached version first.
if (mongoose.models.User) {
  delete mongoose.models.User;
}
export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
