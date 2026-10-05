import { useState } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { Logo } from "@/components/ui/logo";
import { AdminSidebar } from "@/components/AdminSidebar";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import {
  Users,
  TrendingUp,
  Award,
  Search,
  Bell,
  Menu,
  BookOpen as BookOpenIcon,
} from "lucide-react";

export const Route = createFileRoute("/admin-dashboard")({
  beforeLoad: ({ context, location }) => {
    if (!context.user || context.user.role !== "admin") {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AdminDashboardPage,
});

const revenueData = [
  { name: 'Jan', revenue: 4200 },
  { name: 'Feb', revenue: 3800 },
  { name: 'Mar', revenue: 5100 },
  { name: 'Apr', revenue: 4800 },
  { name: 'May', revenue: 6200 },
  { name: 'Jun', revenue: 5900 },
];

const enrollmentData = [
  { name: 'Web Design', students: 120 },
  { name: 'Marketing', students: 85 },
  { name: 'Data Science', students: 60 },
  { name: 'UI/UX', students: 95 },
  { name: 'Business', students: 70 },
];

function AdminDashboardPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC]">
      {/* Sidebar (Desktop aside + Mobile Sheet) */}
      <AdminSidebar
        activeRoute="/admin-dashboard"
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
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
            
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
              <ProfileDropdown seed="AdminUser" role="admin" />
            </div>
          </div>

          {/* KPI Metric Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <MetricCard 
              title="Total Revenue" 
              value="$24,500" 
              trend="+15%" 
              trendUp={true} 
              icon={<TrendingUp size={20} className="text-blue-600" />} 
              bg="bg-blue-50" 
            />
            <MetricCard 
              title="Active Students" 
              value="1,248" 
              trend="+8%" 
              trendUp={true} 
              icon={<Users size={20} className="text-emerald-600" />} 
              bg="bg-emerald-50" 
            />
            <MetricCard 
              title="Course Completions" 
              value="842" 
              trend="+22%" 
              trendUp={true} 
              icon={<Award size={20} className="text-orange-600" />} 
              bg="bg-orange-50" 
            />
            <MetricCard 
              title="Active Courses" 
              value="12" 
              trend="0%" 
              trendUp={true} 
              icon={<BookOpenIcon size={20} className="text-purple-600" />} 
              bg="bg-purple-50" 
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-8">
            
            {/* Revenue Line Chart */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-bold text-foreground">Revenue Overview</h3>
              <div className="h-[240px] w-full" style={{ fontFamily: 'inherit' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={revenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12, fontFamily: 'inherit' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12, fontFamily: 'inherit' }} dx={-10} tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'inherit' }}
                      itemStyle={{ color: '#0F172A', fontWeight: 600, fontFamily: 'inherit' }}
                    />
                    <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Enrollments Bar Chart */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-bold text-foreground">Course Enrollments by Category</h3>
              <div className="h-[240px] w-full" style={{ fontFamily: 'inherit' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={enrollmentData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    barSize={40}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12, fontFamily: 'inherit' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12, fontFamily: 'inherit' }} dx={-10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'inherit' }}
                      itemStyle={{ color: '#0F172A', fontWeight: 600, fontFamily: 'inherit' }}
                      cursor={{ fill: '#F1F5F9' }}
                    />
                    <Bar dataKey="students" name="Active Students" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

// Subcomponents


function MetricCard({ title, value, trend, trendUp, icon, bg }: any) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${trendUp ? 'text-success' : 'text-red-500'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-muted-foreground mb-1">{title}</h4>
        <div className="text-2xl font-bold text-foreground">{value}</div>
      </div>
    </div>
  );
}
