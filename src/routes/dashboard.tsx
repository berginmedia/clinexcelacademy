import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { getEnrolledCoursesFn } from "../actions/courses";


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
  Download,
  ArrowRight,
} from "lucide-react";

function DashboardPage() {
  const enrolledCourses = Route.useLoaderData();
  
  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC]">
      {/* Left Sidebar (Hidden on Mobile) */}
      <aside className="hidden w-[250px] shrink-0 flex-col border-r border-border bg-white lg:flex sticky top-0 h-screen">
        <div className="flex h-20 items-center px-6">
          <Logo />
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <nav className="space-y-1">
            <SidebarItem icon={LayoutGrid} label="Home" to="/dashboard" active />
            <SidebarItem icon={Activity} label="My Skill Graph" />
            <SidebarItem icon={Bookmark} label="Bookmarks" />
            <div className="my-4" /> {/* Spacer */}
            <SidebarItem icon={BookOpen} label="Courses" to="/student-courses" />
            <SidebarItem icon={HelpCircle} label="Assessment" />
            <div className="my-4" /> {/* Spacer */}
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
            <h1 className="text-2xl font-bold text-foreground">Home</h1>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search here"
                  className="w-full rounded-full border border-border bg-white py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition-colors hover:bg-muted">
                <Bell size={18} />
              </button>
              <ProfileDropdown seed="Raymond" role="student" />
            </div>
          </div>

          {/* Welcome Banner */}
          <div className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-blue p-8 text-white shadow-card">
            <div className="relative z-10 w-full md:w-2/3">
              <h2 className="mb-2 text-2xl font-bold">Welcome back Raymond 👋</h2>
              <p className="text-sm text-white/80 leading-relaxed max-w-sm">
                Fantastic Progress! 🚀 You've mastered <br />
                <span className="font-bold text-white">89%</span> of your weekly
                learning goal!
              </p>
            </div>
            {/* Illustration */}
            <img
              src="/dashboard-banner.jpg"
              alt="Welcome Illustration"
              className="absolute -bottom-8 -right-8 h-48 w-48 object-cover mix-blend-screen opacity-90 md:-bottom-12 md:-right-4 md:h-64 md:w-64"
            />
          </div>

          {/* My Courses */}
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">My Courses</h3>
            <button className="text-sm font-semibold text-primary">View All</button>
          </div>
          <div className="mb-10 space-y-4">
            {enrolledCourses.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground bg-[#F1F5F9] rounded-2xl">
                You are not enrolled in any courses yet. Check out our recommendations below!
              </div>
            ) : (
              enrolledCourses.map((course: any, i: number) => {
                const bgColors = ["bg-orange-100", "bg-emerald-400", "bg-purple-500", "bg-blue-400"];
                const bg = bgColors[i % bgColors.length];
                
                const totalSections = course.modules?.reduce((acc: number, m: any) => acc + (m.sections?.length || 0), 0) || 0;
                const completedSectionsCount = course.completedSections?.length || 0;
                const percentage = totalSections > 0 ? Math.round((completedSectionsCount / totalSections) * 100) : 0;
                
                return (
                  <CourseListCard
                    key={course.courseId}
                    title={course.title}
                    status={percentage === 100 ? "Complete" : "On Going"}
                    progress={`${completedSectionsCount}/${totalSections}`}
                    percentage={percentage}
                    buttonLabel={percentage === 100 ? "View Certificate" : "Resume Course"}
                    linkTo="/course/$courseId"
                    linkParams={{ courseId: course.courseId }}
                    bg={bg}
                  />
                );
              })
            )}
          </div>

          {/* Recommended for you */}
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Recommended for you</h3>
            <button className="text-sm font-semibold text-primary">View All</button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CourseGridCard
              category="CODE"
              title="Create Ecommerce Website Using Laravel 10"
              author="Rian starling"
              lessons={27}
              rating={4.6}
              bg="bg-purple-500"
            />
            <CourseGridCard
              category="DESIGN"
              title="User Interface Design for Beginner"
              author="Robert"
              lessons={16}
              rating={4.2}
              bg="bg-emerald-400"
            />
            <CourseGridCard
              category="BUSINESS"
              title="Digital Marketing & E-commerce"
              author="Donna"
              lessons={31}
              rating={4.8}
              bg="bg-blue-400"
            />
          </div>
        </div>
      </main>


    </div>
  );
}

// Subcomponents

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

function CourseListCard({
  title,
  status,
  progress,
  percentage,
  buttonLabel,
  buttonIcon,
  linkTo,
  linkParams,
  bg,
}: any) {
  const isComplete = status === "Complete";
  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm sm:flex-row">
      <div className="flex w-full items-center gap-4 sm:w-auto">
        <div className={`h-16 w-16 shrink-0 rounded-xl ${bg} flex items-center justify-center p-2`}>
            {/* Generic placeholder for thumbnail */}
            <div className="h-full w-full rounded-md bg-black/10 flex flex-col justify-between p-1">
                <div className="h-2 w-full bg-white/50 rounded-sm"></div>
                <div className="h-4 w-full bg-white rounded-sm"></div>
            </div>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-foreground">{title}</h4>
          <div className="mt-2 flex items-center gap-3">
            <span
              className={`text-xs font-semibold ${
                isComplete ? "text-success" : "text-orange-500"
              }`}
            >
              {status}
            </span>
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${
                  isComplete ? "bg-success" : "bg-primary"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              {progress}
            </span>
          </div>
        </div>
      </div>
      {linkTo ? (
        <Link
          to={linkTo}
          params={linkParams}
          className={`flex w-full items-center justify-center whitespace-nowrap rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto ${
            isComplete ? "bg-primary" : "bg-primary"
          }`}
        >
          {buttonLabel} {buttonIcon && buttonIcon}
        </Link>
      ) : (
        <button
          className={`flex w-full items-center justify-center whitespace-nowrap rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto ${
            isComplete ? "bg-primary" : "bg-primary"
          }`}
        >
          {buttonLabel} {buttonIcon && buttonIcon}
        </button>
      )}
    </div>
  );
}

function CourseGridCard({ category, title, author, lessons, rating, bg }: any) {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-card">
      <div className={`h-40 w-full ${bg} p-6 relative`}>
        {/* Abstract shapes for course cover */}
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
            <BookOpen size={14} />
            {lessons} Lesson
          </div>
          <div className="flex items-center gap-1 text-orange-500">
            ⭐ {rating}
          </div>
        </div>
      </div>
    </div>
  );
}

function LeaderboardRow({ rank, name, points, seed }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="w-4 text-center text-sm font-bold text-muted-foreground">
          {rank}
        </span>
        <div className="h-8 w-8 overflow-hidden rounded-full bg-muted">
          <img
            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
        <span className="text-sm font-semibold text-foreground">{name}</span>
      </div>
      <div className="flex items-center gap-1 text-sm font-bold text-primary">
        ✨ {points}
      </div>
    </div>
  );
}


export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
    if (context.user.role === "admin") throw redirect({ to: "/admin-dashboard" });
  },
  loader: async () => await getEnrolledCoursesFn(),
  component: DashboardPage,
});
