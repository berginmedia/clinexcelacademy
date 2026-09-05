import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { Course } from "../src/lib/models/Course";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in .env");
  process.exit(1);
}

const mockSections = [
  { id: "s1", title: "1. Getting Started", type: "video", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "10:05" },
  { id: "s2", title: "2. Core Concepts", type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", duration: "5 mins read" },
  { id: "s3", title: "3. Knowledge Check", type: "quiz", url: "", duration: "10 questions" }
];

const mockModules = [
  { id: "m1", title: "Module 1: Introduction", sections: mockSections },
  { id: "m2", title: "Module 2: Advanced Topics", sections: mockSections }
];

const mockCourses = [
  {
    courseId: "100001",
    title: "Introduction to Web Design",
    description: "Learn the fundamentals of web design from scratch.",
    category: "CODE",
    author: "Clinexcel Team",
    rating: 4.8,
    bg: "bg-orange-100",
    visibility: "published",
    modules: mockModules
  },
  {
    courseId: "100002",
    title: "No Code Web Design",
    description: "Build beautiful websites without writing a single line of code.",
    category: "DESIGN",
    author: "Robert",
    rating: 4.2,
    bg: "bg-red-100",
    visibility: "published",
    modules: mockModules
  },
  {
    courseId: "100003",
    title: "Digital Marketing & E-commerce",
    description: "Master digital marketing and scale your e-commerce business.",
    category: "BUSINESS",
    author: "Donna",
    rating: 4.8,
    bg: "bg-blue-400",
    visibility: "published",
    modules: mockModules
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected to MongoDB");

    await Course.deleteMany({});
    console.log("Cleared existing courses");

    await Course.insertMany(mockCourses);
    console.log("Successfully seeded", mockCourses.length, "courses");

  } catch (error) {
    console.error("Error seeding courses:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seed();
