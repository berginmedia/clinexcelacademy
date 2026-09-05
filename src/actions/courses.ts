import { createServerFn } from "@tanstack/react-start";
import { connectDB } from "../lib/db";
import { Course } from "../lib/models/Course";
import { Enrollment } from "../lib/models/Enrollment";
import { QuizAttempt } from "../lib/models/QuizAttempt";
import { User } from "../lib/models/User";
import { getAuthSessionFn } from "../lib/auth";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const generatePresignedUrlsForCourse = async (course: any) => {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    return course;
  }

  const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  if (course.modules) {
    for (const mod of course.modules) {
      if (mod.sections) {
        for (const sec of mod.sections) {
          if (sec.url && sec.url.startsWith("s3://")) {
            const fileKey = sec.url.replace("s3://", "");
            try {
              const command = new GetObjectCommand({ Bucket: bucketName, Key: fileKey });
              // 2 hour expiration
              sec.url = await getSignedUrl(S3, command, { expiresIn: 7200 });
            } catch (e) {
              console.error("Failed to generate presigned URL for", fileKey);
            }
          }
        }
      }
    }
  }
  return course;
};
export const getCoursesFn = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const session = await getAuthSessionFn();
      if (!session) throw new Error("Unauthorized");

      await connectDB();

      const query = session.role === "student" ? { visibility: "published" as const } : {};
      const courses = await Course.find(query).lean();
      return JSON.parse(JSON.stringify(courses));
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  });

export const getCourseFn = createServerFn({ method: "GET" })
  .validator((data: { courseId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const session = await getAuthSessionFn();
      if (!session) throw new Error("Unauthorized");

      await connectDB();
      const course = await Course.findOne({ courseId: data.courseId }).lean();
      if (!course) return null;

      if (session.role === "student" && course.visibility !== "published") {
        throw new Error("Forbidden");
      }

      return JSON.parse(JSON.stringify(course));
    } catch (error) {
      console.error("Error fetching course:", error);
      return null;
    }
  });

export const createCourseFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    try {
      const session = await getAuthSessionFn();
      if (!session || session.role !== "admin") throw new Error("Forbidden");

      await connectDB();
      // Generate random 6 digit ID
      const courseId = Math.floor(100000 + Math.random() * 900000).toString();
      
      const newCourse = new Course({
        ...data,
        courseId
      });
      await newCourse.save();
      return { success: true, courseId };
    } catch (error: any) {
      console.error("Error creating course:", error);
      throw new Error(error.message);
    }
  });

export const updateCourseFn = createServerFn({ method: "POST" })
  .validator((data: { courseId: string; updates: any }) => data)
  .handler(async ({ data }) => {
    try {
      const session = await getAuthSessionFn();
      if (!session || session.role !== "admin") throw new Error("Forbidden");

      await connectDB();
      const { courseId, updates } = data;
      await Course.updateOne({ courseId }, { $set: updates });
      return { success: true };
    } catch (error: any) {
      console.error("Error updating course:", error);
      throw new Error(error.message);
    }
  });

export const deleteCourseFn = createServerFn({ method: "POST" })
  .validator((data: { courseId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const session = await getAuthSessionFn();
      if (!session || session.role !== "admin") throw new Error("Forbidden");

      await connectDB();
      await Course.deleteOne({ courseId: data.courseId });
      return { success: true };
    } catch (error: any) {
      console.error("Error deleting course:", error);
      throw new Error(error.message);
    }
  });

export const getStudentCourseDataFn = createServerFn({ method: "GET" })
  .validator((data: { courseId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const session = await getAuthSessionFn();
      if (!session) throw new Error("Unauthorized");

      await connectDB();
      const course = await Course.findOne({ courseId: data.courseId }).lean();
      if (!course) throw new Error("Course not found");

      if (session.role === "student" && course.visibility !== "published") {
        throw new Error("Course is not available");
      }

      // Find the enrollment
      // For now, if the user is an admin viewing the course, they might not have an enrollment.
      // So we just return an empty completedSections array for admins if no enrollment exists.
      const enrollment = await Enrollment.findOne({ 
        studentId: session.userId, 
        courseId: data.courseId 
      }).lean();

      if (session.role === "student" && !enrollment) {
        throw new Error("Not Enrolled");
      }

      const quizAttempt = await QuizAttempt.findOne({
        studentId: session.userId,
        courseId: data.courseId,
        status: "passed"
      }).lean();

      const user = await User.findById(session.userId).lean();
      
      const processedCourse = await generatePresignedUrlsForCourse(course);

      return {
        course: JSON.parse(JSON.stringify(processedCourse)),
        completedSections: enrollment?.completedSections || [],
        viewedSections: enrollment?.viewedSections || [],
        quizPassed: !!quizAttempt,
        studentName: user?.name || "Student",
        completedAt: quizAttempt?.completedAt ? quizAttempt.completedAt.toISOString() : null
      };
    } catch (error: any) {
      console.error("Error fetching student course data:", error);
      throw new Error(error.message);
    }
  });

