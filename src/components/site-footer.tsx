import { Link } from "@tanstack/react-router";
import { GraduationCap, MapPin, Phone, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-gradient-hero text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold">Clinexcel Academy</div>
              <div className="text-xs text-white/70">Your Partner in Clinical Research Excellence</div>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80">
            Industry-aligned, practical and regulatory-focused training programs to prepare
            professionals for successful careers in clinical research.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/courses" className="hover:text-white">Courses</Link></li>
            <li><a href="/#about" className="hover:text-white">About Us</a></li>
            <li><a href="/#workshop" className="hover:text-white">GCP & GLP Workshop</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/60" /><span>1209 – One World West, Iscon-ambali Road, Ahmedabad</span></li>
            <li className="flex gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-white/60" /><span>+91 9909393649 / +91 9662268436</span></li>
            <li className="flex gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-white/60" /><a href="mailto:vishal.nakrani@clinexcelresearch.com" className="hover:text-white break-all">vishal.nakrani@clinexcelresearch.com</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-white/60 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Clinexcel Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
