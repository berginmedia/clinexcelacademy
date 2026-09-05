import { createServerFn } from "@tanstack/react-start";
import { connectDB } from "../lib/db";
import { User } from "../lib/models/User";
import { Course } from "../lib/models/Course";
import { Enrollment } from "../lib/models/Enrollment";
import { getAuthSessionFn } from "../lib/auth";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(date);
}

function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " mins ago";
  return "Just now";
}

export const getStudentsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const session = await getAuthSessionFn();
      if (!session || session.role !== "admin") throw new Error("Forbidden");

      await connectDB();
      const students = await User.find({ role: "student" }).lean();
      const courses = await Course.find({}).lean();
      
      // Calculate total sections per course for fast lookup
      const courseTotalMap: Record<string, number> = {};
      courses.forEach(c => {
        const total = c.modules?.reduce((acc: number, m: any) => acc + (m.sections?.length || 0), 0) || 0;
        courseTotalMap[c.courseId] = total;
      });

      const results = [];
      for (const student of students) {
        const enrollments = await Enrollment.find({ studentId: student._id }).lean();
        
        let activeCourses = 0;
        let completed = 0;

        for (const e of enrollments) {
          const total = courseTotalMap[e.courseId] || 0;
          if (total > 0 && e.completedSections?.length === total) {
            completed++;
          } else {
            activeCourses++;
          }
        }

        results.push({
          id: student._id.toString(),
          name: student.name,
          email: student.email,
          seed: student.avatarSeed,
          joined: formatDate(student.joinedAt || new Date()),
          activeCourses,
          completed,
          suspended: student.suspended || false
        });
      }

      return JSON.parse(JSON.stringify(results));
    } catch (error) {
      console.error("Error fetching students:", error);
      return [];
    }
  });

export const getStudentProfileFn = createServerFn({ method: "GET" })
  .validator((data: { studentId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const session = await getAuthSessionFn();
      if (!session) throw new Error("Unauthorized");
      if (session.role !== "admin" && session.userId !== data.studentId) {
        throw new Error("Forbidden");
      }

      await connectDB();
      const student = await User.findById(data.studentId).lean();
      if (!student) return null;

      const enrollments = await Enrollment.find({ studentId: student._id }).lean();
      const courses = await Course.find({}).lean();
      
      const enrolledCoursesList = [];

      for (const e of enrollments) {
        const course = courses.find(c => c.courseId === e.courseId);
        if (!course) continue;

        const totalSections = course.modules?.reduce((acc: number, m: any) => acc + (m.sections?.length || 0), 0) || 0;
        const completedCount = e.completedSections?.length || 0;
        let status = 'not_started';

        const totalModules = course.modules?.length || 0;
        let completedModules = 0;
        
        course.modules?.forEach((module: any) => {
          if (!module.sections || module.sections.length === 0) return;
          const isModuleComplete = module.sections.every((s: any) => {
            const sectionIdStr = s._id ? s._id.toString() : s.id;
            return e.completedSections?.includes(sectionIdStr);
          });
          if (isModuleComplete) {
            completedModules++;
          }
        });

        if (completedModules > 0 && completedModules < totalModules) status = 'in_progress';
        if (completedModules === totalModules && totalModules > 0) status = 'completed';

        const QuizAttempt = (await import("../lib/models/QuizAttempt")).QuizAttempt;
        const passedAttempt = await QuizAttempt?.findOne({
          studentId: student._id.toString(),
          courseId: course.courseId,
          status: "passed"
        }).lean();
        
        const latestAttempt = await QuizAttempt?.findOne({
          studentId: student._id.toString(),
          courseId: course.courseId
        }).sort({ createdAt: -1 }).lean();

        const activeAttempt = passedAttempt || latestAttempt;
        let scoreDisplay = '-';
        if (activeAttempt?.score !== undefined) {
          scoreDisplay = `${Math.round(activeAttempt.score / 10)}/10`;
        }

        enrolledCoursesList.push({
          courseId: course.courseId,
          title: course.title,
          category: course.category,
          bg: course.bg,
          totalSections,
          completedSections: completedCount,
          totalModules,
          completedModules,
          status,
          percentage: totalModules === 0 ? 0 : Math.round((completedModules / totalModules) * 100),
          enrolledAt: e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString() : 'N/A',
          completedAt: passedAttempt?.completedAt ? new Date(passedAttempt.completedAt).toLocaleDateString() : null,
          score: scoreDisplay
        });
      }

      const profile = {
        id: student._id.toString(),
        name: student.name,
        email: student.email,
        seed: student.avatarSeed,
        joined: formatDate(student.joinedAt || new Date()),
        lastActive: student.lastActive ? timeAgo(student.lastActive) : "Just now",
        suspended: student.suspended || false,
        enrolledCourses: enrolledCoursesList
      };

      return JSON.parse(JSON.stringify(profile));
    } catch (error) {
      console.error("Error fetching student profile:", error);
      return null;
    }
  });

export const toggleSuspendUserFn = createServerFn({ method: "POST" })
  .validator((data: { studentId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const session = await getAuthSessionFn();
      if (!session || session.role !== "admin") throw new Error("Forbidden");

      await connectDB();
      const student = await User.findById(data.studentId);
      if (!student) throw new Error("Student not found");

      const newSuspendedState = !student.suspended;
      await User.updateOne({ _id: student._id }, { $set: { suspended: newSuspendedState } });
      
      return { success: true, suspended: newSuspendedState };
    } catch (error: any) {
      console.error("Error toggling suspend user:", error);
      throw new Error(error.message);
    }
  });

