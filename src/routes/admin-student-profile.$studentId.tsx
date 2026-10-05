import { Link, createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { 
  ArrowLeft,
  BookOpen,
  Award,
  Clock,
  Download,
  Mail
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { getStudentProfileFn, toggleSuspendUserFn, resetStudentPasswordFn, enrollStudentFn, downloadTranscriptFn } from "../actions/students";
import { getCoursesFn, downloadSecureCertificateFn } from "../actions/courses";
import { downloadHtmlAsPdf } from "../lib/pdfDownloader";
import { toast } from "sonner";

export const Route = createFileRoute('/admin-student-profile/$studentId')({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
    if (context.user.role !== "admin") throw redirect({ to: "/dashboard" });
  },
  component: AdminStudentProfilePage,
  loader: async ({ params }) => {
    const [profile, allCourses] = await Promise.all([
      getStudentProfileFn({ data: { studentId: params.studentId } }),
      getCoursesFn()
    ]);
    return { profile, allCourses };
  }
});

function AdminStudentProfilePage() {
  const { studentId } = Route.useParams();
  const { profile: student, allCourses } = Route.useLoaderData() as any;
  const router = useRouter();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuspend = async () => {
    try {
      await toggleSuspendUserFn({ data: { studentId } });
      router.invalidate();
      window.alert(student.suspended ? "User unsuspended successfully!" : "User suspended successfully!");
    } catch (e: any) {
      window.alert("Error toggling suspend: " + e.message);
      console.error(e);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    try {
      await resetStudentPasswordFn({ data: { studentId, newPassword } });
      setIsResetModalOpen(false);
      setNewPassword("");
      setConfirmPassword("");
      setResetError("");
      window.alert("Password reset successfully! The student has been logged out from all devices.");
    } catch (error: any) {
      setResetError("Failed to reset password: " + error.message);
      window.alert("Error resetting password: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isDownloadingTranscript, setIsDownloadingTranscript] = useState(false);
  const [downloadingCertFor, setDownloadingCertFor] = useState<string | null>(null);

  const [courseSearchQuery, setCourseSearchQuery] = useState("");

  const unEnrolledCourses = allCourses.filter(
    (c: any) => !student?.enrolledCourses?.some((ec: any) => ec.courseId === c.courseId)
  );

  const availableCourses = unEnrolledCourses.filter(
    (c: any) => c.title.toLowerCase().includes(courseSearchQuery.toLowerCase())
  );

  const handleEnroll = async (courseId: string) => {
    if (!courseId) return;
    setIsEnrolling(true);
    try {
      await enrollStudentFn({ data: { studentId, courseId } });
      toast.success("Enrolled successfully");
      setIsAddCourseModalOpen(false);
      setCourseSearchQuery("");
      router.invalidate();
    } catch (e: any) {
      window.alert(e.message || "Failed to enroll");
      toast.error(e.message || "Failed to enroll");
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleDownloadTranscript = async () => {
    setIsDownloadingTranscript(true);
    try {
      const res = await downloadTranscriptFn({ data: { studentId, courses: student.enrolledCourses } });
      await downloadHtmlAsPdf(res.html, res.filename, { landscape: false });
      toast.success("Transcript downloaded successfully!");
    } catch (e: any) {
      toast.error(e.message || "Failed to download transcript");
    } finally {
      setIsDownloadingTranscript(false);
    }
  };

  const handleDownloadCertificate = async (courseId: string) => {
    setDownloadingCertFor(courseId);
    try {
      const res = await downloadSecureCertificateFn({ data: { courseId, studentId } });
      await downloadHtmlAsPdf(res.html, res.filename, { landscape: true, width: 800, height: 566 });
      toast.success("Certificate downloaded successfully!");
    } catch (e: any) {
      toast.error(e.message || "Failed to download certificate");
    } finally {
      setDownloadingCertFor(null);
    }
  };

  if (!student) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Student Not Found</h2>
          <Link to="/admin-students" className="mt-4 text-primary hover:underline">Return to Students</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-[#F8FAFC]">
      {/* Top Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <Link to="/admin-students" className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#F1F5F9] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <ArrowLeft size={18} />
          </Link>
          <div className="h-6 w-px bg-border shrink-0"></div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-foreground truncate">Student Profile</h1>
            <span className="text-[11px] sm:text-xs text-muted-foreground truncate">ID: #{studentId.slice(-4)}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <Logo />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          
          {/* Profile Header Card */}
          <div className="mb-8 flex flex-col gap-6 rounded-3xl bg-white p-5 sm:p-8 shadow-sm lg:flex-row lg:items-center lg:justify-between border border-border relative overflow-hidden">
             {/* Decorative Background */}
             <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-50 to-transparent pointer-events-none"></div>
             
             <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-4 sm:gap-6 relative z-10 text-center sm:text-left">
                <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-md bg-muted">
                  <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${student.seed}`} alt={student.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground break-words">{student.name}</h2>
                    {student.suspended && (
                      <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-bold text-yellow-700">
                        Suspended
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-1.5 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                     <span className="flex items-center justify-center sm:justify-start gap-1.5 break-all sm:break-normal"><Mail size={14} className="shrink-0" /> {student.email}</span>
                     <span className="flex items-center justify-center sm:justify-start gap-1.5 shrink-0"><Clock size={14} className="shrink-0" /> Last active: {student.lastActive}</span>
                  </div>
                </div>
             </div>
             
             <div className="relative z-10 flex flex-wrap sm:flex-nowrap gap-2.5 sm:gap-3 w-full lg:w-auto">
                <button 
                  onClick={() => setIsResetModalOpen(true)}
                  className="flex-1 lg:flex-initial text-center rounded-xl border border-border bg-white px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-foreground shadow-sm hover:bg-muted transition-colors"
                >
                  Reset Password
                </button>
                <button 
                  onClick={handleSuspend}
                  className={`flex-1 lg:flex-initial text-center rounded-xl px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-sm transition-colors ${
                    student.suspended 
                      ? "bg-green-50 text-green-600 hover:bg-green-100" 
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  }`}
                >
                  {student.suspended ? "Unsuspend User" : "Suspend User"}
                </button>
             </div>
          </div>

          {/* Reset Password Modal */}
          {isResetModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl relative z-50">
                <h3 className="text-xl font-bold text-foreground mb-4">Reset Password</h3>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">New Password</label>
                    <input 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-xl border border-border px-4 py-2.5 focus:border-primary focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Re-enter Password</label>
                    <input 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-border px-4 py-2.5 focus:border-primary focus:outline-none"
                      required
                    />
                  </div>
                  {resetError && <p className="text-sm text-red-500 font-medium">{resetError}</p>}
                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setIsResetModalOpen(false)}
                      className="flex-1 rounded-xl border border-border bg-white py-2.5 font-bold text-foreground hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 rounded-xl bg-gradient-blue py-2.5 font-bold text-white hover:opacity-90 disabled:opacity-70"
                    >
                      {isSubmitting ? "Resetting..." : "Reset"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-lg font-bold text-foreground">Enrolled Courses</h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={handleDownloadTranscript}
                disabled={isDownloadingTranscript}
                className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-50 transition-colors shadow-sm"
              >
                <Download size={16} />
                <span>{isDownloadingTranscript ? "Downloading..." : "Download Transcript"}</span>
              </button>
              <button
                onClick={() => setIsAddCourseModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-gradient-blue px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-sm"
              >
                <span>+ Add course</span>
              </button>
            </div>
          </div>

          {/* Courses Table */}
          <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-sm mb-10">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead className="bg-muted/70 text-muted-foreground border-b border-border text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Course</th>
                  <th className="px-5 py-3.5">Date Enrolled</th>
                  <th className="px-5 py-3.5">Date Completed</th>
                  <th className="px-5 py-3.5">Progress</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Score</th>
                  <th className="px-5 py-3.5 text-right">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {student.enrolledCourses?.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground text-xs">
                      This student is not enrolled in any courses yet.
                    </td>
                  </tr>
                )}
                
                {student.enrolledCourses?.map((course: any) => (
                  <tr key={course.courseId} className="hover:bg-muted/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link 
                        to="/admin-course-builder/$courseId" 
                        params={{ courseId: course.courseId }}
                        className="font-semibold text-foreground hover:text-primary transition-colors hover:underline text-xs"
                      >
                        {course.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {course.enrolledAt}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {course.completedAt || '-'}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-muted-foreground">
                      {course.completedModules}/{course.totalModules} Modules
                    </td>
                    <td className="px-5 py-3.5">
                      {course.status === 'completed' ? (
                        <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                          Complete
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-700">
                          Incomplete
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-foreground">
                      {course.score}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {course.status === 'completed' ? (
                        <button 
                          onClick={() => handleDownloadCertificate(course.courseId)}
                          disabled={downloadingCertFor === course.courseId}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-success/10 text-success hover:bg-success/20 disabled:opacity-50 transition-colors"
                          title="Download Certificate"
                        >
                          <Download size={14} />
                        </button>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Course Modal */}
          {isAddCourseModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl relative z-50">
                <h3 className="text-xl font-bold text-foreground mb-4">Enroll in Course</h3>
                
                {unEnrolledCourses.length === 0 ? (
                  <p className="text-muted-foreground mb-6">Student is already enrolled in all available courses.</p>
                ) : (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-2">Search Course</label>
                    <input 
                      type="text"
                      placeholder="Search by course name..."
                      value={courseSearchQuery}
                      onChange={(e) => setCourseSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-border px-4 py-2.5 mb-3 focus:border-primary focus:outline-none text-sm"
                    />
                    
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                      {availableCourses.map((c: any) => (
                        <div key={c.courseId} className="flex items-center justify-between rounded-xl border border-border p-3 hover:bg-muted/50 transition-colors">
                          <span className="font-semibold text-sm text-foreground">{c.title}</span>
                          <button
                            onClick={() => handleEnroll(c.courseId)}
                            disabled={isEnrolling}
                            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white hover:opacity-90 disabled:opacity-50"
                          >
                            Enroll
                          </button>
                        </div>
                      ))}
                    </div>

                    {availableCourses.length === 0 && courseSearchQuery && (
                      <p className="text-xs text-muted-foreground mt-2 text-center">No courses match your search.</p>
                    )}
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsAddCourseModalOpen(false);
                      setCourseSearchQuery("");
                    }}
                    className="w-full rounded-xl border border-border bg-white py-2.5 font-bold text-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
