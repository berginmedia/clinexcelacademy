import { useState, useEffect } from "react";
import { HelpCircle, Clock, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { getQuizAttemptFn, startQuizFn, submitQuizFn } from "../actions/quiz";

export function QuizExecution({ courseId, sectionId = "final-quiz", quizConfig, onPass }: { courseId: string, sectionId?: string, quizConfig: any, onPass?: () => void }) {
  const [attempt, setAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAttempt();
  }, [courseId, sectionId]);

  const fetchAttempt = async () => {
    setLoading(true);
    try {
      const existing = await getQuizAttemptFn({ data: { courseId, sectionId } });
      setAttempt(existing);
      if (existing && existing.status === 'in_progress') {
        const start = new Date(existing.startTime).getTime();
        const limit = (quizConfig.timeLimit || 10) * 60 * 1000;
        const remaining = Math.floor((limit - (Date.now() - start)) / 1000);
        setTimeLeft(remaining > 0 ? remaining : 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (attempt?.status === 'in_progress' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [attempt, timeLeft]);

  const handleStart = async () => {
    setLoading(true);
    try {
      const newAttempt = await startQuizFn({ data: { courseId, sectionId } });
      setAttempt(newAttempt);
      const limit = (quizConfig.timeLimit || 10) * 60 * 1000;
      setTimeLeft(limit / 1000);
      setAnswers({});
    } catch (e: any) {
      alert("Error starting quiz: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!confirm("Are you sure you want to submit your answers?")) return;
    await submitAnswers();
  };

  const handleAutoSubmit = async () => {
    alert("Time is up! Your quiz will be automatically submitted.");
    await submitAnswers();
  };

  const submitAnswers = async () => {
    setIsSubmitting(true);
    try {
      const res = await submitQuizFn({ data: { attemptId: attempt._id, answers } });
      setAttempt(res);
      if (res.status === 'passed') {
        onPass?.();
      }
    } catch (e: any) {
      alert("Error submitting: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return (
    <div className="flex h-full flex-col items-center justify-center p-8 bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  );

  if (!attempt || attempt.status === 'in_progress' && timeLeft <= 0 && Object.keys(answers).length === 0) {
    // If timeLeft <= 0 here but we haven't submitted, they opened an expired session.
    // In a robust app, we'd submit it empty. For now, we can just let them "start" which might fetch it and auto-submit.
    // Or if !attempt, show landing page.
  }

  if (!attempt) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 sm:p-8 text-center bg-white">
        <div className="mb-6 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-blue-50 text-primary">
          <HelpCircle size={40} className="sm:w-12 sm:h-12" />
        </div>
        <h3 className="mb-2 text-2xl sm:text-3xl font-bold text-foreground">Final Assessment</h3>
        <p className="mb-8 max-w-md text-sm sm:text-base text-muted-foreground leading-relaxed px-2">
          This final quiz tests your knowledge of the entire course. You will be given <strong>{quizConfig.displayCount || 10} questions</strong> and have <strong>{quizConfig.timeLimit || 10} minutes</strong> to complete them. You need <strong>{quizConfig.passPercentage || 70}%</strong> to pass.
        </p>
        <button onClick={handleStart} className="rounded-xl bg-primary px-8 py-3.5 font-bold text-white shadow-sm transition-opacity hover:opacity-90 text-base sm:text-lg flex items-center justify-center gap-2 w-full sm:w-auto">
          Start Quiz
        </button>
      </div>
    );
  }

  if (attempt.status === 'in_progress') {
    return (
      <div className="flex h-full flex-col bg-white overflow-hidden relative">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-4 sm:px-8 py-3 sm:py-4 shadow-sm">
          <h3 className="text-base sm:text-xl font-bold truncate">Final Assessment</h3>
          <div className={`flex items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-bold shrink-0 ${timeLeft < 60 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-[#F1F5F9] text-foreground'}`}>
            <Clock size={15} />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#F8FAFC]">
          <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 pb-24">
            {attempt.questions.map((q: any, i: number) => (
              <div key={q.questionId} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-border">
                <h4 className="text-base sm:text-lg font-bold text-foreground mb-4 flex gap-2.5 sm:gap-3 leading-snug">
                  <span className="text-primary shrink-0">{i + 1}.</span> <span>{q.text}</span>
                </h4>
                <div className="space-y-2.5 sm:space-y-3 sm:pl-7">
                  {q.options.map((opt: string, optIdx: number) => (
                    <label key={optIdx} className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${answers[q.questionId] === optIdx ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                      <input 
                        type="radio" 
                        name={q.questionId} 
                        value={optIdx}
                        checked={answers[q.questionId] === optIdx}
                        onChange={() => setAnswers(prev => ({ ...prev, [q.questionId]: optIdx }))}
                        className="w-4 h-4 text-primary shrink-0"
                      />
                      <span className="font-medium text-sm sm:text-base text-foreground leading-normal">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-white p-3 sm:p-4 flex justify-center shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.05)]">
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="rounded-xl bg-primary px-6 sm:px-12 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50 w-full sm:w-auto text-center"
          >
            {isSubmitting ? "Submitting..." : "Submit Answers"}
          </button>
        </div>
      </div>
    );
  }

  // Finished state
  const passed = attempt.status === 'passed';
  
  return (
    <div className="flex h-full flex-col items-center justify-center p-4 sm:p-8 text-center bg-white">
      <div className={`mb-6 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full ${passed ? 'bg-success/10 text-success' : 'bg-red-50 text-red-500'}`}>
        {passed ? <CheckCircle2 size={40} className="sm:w-12 sm:h-12" /> : <XCircle size={40} className="sm:w-12 sm:h-12" />}
      </div>
      <h3 className="mb-2 text-2xl sm:text-4xl font-black text-foreground">
        {passed ? "Congratulations!" : "Keep Trying!"}
      </h3>
      <p className="text-base sm:text-lg font-medium text-muted-foreground mb-8">
        You scored <span className={`font-bold ${passed ? 'text-success' : 'text-red-500'}`}>{attempt.score}%</span>. 
        (Required: {quizConfig.passPercentage || 70}%)
      </p>

      {!passed ? (
        <button onClick={handleStart} className="rounded-xl bg-primary px-8 py-3.5 font-bold text-white shadow-sm transition-opacity hover:opacity-90 w-full sm:w-auto">
          Retake Quiz
        </button>
      ) : (
        <div className="rounded-2xl border border-success/20 bg-success/5 p-4 sm:p-6 max-w-md w-full">
          <p className="text-sm font-bold text-success mb-2">Quiz Passed</p>
          <p className="text-xs text-success/80">You have successfully completed this course! Your certificate is now available.</p>
        </div>
      )}
    </div>
  );
}
