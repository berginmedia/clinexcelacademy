import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../lib/models/User.js"; // Note the .js extension for TS node execution

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in .env");
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB...");

    // Clear existing users for a clean seed
    await User.deleteMany({});
    console.log("Cleared existing users.");

    // Create Admin
    const adminPasswordHash = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Raymond",
      email: "admin@example.com",
      passwordHash: adminPasswordHash,
      role: "admin",
      avatarSeed: "Raymond",
      lastActive: new Date(),
    });
    console.log("Admin user created (admin@example.com / admin123)");

    // Create Student
    const studentPasswordHash = await bcrypt.hash("student123", 10);
    await User.create({
      name: "Ilamukil KJ",
      email: "student@example.com",
      passwordHash: studentPasswordHash,
      role: "student",
      avatarSeed: "Ilamukil",
      lastActive: new Date(),
    });
    console.log("Student user created (student@example.com / student123)");

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