export const toggleSectionCompletionFn = createServerFn({ method: "POST" })
  .validator((data: { courseId: string; sectionId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const session = await getAuthSessionFn();
      if (!session) throw new Error("Unauthorized");

      await connectDB();

      const enrollment = await Enrollment.findOne({
        studentId: session.userId,
        courseId: data.courseId,
      });

      // Admins might not have an enrollment to track progress, but let's allow it if one exists, otherwise ignore or create one?
      // Actually, if an admin wants to test tracking, they would need an enrollment. 
      // But let's just do it securely.
      if (!enrollment) {
         if (session.role === "student") {
           throw new Error("Not Enrolled");
         } else {
           // Admin is viewing, just return success without saving
           return { success: true };
         }
      }

      const isCompleted = enrollment.completedSections.includes(data.sectionId);
      
      if (isCompleted) {
        enrollment.completedSections = enrollment.completedSections.filter(id => id !== data.sectionId);
      } else {
        enrollment.completedSections.push(data.sectionId);
      }
      
      await enrollment.save();
      return { success: true, completedSections: enrollment.completedSections };
    } catch (error: any) {
      console.error("Error toggling section completion:", error);
      throw new Error(error.message);
    }
  });

export const markSectionViewedFn = createServerFn({ method: "POST" })
  .validator((data: { courseId: string; sectionId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const session = await getAuthSessionFn();
      if (!session) return { success: false };

      await connectDB();

      const enrollment = await Enrollment.findOne({
        studentId: session.userId,
        courseId: data.courseId,
      });

      if (!enrollment) return { success: false };

      if (!enrollment.viewedSections.includes(data.sectionId)) {
        enrollment.viewedSections.push(data.sectionId);
        await enrollment.save();
      }
      
      return { success: true };
    } catch (error: any) {
      console.error("Error marking section viewed:", error);
      return { success: false };
    }
  });

export const getEnrolledCoursesFn = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const session = await getAuthSessionFn();
      if (!session) throw new Error("Unauthorized");

      await connectDB();

      if (session.role === "admin") {
        return [];
      }

      // Find all enrollments for this student
      const enrollments = await Enrollment.find({ studentId: session.userId }).lean();
      if (!enrollments.length) return [];

      const enrolledCourseIds = enrollments.map(e => e.courseId);

      // Fetch the courses
      const courses = await Course.find({ courseId: { $in: enrolledCourseIds }, visibility: "published" }).lean();
      
      const coursesWithProgress = await Promise.all(courses.map(async course => {
        const enrollment = enrollments.find(e => e.courseId === course.courseId);
        const processedCourse = await generatePresignedUrlsForCourse(course);
        return {
          ...processedCourse,
          completedSections: enrollment?.completedSections || []
        };
      }));

      return JSON.parse(JSON.stringify(coursesWithProgress));
    } catch (error: any) {
      console.error("Error fetching enrolled courses:", error);
      return [];
    }
  });

// Removed hexToRgb utility since we're using puppeteer now

