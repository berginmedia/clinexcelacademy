import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true }
});

const QuizConfigSchema = new mongoose.Schema({
  timeLimit: { type: Number, required: true, default: 10 }, // in minutes
  passPercentage: { type: Number, required: true, default: 70 },
  displayCount: { type: Number, required: true, default: 10 },
  questions: [QuestionSchema]
});

const SectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['video', 'pdf', 'quiz'], required: true },
  url: { type: String },
  duration: { type: String },
  quiz: { type: QuizConfigSchema }
});

const ModuleSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  sections: [SectionSchema]
});

const CertificateConfigSchema = new mongoose.Schema({
  signatoryName: { type: String, default: "John Doe" },
  signatoryTitle: { type: String, default: "Director of Education" },
  themeColor: { type: String, default: "#0066FF" },
  institutionName: { type: String, default: "Clinexcel Academy" }
});

const CourseSchema = new mongoose.Schema({
  courseId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  author: { type: String, required: true },
  thumbnail: { type: String },
  rating: { type: Number, default: 0 },
  bg: { type: String }, // Tailwind background class
  visibility: { type: String, enum: ['draft', 'published'], default: 'draft' },
  modules: [ModuleSchema],
  quiz: { type: QuizConfigSchema },
  certificate: { type: CertificateConfigSchema }
}, { timestamps: true });

if (mongoose.models.Course) {
  delete mongoose.models.Course;
}
export const Course = mongoose.model("Course", CourseSchema);