export const resetStudentPasswordFn = createServerFn({ method: "POST" })
  .validator((data: { studentId: string; newPassword: string }) => data)
  .handler(async ({ data }) => {
    try {
      const session = await getAuthSessionFn();
      if (!session || session.role !== "admin") throw new Error("Forbidden");

      await connectDB();
      const student = await User.findById(data.studentId);
      if (!student) throw new Error("Student not found");

      const bcrypt = (await import("bcryptjs")).default || await import("bcryptjs");
      student.passwordHash = await bcrypt.hash(data.newPassword, 10);
      student.tokenVersion = (student.tokenVersion || 0) + 1;
      await student.save();

      return { success: true };
    } catch (error: any) {
      console.error("Error resetting student password:", error);
      throw new Error(error.message);
    }
  });

export const createStudentFn = createServerFn({ method: "POST" })
  .validator((data: { name: string; email: string; password: string }) => data)
  .handler(async ({ data }) => {
    try {
      const session = await getAuthSessionFn();
      if (!session || session.role !== "admin") throw new Error("Forbidden");

      await connectDB();
      const existing = await User.findOne({ email: data.email });
      if (existing) {
        throw new Error("A user with this email already exists");
      }

      const bcrypt = (await import("bcryptjs")).default || await import("bcryptjs");
      const passwordHash = await bcrypt.hash(data.password, 10);

      const newStudent = await User.create({
        name: data.name,
        email: data.email,
        passwordHash,
        role: "student",
        avatarSeed: data.name.replace(/\s+/g, ""),
        joinedAt: new Date(),
        suspended: false
      });

      return { success: true, studentId: newStudent._id.toString() };
    } catch (error: any) {
      console.error("Error creating student:", error);
      throw new Error(error.message);
    }
  });

export const enrollStudentFn = createServerFn({ method: "POST" })
  .validator((data: { studentId: string; courseId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const session = await getAuthSessionFn();
      if (!session || session.role !== "admin") throw new Error("Forbidden");

      await connectDB();
      const existing = await Enrollment.findOne({ studentId: data.studentId, courseId: data.courseId });
      if (existing) {
        throw new Error("Student is already enrolled in this course");
      }

      await Enrollment.create({
        studentId: data.studentId,
        courseId: data.courseId,
        enrolledAt: new Date(),
        completedSections: []
      });
      return { success: true };
    } catch (error: any) {
      console.error("Error enrolling student:", error);
      throw new Error(error.message);
    }
  });

export const downloadTranscriptFn = createServerFn({ method: "POST" })
  .validator((data: { studentId: string; courses: any[] }) => data)
  .handler(async ({ data }) => {
    try {
      const session = await getAuthSessionFn();
      if (!session || session.role !== "admin") throw new Error("Forbidden");

      await connectDB();
      const student = await User.findById(data.studentId).lean();
      if (!student) throw new Error("Student not found");

      const coursesRows = data.courses.map((course: any) => `
        <tr class="border-b border-gray-200">
          <td class="py-4 px-4 text-[10px] font-semibold text-gray-800">${course.title}</td>
          <td class="py-4 px-4 text-[10px] text-gray-600">${course.enrolledAt || '-'}</td>
          <td class="py-4 px-4 text-[10px] text-gray-600">${course.completedAt || '-'}</td>
          <td class="py-4 px-4 text-[10px] text-gray-600">${course.completedModules}/${course.totalModules} Modules</td>
          <td class="py-4 px-4 text-[10px] font-medium ${course.status === 'completed' ? 'text-green-600' : 'text-gray-500'}">
            ${course.status === 'completed' ? 'Complete' : 'Incomplete'}
          </td>
          <td class="py-4 px-4 text-[10px] text-gray-600">${course.score || '-'}</td>
        </tr>
      `).join('');

      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white p-12 font-sans">
  <div class="max-w-4xl mx-auto">
    <div class="border-b-2 border-gray-800 pb-6 mb-8 flex justify-between items-end">
      <div>
        <h1 class="text-[20px] font-black text-gray-900">Academic Transcript</h1>
        <p class="text-[10px] text-gray-500 mt-2">Clinexcel Academy</p>
      </div>
      <div class="text-right">
        <p class="text-[10px] font-bold text-gray-800">Student: ${student.name}</p>
        <p class="text-[10px] text-gray-500">Email: ${student.email}</p>
        <p class="text-[10px] text-gray-500">Date Issued: ${new Date().toLocaleDateString()}</p>
      </div>
    </div>
    
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-gray-50 border-y border-gray-200">
          <th class="py-3 px-4 text-[10px] font-bold text-gray-700">Course</th>
          <th class="py-3 px-4 text-[10px] font-bold text-gray-700">Date Enrolled</th>
          <th class="py-3 px-4 text-[10px] font-bold text-gray-700">Date Completed</th>
          <th class="py-3 px-4 text-[10px] font-bold text-gray-700">Progress</th>
          <th class="py-3 px-4 text-[10px] font-bold text-gray-700">Status</th>
          <th class="py-3 px-4 text-[10px] font-bold text-gray-700">Score</th>
        </tr>
      </thead>
      <tbody>
        ${coursesRows.length ? coursesRows : '<tr><td colspan="6" class="py-8 text-[10px] text-center text-gray-500">No courses enrolled.</td></tr>'}
      </tbody>
    </table>
  </div>
</body>
</html>
      `;

      const puppeteer = (await import('puppeteer')).default || await import('puppeteer');
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      
      await page.setContent(htmlContent, { waitUntil: 'load' });
      await page.waitForNetworkIdle({ idleTime: 500 });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '40px', right: '40px', bottom: '40px', left: '40px' }
      });

      await browser.close();

      const base64 = Buffer.from(pdfBuffer).toString('base64');
      return { base64, filename: `Transcript_${student.name.replace(/\s+/g, '_')}.pdf` };
    } catch (error: any) {
      console.error("Error generating transcript:", error);
      throw new Error(error.message);
    }
  });
