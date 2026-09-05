import { createServerFn } from "@tanstack/react-start";
import { connectDB } from "../lib/db";
import { QuizAttempt } from "../lib/models/QuizAttempt";
import { Course } from "../lib/models/Course";
import { getAuthSessionFn } from "../lib/auth";

export const getQuizAttemptFn = createServerFn({ method: "GET" })
  .validator((data: { courseId: string, sectionId?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const session = await getAuthSessionFn();
      if (!session) throw new Error("Unauthorized");

      await connectDB();
      const attempt = await QuizAttempt.findOne({ 
        studentId: session.userId, 
        courseId: data.courseId,
        sectionId: data.sectionId || "final-quiz"
      }).sort({ createdAt: -1 }).lean(); // Get most recent attempt

      return attempt ? JSON.parse(JSON.stringify(attempt)) : null;
    } catch (error: any) {
      console.error("Error fetching quiz attempt:", error);
      throw new Error(error.message);
    }
  });

export const startQuizFn = createServerFn({ method: "POST" })
  .validator((data: { courseId: string, sectionId?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const session = await getAuthSessionFn();
      if (!session) throw new Error("Unauthorized");

      await connectDB();
      
      const course = await Course.findOne({ courseId: data.courseId }).lean();
      if (!course) throw new Error("Course not found");

      const sId = data.sectionId || "final-quiz";

      let targetQuizConfig = null;
      if (sId === "final-quiz") {
        targetQuizConfig = course.quiz;
      } else {
        // Find the module section quiz
        for (const mod of course.modules || []) {
          const sec = mod.sections?.find((s: any) => (s._id?.toString() || s.id) === sId);
          if (sec) {
            targetQuizConfig = sec.quiz || { questions: [], timeLimit: 10, passPercentage: 70, displayCount: 10 };
            break;
          }
        }
      }

      if (!targetQuizConfig) throw new Error("Quiz not found");

      // Check if there is an in_progress attempt
      const existing = await QuizAttempt.findOne({ 
        studentId: session.userId, 
        courseId: data.courseId,
        sectionId: sId,
        status: "in_progress"
      });

      if (existing) {
        return JSON.parse(JSON.stringify(existing));
      }

      const allQuestions = targetQuizConfig.questions || [];
      const displayCount = Math.min(targetQuizConfig.displayCount || 10, allQuestions.length);

      // Randomly select `displayCount` questions
      const shuffledQuestions = [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, displayCount);

      // Prepare question attempts (shuffle options)
      const questionAttempts = shuffledQuestions.map((q: any) => {
        // Map options to objects with original index
        const optionsWithIndices = q.options.map((opt: string, idx: number) => ({ text: opt, originalIdx: idx }));
        // Shuffle options
        optionsWithIndices.sort(() => 0.5 - Math.random());
        
        return {
          questionId: q.id || q._id.toString(),
          text: q.text || q.question, // handling both possible schemas
          options: optionsWithIndices.map((o: any) => o.text),
          originalOptionIndices: optionsWithIndices.map((o: any) => o.originalIdx),
        };
      });

      const newAttempt = new QuizAttempt({
        studentId: session.userId,
        courseId: data.courseId,
        sectionId: sId,
        startTime: new Date(),
        status: "in_progress",
        questions: questionAttempts
      });

      await newAttempt.save();
      return JSON.parse(JSON.stringify(newAttempt));
    } catch (error: any) {
      console.error("Error starting quiz:", error);
      throw new Error(error.message);
    }
  });

export const submitQuizFn = createServerFn({ method: "POST" })
  .validator((data: { attemptId: string; answers: Record<string, number> }) => data)
  .handler(async ({ data }) => {
    try {
      const session = await getAuthSessionFn();
      if (!session) throw new Error("Unauthorized");

      await connectDB();
      const attempt = await QuizAttempt.findById(data.attemptId);
      if (!attempt) throw new Error("Attempt not found");
      if (attempt.studentId !== session.userId) throw new Error("Unauthorized");
      if (attempt.status !== "in_progress") return JSON.parse(JSON.stringify(attempt)); // already submitted

      const course = await Course.findOne({ courseId: attempt.courseId }).lean();
      if (!course) throw new Error("Course not found");

      const sId = attempt.sectionId || "final-quiz";
      let targetQuizConfig: any = null;
      if (sId === "final-quiz") {
        targetQuizConfig = course.quiz;
      } else {
        // Find the module section quiz
        for (const mod of course.modules || []) {
          const sec = mod.sections?.find((s: any) => (s._id?.toString() || s.id) === sId);
          if (sec) {
            targetQuizConfig = sec.quiz || { questions: [], timeLimit: 10, passPercentage: 70, displayCount: 10 };
            break;
          }
        }
      }

      if (!targetQuizConfig) throw new Error("Quiz not found");

      // Validate time limit
      const timeElapsedMins = (Date.now() - attempt.startTime.getTime()) / 60000;
      const timeLimitMins = targetQuizConfig.timeLimit || 10;
      
      // Allow 1 minute grace period for network delays
      if (timeElapsedMins > timeLimitMins + 1) {
        // Time expired! Mark whatever they answered (or didn't)
      }

      let correctCount = 0;
      const totalQuestions = attempt.questions.length;

      // Grade it
      attempt.questions.forEach((qAttempt: any) => {
        const selectedShuffledIndex = data.answers[qAttempt.questionId];
        
        if (selectedShuffledIndex !== undefined) {
          qAttempt.selectedOptionIndex = selectedShuffledIndex;
          
          const originalSelectedIdx = qAttempt.originalOptionIndices[selectedShuffledIndex];
          const originalQuestion = targetQuizConfig.questions?.find((q: any) => (q.id || q._id?.toString()) === qAttempt.questionId);
          
          if (originalQuestion && originalSelectedIdx === originalQuestion.correctOptionIndex) {
            correctCount++;
          }
        }
      });

      const score = Math.round((correctCount / totalQuestions) * 100);
      const passed = score >= (targetQuizConfig.passPercentage || 70);

      attempt.score = score;
      attempt.status = passed ? "passed" : "failed";
      attempt.completedAt = new Date();

      await attempt.save();
      return JSON.parse(JSON.stringify(attempt));

    } catch (error: any) {
      console.error("Error submitting quiz:", error);
      throw new Error(error.message);
    }
  });
