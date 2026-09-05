import { Link, createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { useState } from "react";
import { toast } from "sonner";


import { Logo } from "@/components/ui/logo";
import {
  LayoutGrid,
  Activity,
  Bookmark,
  BookOpen,
  Trophy,
  Calendar,
  Briefcase,
  DollarSign,
  Headphones,
  Settings,
  Search,
  Bell,
  Crown,
  Users,
  ChevronRight,
  Plus
} from "lucide-react";

import { getStudentsFn, createStudentFn } from "../actions/students";

export const Route = createFileRoute('/admin-students')({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
    if (context.user.role !== "admin") throw redirect({ to: "/dashboard" });
  },
  component: AdminStudentsPage,
  loader: async () => await getStudentsFn(),
});

function AdminStudentsPage() {
  const students = Route.useLoaderData();
  const router = useRouter();

  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createStudentFn({ data: newStudent });
      toast.success("Student created successfully!");
      setIsAddStudentModalOpen(false);
      setNewStudent({ name: "", email: "", password: "" });
      router.invalidate();
    } catch (error: any) {
      window.alert(error.message || "Failed to create student");
      toast.error(error.message || "Failed to create student");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC]">
      {/* Left Sidebar */}
      <aside className="hidden w-[250px] shrink-0 flex-col border-r border-border bg-white lg:flex sticky top-0 h-screen">
        <div className="flex h-20 items-center px-6">
          <Logo />
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <nav className="space-y-1">
            <SidebarItem icon={LayoutGrid} label="Home" to="/admin-dashboard" />
            <SidebarItem icon={Bookmark} label="Bookmarks" />
            <div className="my-4" />
            <SidebarItem icon={BookOpen} label="All Courses" to="/admin-courses" />
            <SidebarItem icon={Users} label="Manage Students" to="/admin-students" active />
            <div className="my-4" />
            <SidebarItem icon={Headphones} label="Support" />
            <SidebarItem icon={Settings} label="Settings" />
          </nav>
        </div>
        <div className="p-4">
          <div className="rounded-2xl bg-[#F1F5F9] p-5">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-bold text-foreground">Go Premium!</h4>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-[#0066FF]">
                <Crown size={16} />
              </div>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              Explore All Course and challenges lifetime
            </p>
            <button className="w-full rounded-xl bg-gradient-blue py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
              Get Access &rarr;
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-foreground">Manage Students</h1>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button 
                onClick={() => setIsAddStudentModalOpen(true)}
                className="hidden sm:flex h-10 items-center gap-2 rounded-full bg-gradient-blue px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <Plus size={16} />
                Add Student
              </button>
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full rounded-full border border-border bg-white py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <button 
                onClick={() => setIsAddStudentModalOpen(true)}
                className="sm:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-blue text-white transition-opacity hover:opacity-90"
              >
                <Plus size={18} />
              </button>
              <button className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition-colors hover:bg-muted">
                <Bell size={18} />
              </button>
              <ProfileDropdown seed="AdminUser" role="admin" />
            </div>
          </div>

          {/* Student List */}
          <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-4 border-b border-border bg-[#F1F5F9]/50 px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <div className="col-span-5 sm:col-span-4">Student</div>
              <div className="hidden sm:block sm:col-span-3">Joined Date</div>
              <div className="col-span-4 sm:col-span-4 text-center">Course Stats</div>
              <div className="col-span-3 sm:col-span-1 text-right">Action</div>
            </div>
            
            <div className="divide-y divide-border">
              {students.map((student: any) => (
                <div key={student.id} className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-muted/30 transition-colors">
                  <div className="col-span-5 sm:col-span-4 flex items-center gap-4">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                      <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${student.seed}`} alt={student.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                        {student.name}
                        {student.suspended && <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-700">Suspended</span>}
                      </h4>
                      <p className="text-xs text-muted-foreground">{student.email}</p>
                    </div>
                  </div>
                  
                  <div className="hidden sm:block sm:col-span-3 text-sm text-muted-foreground">
                    {student.joined}
                  </div>
                  
                  <div className="col-span-4 sm:col-span-4 flex items-center justify-center gap-6 text-sm font-medium">
                    <div className="flex flex-col items-center">
                      <span className="text-foreground">{student.activeCourses}</span>
                      <span className="text-[10px] uppercase text-muted-foreground">Active</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-success">{student.completed}</span>
                      <span className="text-[10px] uppercase text-muted-foreground">Done</span>
                    </div>
                  </div>
                  
                  <div className="col-span-3 sm:col-span-1 flex justify-end">
                    <Link to="/admin-student-profile/$studentId" params={{ studentId: student.id }} className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-primary transition-colors hover:bg-primary hover:text-white">
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Add Student Modal */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl relative z-50">
            <h3 className="text-xl font-bold text-foreground mb-4">Add New Student</h3>
            <form onSubmit={handleCreateStudent}>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-semibold text-foreground">Full Name</label>
                <input
                  type="text"
                  required
                  value={newStudent.name}
                  onChange={(e) => setNewStudent(s => ({ ...s, name: e.target.value }))}
                  className="w-full rounded-xl border border-border px-4 py-2.5 focus:border-primary focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-semibold text-foreground">Email</label>
                <input
                  type="email"
                  required
                  value={newStudent.email}
                  onChange={(e) => setNewStudent(s => ({ ...s, email: e.target.value }))}
                  className="w-full rounded-xl border border-border px-4 py-2.5 focus:border-primary focus:outline-none"
                  placeholder="john@example.com"
                />
              </div>
              <div className="mb-6">
                <label className="mb-1 block text-sm font-semibold text-foreground">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newStudent.password}
                  onChange={(e) => setNewStudent(s => ({ ...s, password: e.target.value }))}
                  className="w-full rounded-xl border border-border px-4 py-2.5 focus:border-primary focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddStudentModalOpen(false)}
                  className="flex-1 rounded-xl border border-border bg-white py-2.5 font-bold text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-gradient-blue py-2.5 font-bold text-white hover:opacity-90 disabled:opacity-70 transition-opacity"
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active, to }: { icon: any; label: string; active?: boolean; to?: string }) {
  const content = (
    <>
      <Icon size={18} className={active ? "text-primary" : "text-muted-foreground"} />
      {label}
    </>
  );

  const className = `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
    active
      ? "bg-blue-50 text-primary"
      : "text-muted-foreground hover:bg-[#F1F5F9] hover:text-foreground"
  }`;

  if (to) {
    return <Link to={to} className={className}>{content}</Link>;
  }

  return (
    <a href="#" className={className}>
      {content}
    </a>
  );
}


