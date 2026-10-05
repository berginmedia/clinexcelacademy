import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { Logo } from "@/components/ui/logo";
import { getStudentProfileFn, downloadTranscriptFn } from "../actions/students";
import { downloadSecureCertificateFn } from "../actions/courses";
import { downloadHtmlAsPdf } from "../lib/pdfDownloader";
import { toast } from "sonner";
import { StudentSidebar } from "@/components/StudentSidebar";
import {
  Search,
  Bell,
  Download,
  Menu,
} from "lucide-react";

function StudentTranscriptPage() {
  const { user } = Route.useRouteContext();
  const { student } = Route.useLoaderData();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDownloadingTranscript, setIsDownloadingTranscript] = useState(false);
  const [downloadingCertFor, setDownloadingCertFor] = useState<string | null>(null);

  const handleDownloadTranscript = async () => {
    if (!student) return;
    setIsDownloadingTranscript(true);
    try {
      const res = await downloadTranscriptFn({
        data: { studentId: student.id, courses: student.enrolledCourses || [] },
      });
      await downloadHtmlAsPdf(res.html, res.filename, { landscape: false });
      toast.success("Transcript downloaded successfully!");
    } catch (e: any) {
      toast.error(e.message || "Failed to download transcript");
    } finally {
      setIsDownloadingTranscript(false);
    }
  };

  const handleDownloadCertificate = async (courseId: string) => {
    if (!student) return;
    setDownloadingCertFor(courseId);
    try {
      const res = await downloadSecureCertificateFn({
        data: { courseId, studentId: student.id },
      });
      await downloadHtmlAsPdf(res.html, res.filename, {
        landscape: true,
        width: 800,
        height: 566,
      });
      toast.success("Certificate downloaded successfully!");
    } catch (e: any) {
      toast.error(e.message || "Failed to download certificate");
    } finally {
      setDownloadingCertFor(null);
    }
  };

  const enrolledCourses = student?.enrolledCourses || [];
  const filteredCourses = enrolledCourses.filter((course: any) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC]">
      {/* Sidebar (Desktop aside + Mobile Sheet) */}
      <StudentSidebar
        activeRoute="/transcript"
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white text-muted-foreground transition-colors hover:bg-muted lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Transcript</h1>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-border bg-white py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition-colors hover:bg-muted">
                <Bell size={18} />
              </button>
              <ProfileDropdown seed={user?.avatarSeed || user?.name || "Student"} role="student" />
            </div>
          </div>

          {/* Section Header with Download Transcript Button */}
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-lg font-bold text-foreground">Enrolled Courses</h3>
            <button
              onClick={handleDownloadTranscript}
              disabled={isDownloadingTranscript || enrolledCourses.length === 0}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-50 transition-colors shadow-sm self-start sm:self-auto"
            >
              <Download size={16} />
              {isDownloadingTranscript ? "Downloading..." : "Download Transcript"}
            </button>
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
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground text-xs">
                      {searchQuery ? "No matching courses found." : "You are not enrolled in any courses yet."}
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course: any) => (
                    <tr key={course.courseId} className="hover:bg-muted/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <Link
                          to="/course/$courseId"
                          params={{ courseId: course.courseId }}
                          className="font-semibold text-foreground hover:text-primary transition-colors hover:underline text-xs"
                        >
                          {course.title}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {course.enrolledAt || "-"}
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {course.completedAt || "-"}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-muted-foreground">
                        {course.completedModules}/{course.totalModules} Modules
                      </td>
                      <td className="px-5 py-3.5">
                        {course.status === "completed" ? (
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
                        {course.status === "completed" ? (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}


export const Route = createFileRoute("/transcript")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
    if (context.user.role === "admin") throw redirect({ to: "/admin-dashboard" });
  },
  loader: async ({ context }) => {
    const student = await getStudentProfileFn({ data: { studentId: context.user!.userId } });
    return { student };
  },
  component: StudentTranscriptPage,
});
