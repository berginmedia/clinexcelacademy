import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";


import { Logo } from "@/components/ui/logo";
import {
  LayoutGrid,
  Activity,
  Bookmark,
  BookOpen,
  HelpCircle,
  Trophy,
  Calendar,
  Briefcase,
  DollarSign,
  Headphones,
  Settings,
  Search,
  Bell,
  Crown,
  BookOpen as BookOpenIcon,
  Plus,
  Users
} from "lucide-react";

function AdminCoursesPage() {
  const courses = Route.useLoaderData();
  
  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC]">
      {/* Left Sidebar (Hidden on Mobile) */}
      <aside className="hidden w-[250px] shrink-0 flex-col border-r border-border bg-white lg:flex sticky top-0 h-screen">
        <div className="flex h-20 items-center px-6">
          <Logo />
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <nav className="space-y-1">
            <SidebarItem icon={LayoutGrid} label="Home" to="/admin-dashboard" />
            <SidebarItem icon={Bookmark} label="Bookmarks" />
            <div className="my-4" />
            <SidebarItem icon={BookOpen} label="All Courses" to="/admin-courses" active />
            <SidebarItem icon={Users} label="Manage Students" to="/admin-students" />
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

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-foreground">All Courses</h1>
                <Link to="/admin-course-builder/$courseId" params={{ courseId: 'new' }} className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:bg-primary/90 shadow-sm">
                    <Plus size={16} /> Create Course
                </Link>
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full rounded-full border border-border bg-white py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition-colors hover:bg-muted">
                <Bell size={18} />
              </button>
              <ProfileDropdown seed="AdminUser" role="admin" />
            </div>
          </div>

          {/* All Courses Grid (Clicking goes to Builder) */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course: any) => {
              const lessonCount = course.modules?.reduce((acc: number, mod: any) => acc + (mod.sections?.length || 0), 0) || 0;
              return (
                <CourseGridCard
                  key={course.courseId}
                  category={course.category}
                  title={course.title}
                  author={course.author}
                  lessons={lessonCount}
                  rating={course.rating}
                  bg={course.bg || "bg-blue-50"}
                  linkTo="/admin-course-builder/$courseId"
                  linkParams={{ courseId: course.courseId }}
                />
              );
            })}
          </div>
        </div>
      </main>
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

function CourseGridCard({ category, title, author, lessons, rating, bg, linkTo, linkParams }: any) {
  return (
    <Link to={linkTo || "#"} params={linkParams} className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-card block">
      <div className={`h-40 w-full ${bg} p-6 relative`}>
        <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-32 h-24 bg-black/20 rounded-lg backdrop-blur-sm border border-white/10 flex flex-col p-2 gap-1">
                <div className="w-1/3 h-2 bg-white/40 rounded-full"></div>
                <div className="w-2/3 h-2 bg-white/20 rounded-full"></div>
                <div className="w-1/2 h-2 bg-white/20 rounded-full"></div>
             </div>
        </div>
      </div>
      <div className="p-5">
        <span className="mb-2 block text-xs font-bold tracking-wider text-primary">
          {category}
        </span>
        <h4 className="mb-1 line-clamp-2 min-h-[48px] font-bold text-foreground">
          {title}
        </h4>
        <p className="mb-4 text-xs text-muted-foreground">by {author}</p>
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <BookOpenIcon size={14} />
            {lessons} Lesson
          </div>
          <div className="flex items-center gap-1 text-orange-500">
            ⭐ {rating}
          </div>
        </div>
      </div>
    </Link>
  );
}


export const Route = createFileRoute('/admin-courses')({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
    if (context.user.role !== "admin") throw redirect({ to: "/dashboard" });
  },
  component: AdminCoursesPage,
  loader: async () => {
    const { getCoursesFn } = await import('../actions/courses');
    return await getCoursesFn();
  }
});
