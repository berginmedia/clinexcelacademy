import { createFileRoute, useNavigate, redirect, useRouter } from "@tanstack/react-router";
import { Logo } from "@/components/ui/logo";
import { Mail, CheckCircle2, Lock } from "lucide-react";
import { useState } from "react";
import { loginFn } from "../lib/auth";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if (context.user) {
      if (context.user.role === "admin") {
        throw redirect({ to: "/admin-dashboard" });
      } else {
        throw redirect({ to: "/dashboard" });
      }
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const router = useRouter();

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await loginFn({ data: { email, password } });
      
      if (res.role === "admin") {
        window.location.href = "/admin-dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left side - Form */}
      <div className="relative flex w-full flex-col justify-center px-4 py-12 md:w-1/2 md:px-8 lg:px-24">
        <div className="mx-auto flex w-full max-w-[400px] flex-col items-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>

          <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-foreground">
            Welcome Back
          </h1>
          <p className="mb-8 text-center text-sm text-muted-foreground">
            Let's get learning - Please enter your details
          </p>

          {/* Toggle Tab */}
          <div className="mb-8 flex w-full rounded-xl bg-muted/50 p-1">
            <button
              onClick={() => setActiveTab("signin")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                activeTab === "signin"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                activeTab === "signup"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Signup
            </button>
          </div>

          {/* Form */}
          <form className="w-full space-y-4" onSubmit={handleContinue}>
            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-500 text-center">
                {error}
              </div>
            )}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="email"
                required
                className="block w-full rounded-xl border border-border bg-transparent p-4 pl-12 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="password"
                required
                className="block w-full rounded-xl border border-border bg-transparent p-4 pl-12 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full rounded-xl bg-[#0066FF] py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-sm disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Continue"}
            </button>
          </form>

          {/* Or Continue With */}
          <div className="relative mt-10 mb-8 w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground">
                Or Continue With
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-sm transition-transform hover:-translate-y-0.5">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </button>
            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-sm transition-transform hover:-translate-y-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="h-5 w-5 fill-current">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
              </svg>
            </button>
            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-sm transition-transform hover:-translate-y-0.5">
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
          </div>

          <p className="mt-16 text-center text-xs leading-relaxed text-muted-foreground">
            Join thousands of clinical research professionals who trust Clinexcel Academy for their career growth. Log in to access your enrolled courses, track your learning progress, and unlock exclusive resources.
          </p>
        </div>
      </div>

      {/* Right side - Matrix of Courses */}
      <div className="hidden w-1/2 flex-col items-center justify-center bg-gray-50 md:flex relative overflow-hidden px-8 py-12 lg:px-12">
        <div className="w-full max-w-4xl h-full overflow-y-auto pr-4 custom-scrollbar">
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 pb-8">
            {COURSES.map((course) => (
              <div key={course.id} className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md h-full">
                <div>
                  <div className="flex gap-4 mb-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#143B7B] text-sm font-bold text-white">
                      {course.id}
                    </div>
                    <h3 className="text-[15px] font-bold leading-tight text-gray-900">
                      {course.title}
                    </h3>
                  </div>
                  <p className="text-[13px] text-gray-500 mb-6 line-clamp-3">
                    {course.desc}
                  </p>
                </div>
                <a href="#" className="text-[13px] font-semibold text-[#0066FF] hover:underline flex items-center gap-1">
                  Enroll <span className="text-lg leading-none">&rarr;</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const COURSES = [
  { id: 1, title: "One-Day Workshop on Clinical Research Overview", desc: "For academic students & freshers exploring the industry." },
  { id: 2, title: "Quality Assurance in Clinical Research", desc: "Group training on QA processes, SOPs and audits." },
  { id: 3, title: "CRA / Monitoring in Clinical Research", desc: "Develop site-monitoring capabilities and reporting excellence." },
  { id: 4, title: "Good Clinical Practice & NDCT Rules", desc: "Deep dive into ICH GCP and New Drugs & Clinical Trials Rules, 2019." },
  { id: 5, title: "Basic on Clinical Research", desc: "Foundation programme for anyone entering the field." },
  { id: 6, title: "Training on Good Laboratory Practice", desc: "GLP fundamentals for lab and analytical teams." },
  { id: 7, title: "Group Training on Standard Operating Procedure", desc: "Design, review and implement compliant SOPs." },
  { id: 8, title: "Group Training on Data Integrity & Good Documentation Practice", desc: "ALCOA+ principles, GDP and audit-ready records." },
  { id: 9, title: "Group Training on QA in Clinical Trials", desc: "Advanced QA practices tailored to sponsors and CROs." },
  { id: 10, title: "Group Training on Computer System Validation", desc: "CSV lifecycle, 21 CFR Part 11 and electronic data compliance." },
];
