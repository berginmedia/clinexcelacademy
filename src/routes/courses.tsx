import { Link, createFileRoute } from "@tanstack/react-router";


import { ArrowRight, Clock, CheckCircle2, GraduationCap, Award, Users } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

function CoursesPage() {
const certificateCourses = [
  { title: "Comprehensive Clinical Research Course", desc: "End-to-end training covering all core aspects of clinical research operations and compliance." },
  { title: "Certificate Course of QA in Clinical Research", desc: "Master Quality Assurance frameworks, audits and regulatory compliance practices." },
  { title: "Certificate Course of CRC in Clinical Research", desc: "Prepare to become a Clinical Research Coordinator with hands-on site-level training." },
  { title: "Certificate Course of CRA/Monitoring in Clinical Research", desc: "Build monitoring, source-verification and site-management skills for CRA roles." },
];

const trainingPrograms = [
  { title: "One-Day Workshop on Clinical Research Overview", desc: "For academic students & freshers exploring the industry." },
  { title: "Quality Assurance in Clinical Research", desc: "Group training on QA processes, SOPs and audits." },
  { title: "CRA / Monitoring in Clinical Research", desc: "Develop site-monitoring capabilities and reporting excellence." },
  { title: "Good Clinical Practice & NDCT Rules", desc: "Deep dive into ICH GCP and New Drugs & Clinical Trials Rules, 2019." },
  { title: "Basic on Clinical Research", desc: "Foundation programme for anyone entering the field." },
  { title: "Training on Good Laboratory Practice", desc: "GLP fundamentals for lab and analytical teams." },
  { title: "Group Training on Standard Operating Procedure", desc: "Design, review and implement compliant SOPs." },
  { title: "Group Training on Data Integrity & Good Documentation Practice", desc: "ALCOA+ principles, GDP and audit-ready records." },
  { title: "Group Training on QA in Clinical Trials", desc: "Advanced QA practices tailored to sponsors and CROs." },
  { title: "Group Training on Computer System Validation", desc: "CSV lifecycle, 21 CFR Part 11 and electronic data compliance." },
];

const ENROLL_URL = "https://google.com";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 text-white sm:py-24">
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, oklch(0.55 0.18 258) 0, transparent 45%)" }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider">
            <GraduationCap className="h-3.5 w-3.5" /> Courses & Programs
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-balance sm:text-5xl lg:text-6xl">
            Practical training for every stage of your clinical research career
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/85">
            From foundational certificate courses to advanced group workshops — all delivered online or on-site by industry experts.
          </p>
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/80">
            <div className="flex items-center gap-2"><Award className="h-5 w-5 text-emerald-300" /> Industry-recognized certificates</div>
            <div className="flex items-center gap-2"><Users className="h-5 w-5 text-emerald-300" /> Online & Offline delivery</div>
            <div className="flex items-center gap-2"><Clock className="h-5 w-5 text-emerald-300" /> Flexible schedules</div>
          </div>
        </div>
      </section>

      {/* Certificate Courses */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                Certificate Courses
              </span>
              <h2 className="mt-4 text-3xl font-bold text-primary sm:text-4xl">30 hours each · Certificate on completion</h2>
            </div>
            <div className="rounded-full bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary">
              4 programmes
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {certificateCourses.map((c, i) => (
              <article key={c.title} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated">
                <div className="absolute right-6 top-6 text-6xl font-black text-primary/5 tabular-nums">{String(i + 1).padStart(2, "0")}</div>
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-blue text-white shadow-card">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="relative mt-5 text-xl font-bold text-foreground">{c.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>

                <div className="relative mt-5 flex items-center gap-4 text-xs font-medium text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> 30 hours</span>
                  <span className="inline-flex items-center gap-1.5"><Award className="h-3.5 w-3.5" /> Certificate</span>
                </div>

                <div className="relative mt-6 flex flex-wrap gap-3">
                  <a href={ENROLL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-blue px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-0.5">
                    Enroll Now <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href={ENROLL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:border-primary/40">
                    View Syllabus
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Training Programs */}
      <section className="bg-muted/40 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              Our Training Programs
            </span>
            <h2 className="mt-4 text-3xl font-bold text-primary sm:text-4xl">Online / Offline · Individual & Group</h2>
            <p className="mt-3 text-muted-foreground">
              Ten focused programs across QA, monitoring, GCP, GLP, SOPs, data integrity and CSV — customizable to your team's needs.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trainingPrograms.map((p, i) => (
              <article key={p.title} className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-secondary/40 hover:shadow-card">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-blue text-sm font-bold text-white">
                    {i + 1}
                  </div>
                  <h3 className="font-bold leading-snug text-foreground">{p.title}</h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{p.desc}</p>
                <a
                  href={ENROLL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary transition-colors hover:text-primary"
                >
                  Enroll <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Internship banner */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 overflow-hidden rounded-3xl border border-border bg-gradient-soft p-8 shadow-card sm:p-12 lg:grid-cols-2 lg:items-center lg:p-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-success">
                Included with every program
              </span>
              <h2 className="mt-4 text-3xl font-bold text-primary sm:text-4xl">3-month Internship at a Late-phase CRO</h2>
              <p className="mt-4 text-muted-foreground">
                Every learner gets hands-on internship experience at a Late-phase CRO and investigator sites — plus career counselling and placement assistance.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {["Late-phase CRO exposure", "Investigator site rotations", "Placement Assistance & Career Counselling"].map((x) => (
                  <li key={x} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {x}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-gradient-hero p-8 text-white shadow-elevated">
              <h3 className="text-xl font-bold">Ready to enroll?</h3>
              <p className="mt-2 text-sm text-white/80">Book a free consultation. We'll help you choose the right program for your goals.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={ENROLL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary transition-all hover:-translate-y-0.5">
                  Apply Now <ArrowRight className="h-4 w-4" />
                </a>
                <a href="https://wa.me/919909393649" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10">
                  WhatsApp Us
                </a>
              </div>
              <Link to="/" className="mt-5 inline-block text-sm text-white/70 underline hover:text-white">
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}


export const Route = createFileRoute('/courses')({
  component: CoursesPage,
});
