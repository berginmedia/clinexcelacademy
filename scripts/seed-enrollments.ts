import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { User } from "../src/lib/models/User";
import { Course } from "../src/lib/models/Course";
import { Enrollment } from "../src/lib/models/Enrollment";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in .env");
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected to MongoDB");

    // Clear existing enrollments
    await Enrollment.deleteMany({});
    console.log("Cleared existing enrollments");

    const students = await User.find({ role: "student" });
    const courses = await Course.find({});

    if (students.length === 0 || courses.length === 0) {
      console.log("Not enough students or courses to seed enrollments.");
      return;
    }

    // Give each student some random enrollments
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      
      // Student 1: Enrolled in all 3 courses (1 completed, 1 in progress, 1 not started)
      // Student 2: Enrolled in 2 courses (1 completed, 1 in progress)
      // Student 3: Enrolled in 1 course (in progress)
      
      // Grab 1st course (simulate completed)
      if (courses[0]) {
        const allSections = courses[0].modules.flatMap((m: any) => m.sections.map((s: any) => s.id));
        await Enrollment.create({
          studentId: student._id,
          courseId: courses[0].courseId,
          completedSections: allSections // all completed
        });
      }

      if (i < 2 && courses[1]) {
        // Grab 2nd course (simulate in progress - half sections)
        const allSections = courses[1].modules.flatMap((m: any) => m.sections.map((s: any) => s.id));
        const halfSections = allSections.slice(0, Math.ceil(allSections.length / 2));
        await Enrollment.create({
          studentId: student._id,
          courseId: courses[1].courseId,
          completedSections: halfSections // half completed
        });
      }

      if (i === 0 && courses[2]) {
        // Grab 3rd course (simulate not started - 0 sections)
        await Enrollment.create({
          studentId: student._id,
          courseId: courses[2].courseId,
          completedSections: [] // none completed
        });
      }
    }

    console.log("Successfully seeded enrollments");

  } catch (error) {
    console.error("Error seeding enrollments:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seed();
