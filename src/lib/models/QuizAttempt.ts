import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuizQuestionAttempt {
  questionId: string;
  text: string;
  options: string[]; // Shuffled array of options for this attempt
  originalOptionIndices: number[]; // Maps the shuffled option index to the original option index. e.g. if originalOptionIndices[0] is 2, the 0th option shown to user is the 2nd option in the DB.
  selectedOptionIndex?: number; // The index they chose from the SHUFFLED options
}

export interface IQuizAttempt extends Document {
  studentId: string;
  courseId: string;
  sectionId: string; // The specific quiz section
  startTime: Date;
  completedAt?: Date;
  status: "in_progress" | "passed" | "failed";
  score?: number; // 0-100 percentage
  questions: IQuizQuestionAttempt[];
}

const QuizQuestionAttemptSchema = new Schema({
  questionId: { type: String, required: true },
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  originalOptionIndices: [{ type: Number, required: true }],
  selectedOptionIndex: { type: Number }
});

const QuizAttemptSchema: Schema<IQuizAttempt> = new Schema(
  {
    studentId: { type: String, required: true },
    courseId: { type: String, required: true },
    sectionId: { type: String, required: true },
    startTime: { type: Date, default: Date.now },
    completedAt: { type: Date },
    status: { type: String, enum: ["in_progress", "passed", "failed"], default: "in_progress" },
    score: { type: Number },
    questions: [QuizQuestionAttemptSchema]
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.QuizAttempt) {
  delete mongoose.models.QuizAttempt;
}
export const QuizAttempt: Model<IQuizAttempt> = mongoose.model<IQuizAttempt>("QuizAttempt", QuizAttemptSchema);
