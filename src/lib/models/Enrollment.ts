import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEnrollment extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: string;
  completedSections: string[];
  viewedSections: string[];
  enrolledAt: Date;
}

const EnrollmentSchema: Schema<IEnrollment> = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: String, required: true }, // refers to Course.courseId
    completedSections: [{ type: String }],
    viewedSections: [{ type: String }],
    enrolledAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Enrollment: Model<IEnrollment> = mongoose.models.Enrollment || mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);