export const downloadSecureCertificateFn = createServerFn({ method: "GET" })
  .validator((data: { courseId: string; studentId?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const session = await getAuthSessionFn();
      if (!session) throw new Error("Unauthorized");

      const targetStudentId = data.studentId && session.role === "admin" ? data.studentId : session.userId;

      await connectDB();
      const course = await Course.findOne({ courseId: data.courseId }).lean();
      if (!course) throw new Error("Course not found");

      const quizAttempt = await QuizAttempt.findOne({
        studentId: targetStudentId,
        courseId: data.courseId,
        status: "passed"
      }).lean();

      if (!quizAttempt && session.role !== "admin") {
        throw new Error("You have not passed the final quiz yet.");
      }

      const user = await User.findById(targetStudentId).lean();
      const studentName = user?.name || "Student";
      
      const certConfig = course.certificate || {
        signatoryName: "John Doe",
        signatoryTitle: "Director of Education",
        themeColor: "#0066FF",
        institutionName: "Clinexcel Academy"
      };

      const dateStr = quizAttempt?.completedAt 
        ? new Date(quizAttempt.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      // Generate HTML matching the React component exactly
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificate</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
    body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
  </style>
</head>
<body class="bg-white flex items-center justify-center w-[800px] h-[566px] m-0 p-0 overflow-hidden">
  <div 
    class="w-[800px] h-[566px] bg-white relative shadow-2xl overflow-hidden p-12 flex flex-col items-center justify-between"
    style="border: 1px solid ${certConfig.themeColor}30"
  >
    <!-- Decorative Elements -->
    <div class="absolute top-0 left-0 w-full h-4" style="background-color: ${certConfig.themeColor}"></div>
    <div class="absolute top-0 right-0 w-32 h-32 opacity-10" style="background: radial-gradient(circle at top right, ${certConfig.themeColor}, transparent 70%)"></div>
    <div class="absolute bottom-0 left-0 w-32 h-32 opacity-10" style="background: radial-gradient(circle at bottom left, ${certConfig.themeColor}, transparent 70%)"></div>
    
    <div class="absolute top-12 left-12">
      <div class="w-16 h-16 rounded-full flex items-center justify-center text-white" style="background-color: ${certConfig.themeColor}">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg>
      </div>
    </div>

    <!-- Content -->
    <div class="text-center mt-8 z-10 w-full flex-1 flex flex-col justify-center items-center">
      <h3 class="text-sm font-bold uppercase tracking-[0.2em] mb-8" style="color: ${certConfig.themeColor}">
        ${certConfig.institutionName}
      </h3>
      <h1 class="text-5xl font-black text-slate-800 mb-2 font-serif tracking-tight">
        Certificate of Completion
      </h1>
      <p class="text-slate-500 uppercase tracking-widest text-xs font-semibold mt-4">This is to certify that</p>
      
      <h2 class="text-4xl font-bold text-slate-900 mt-6 mb-6">
        ${studentName}
      </h2>
      
      <p class="text-slate-600 max-w-lg mx-auto text-sm leading-relaxed">
        has successfully completed the comprehensive requirements for the digital course and is hereby awarded this certificate for
      </p>
      
      <h3 class="text-2xl font-bold text-slate-800 mt-6 max-w-xl mx-auto leading-tight">
        ${course.title}
      </h3>
    </div>

    <!-- Signatures & Footer -->
    <div class="w-full flex justify-between items-end px-12 z-10 mb-4 mt-12">
      <div class="text-center w-48">
        <p class="text-sm font-bold text-slate-800">${dateStr}</p>
        <div class="w-32 h-px bg-slate-300 my-2 mx-auto"></div>
        <p class="text-[10px] uppercase font-bold tracking-wider text-slate-500">Date Issued</p>
      </div>
      
      <div class="text-center w-48">
        <div class="mb-2 w-full mx-auto" style="font-family: 'Brush Script MT', cursive, serif;">
          <span class="text-3xl text-slate-800">${certConfig.signatoryName}</span>
        </div>
        <div class="w-full h-px bg-slate-300 my-2 mx-auto"></div>
        <p class="text-xs font-bold uppercase tracking-wider text-slate-800">${certConfig.signatoryName}</p>
        <p class="text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">${certConfig.signatoryTitle}</p>
      </div>
    </div>
  </div>
</body>
</html>
      `;

      // Use Puppeteer to generate a 1:1 PDF
      const puppeteer = (await import('puppeteer')).default || await import('puppeteer');
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      
      // Set content and wait for Tailwind to process
      await page.setContent(htmlContent, { waitUntil: 'load' });
      await page.waitForNetworkIdle({ idleTime: 500 });
      
      // Generate PDF exactly at 800x566 matching the frontend UI scale
      const pdfBuffer = await page.pdf({
        width: '800px',
        height: '566px',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      });

      await browser.close();

      const base64 = Buffer.from(pdfBuffer).toString('base64');

      return { base64, filename: `Certificate_${course.title.replace(/\s+/g, '_')}.pdf` };
    } catch (error: any) {
      console.error("Error generating PDF certificate:", error);
      throw new Error(error.message);
    }
  });
