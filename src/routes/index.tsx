import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, CheckCircle2, ShieldCheck, Users, GraduationCap,
  Building2, Globe2, TrendingUp, MapPin, Phone, Mail, Calendar,
  Award, BookOpen, Briefcase, Sparkles, Target, HeartHandshake,
  FlaskConical, ClipboardCheck, Microscope, Rocket,
} from "lucide-react";
import heroLab from "@/assets/hero-lab.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Clinexcel Academy — Expert Clinical Research Training in India" },
      { name: "description", content: "Unlock the future of medicine with industry-aligned clinical research training, GCP & GLP workshops, and certification courses in Ahmedabad, India." },
    ],
  }),
});

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Hero />
      <TrustBar />
      <WhyTraining />
      <Expertise />
      <CustomizedSolutions />
      <WhyChooseUs />
      <WorkshopSpotlight />
      <CareerSection />
      <Eligibility />
      <ContactCTA />
      <SiteFooter />
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-white">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, oklch(0.55 0.18 258) 0, transparent 45%), radial-gradient(circle at 80% 60%, oklch(0.45 0.17 258) 0, transparent 40%)" }} />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Your Partner in Clinical Research Excellence
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-[1.1] text-balance sm:text-5xl lg:text-6xl">
            Unlock the Future of Medicine with{" "}
            <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
              Expert Clinical Research Training
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
            We provide industry-aligned, practical and regulatory-focused training programs
            to prepare professionals for successful careers in clinical research.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/courses"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-primary shadow-glow transition-all hover:-translate-y-0.5"
            >
              Explore Courses
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/15"
            >
              Book a Consultation
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/80">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" />18+ Years Experience</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" />Online & Offline</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" />Placement Assistance</div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-white/20 to-transparent blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/20 shadow-elevated">
            <img
              src={heroLab}
              alt="Clinical researcher examining samples under a microscope"
              width={1600}
              height={1000}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-4 text-primary shadow-elevated sm:block">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-blue text-white">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[11px] font-medium uppercase text-muted-foreground">Contact us</div>
                <div className="text-sm font-bold">+91 9909393649</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    { icon: Building2, label: "Contract Research Organizations (CROs)" },
    { icon: FlaskConical, label: "Pharmaceutical Industry" },
    { icon: Users, label: "Site Management Organizations" },
    { icon: MapPin, label: "Investigator Sites" },
    { icon: GraduationCap, label: "Academic & Research Institutes" },
  ];
  return (
    <section className="border-y border-border bg-muted/40 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Trusted training partner for
        </p>
        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {items.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/5 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium leading-snug text-foreground/70">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- WHY TRAINING ---------------- */
function WhyTraining() {
  const reasons = [
    { icon: ShieldCheck, title: "Ethical & High-Quality Research", desc: "Ensures adherence to ethics and international quality standards across every study." },
    { icon: Briefcase, title: "Industry-Ready Professionals", desc: "Builds practical skills and job-ready capabilities aligned with real industry demand." },
    { icon: ClipboardCheck, title: "Regulatory Compliance", desc: "Enhances compliance with USFDA, EMA, CDSCO and ANVISA regulatory standards." },
    { icon: Microscope, title: "Academic + Real World", desc: "Bridges academic knowledge with hands-on, real-world clinical trial practice." },
  ];
  return (
    <section id="about" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Why Clinical Research Training" title="Training that shapes safe, effective medicine" desc="Clinical research is at the heart of every new treatment. Our programs build the ethical, technical and regulatory foundation your career deserves." />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-blue opacity-10 blur-2xl transition-opacity group-hover:opacity-30" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-blue text-white shadow-card">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="relative mt-5 text-lg font-bold text-foreground">{title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- EXPERTISE ---------------- */
function Expertise() {
  const bullets = [
    "Over 18 Years of Experience in Clinical Research",
    "Pharma & Clinical Research Expertise with proven track record",
    "Diverse Training Experience for site staff, sponsors, CROs and investigators",
    "Experience in both Early-phase and Late-phase clinical trials",
    "Successfully handled multiple regulatory inspections of early & late phase Clinical Trials",
  ];
  const stats = [
    { value: "18+", label: "Years Experience" },
    { value: "10+", label: "Certificate Programs" },
    { value: "3", label: "Month Internship" },
    { value: "100%", label: "Placement Support" },
  ];
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20 text-white sm:py-24">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 80% 30%, oklch(0.55 0.18 258) 0, transparent 50%)" }} />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider">
            <Award className="h-3.5 w-3.5" /> Our Expertise
          </span>
          <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">
            Nearly two decades of clinical research leadership
          </h2>
          <p className="mt-4 text-white/80">
            Led by RQAP-GCP Certified expert <strong className="text-white">Vishal Nakrani</strong> — with 19+ years across Clinical Research & Quality Assurance, USFDA/EMA/CDSCO/ANVISA inspections, and Phase I / BA-BE / Late-Phase trials.
          </p>
          <ul className="mt-6 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex gap-3 text-sm text-white/90">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4 self-center">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
              <div className="text-4xl font-bold text-white sm:text-5xl">{s.value}</div>
              <div className="mt-1 text-sm text-white/70">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CUSTOMIZED SOLUTIONS ---------------- */
function CustomizedSolutions() {
  const modes = [
    { icon: Users, title: "On-Site Training", desc: "In-person workshops and seminars delivered at your facility." },
    { icon: Globe2, title: "Virtual Training", desc: "Online modules and live webinars designed for remote teams." },
    { icon: HeartHandshake, title: "Consulting Services", desc: "Expert advice and support for your research and compliance needs." },
  ];
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Customized Training Solutions" title="Every organization is unique — training should be too" desc="Academic, CRO, Sponsor, or Ethics Committee — we recognize each has different needs and design programs accordingly." />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {modes.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-border bg-gradient-soft p-8 text-center shadow-card">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-blue text-white shadow-card">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-primary">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- WHY CHOOSE US ---------------- */
function WhyChooseUs() {
  const items = [
    { icon: Users, title: "Expert Instructors", desc: "With deep industry experience across pharma & CRO." },
    { icon: BookOpen, title: "Interactive Learning", desc: "Case studies and hands-on practical exercises." },
    { icon: Calendar, title: "Flexible Scheduling", desc: "Programs tailored to fit your team's timetable." },
    { icon: HeartHandshake, title: "Ongoing Support", desc: "Continuous mentorship even after training ends." },
    { icon: Briefcase, title: "Placement Assistance", desc: "Career counselling and placement support included." },
    { icon: Target, title: "Skill Development", desc: "Practical abilities for a successful clinical research career." },
  ];
  return (
    <section className="bg-muted/40 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Why Choose Us" title="Everything you need to launch a clinical research career" />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-secondary/50 hover:shadow-card">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- WORKSHOP SPOTLIGHT ---------------- */
function WorkshopSpotlight() {
  const coverage = [
    "ICH GCP E6(R3) – Advanced & Practical Approach",
    "Good Laboratory Practice (GLP)",
    "Data Integrity & ALCOA+ Principles",
    "Electronic Data & Computer System Validation (CSV)",
    "Quality Management System (QMS) & Quality Culture",
    "Audit & Regulatory Inspection Readiness (USFDA, EMA, CDSCO, ANVISA)",
    "New Drugs & Clinical Trials Rules, 2019",
  ];
  return (
    <section id="workshop" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-hero text-white shadow-elevated">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-5 lg:p-16">
            <div className="lg:col-span-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/20 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-200">
                Customized for Organizations
              </span>
              <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Advanced GCP & GLP Training Workshop
              </h2>
              <p className="mt-3 text-lg font-medium text-emerald-200">1–2 day customized workshops · Tailored for Clinical Research & Pharma Professionals</p>

              <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
                {coverage.map((c) => (
                  <div key={c} className="flex gap-2.5 text-sm text-white/90">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="https://wa.me/919909393649" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-glow transition-all hover:-translate-y-0.5">
                  Book Your Workshop <ArrowRight className="h-4 w-4" />
                </a>
                <a href="mailto:clinexcelacademy@gmail.com" className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10">
                  Email Us
                </a>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
                <h3 className="text-lg font-bold">Key Features</h3>
                <ul className="mt-4 space-y-4 text-sm">
                  {[
                    ["Customized Content", "Based on your organization's needs"],
                    ["Real-Life Case Studies", "Actual inspection scenarios"],
                    ["Practical Strategies", "Actionable compliance approaches"],
                    ["Interactive Sessions", "Expert-led guidance and Q&A"],
                  ].map(([t, d]) => (
                    <li key={t} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
                      <div className="font-semibold text-white">{t}</div>
                      <div className="text-white/70">{d}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CAREER ---------------- */
function CareerSection() {
  const items = [
    { icon: TrendingUp, title: "High Demand", desc: "Demand for clinical research professionals is growing rapidly across India and globally." },
    { icon: MapPin, title: "Preferred Hub", desc: "India is a key location for clinical trials, offering vast career development opportunities." },
    { icon: Globe2, title: "Global Opportunities", desc: "Multiple national and international CROs actively hire talent from the region." },
  ];
  return (
    <section className="bg-muted/40 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Why Clinical Research is a Great Career Choice" title="Competitive salaries. Ground-breaking impact. Global reach." desc="Clinical research professionals contribute to advancing medicine — ensuring new treatments are safe and effective." />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-8 text-center shadow-card">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-blue text-white">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-primary">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- ELIGIBILITY ---------------- */
function Eligibility() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><GraduationCap className="h-6 w-6" /></div>
          <h3 className="mt-5 text-xl font-bold text-primary">Eligibility</h3>
          <p className="mt-2 text-sm text-muted-foreground">Candidates must possess one of the following qualifications:</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> B.Sc./M.Sc. (Chemistry / Microbiology / Life Science)</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> B.Pharm / M.Pharm / Pharm D</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> Or equivalent qualifications in related disciplines</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Target className="h-6 w-6" /></div>
          <h3 className="mt-5 text-xl font-bold text-primary">Course Objectives</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li><strong className="text-foreground">Industry–Academic Alignment:</strong> <span className="text-muted-foreground">Bridge the gap between industry expectations and academic outcomes.</span></li>
            <li><strong className="text-foreground">Skill Development:</strong> <span className="text-muted-foreground">Create professionals with practical abilities for a successful career.</span></li>
            <li><strong className="text-foreground">Upskilling Freshers/Jr. Staff:</strong> <span className="text-muted-foreground">Improve absorption and career readiness through practical skill-building.</span></li>
          </ul>
        </div>

        <div className="rounded-2xl bg-gradient-hero p-8 text-white shadow-elevated">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur"><Briefcase className="h-6 w-6" /></div>
          <h3 className="mt-5 text-xl font-bold">Internship Included</h3>
          <p className="mt-3 text-sm text-white/85">A 3-month internship at a Late-phase CRO and investigator sites — real experience, real environments.</p>
          <div className="mt-6 rounded-xl border border-white/20 bg-white/10 p-4">
            <div className="text-sm text-white/70">Duration</div>
            <div className="text-2xl font-bold">03 Months</div>
          </div>
          <Link to="/courses" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:-translate-y-0.5">
            View Courses <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CONTACT CTA ---------------- */
function ContactCTA() {
  return (
    <section id="contact" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-soft p-8 shadow-card sm:p-12 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-blue px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
                <Rocket className="h-3.5 w-3.5" /> Get Started Today
              </div>
              <h2 className="mt-5 text-3xl font-bold text-primary sm:text-4xl">
                Ready to elevate your clinical research capabilities?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Contact us to discuss your training needs and schedule a consultation. We'll design a program that fits your team, your goals, and your timeline.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="tel:+919909393649" className="inline-flex items-center gap-2 rounded-full bg-gradient-blue px-6 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-0.5">
                  <Phone className="h-4 w-4" /> Call Now
                </a>
                <a href="https://wa.me/919909393649" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-primary/20 bg-white px-6 py-3 text-sm font-semibold text-primary transition-all hover:border-primary/40">
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="grid gap-4">
              <ContactCard icon={MapPin} title="Visit Us" body="1209 – One World West, Iscon-ambali Road, Ahmedabad" />
              <ContactCard icon={Phone} title="Call / WhatsApp" body="+91 9909393649 / +91 9662268436" />
              <ContactCard icon={Mail} title="Email" body="vishal.nakrani@clinexcelresearch.com" small />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({ icon: Icon, title, body, small }: { icon: typeof Phone; title: string; body: string; small?: boolean }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-blue text-white">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
        <div className={small ? "mt-1 text-sm font-medium text-foreground break-all" : "mt-1 text-base font-semibold text-foreground"}>{body}</div>
      </div>
    </div>
  );
}

/* ---------------- Section header ---------------- */
function SectionHeader({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl font-bold text-primary text-balance sm:text-4xl">{title}</h2>
      {desc && <p className="mt-4 text-muted-foreground">{desc}</p>}
    </div>
  );
}
