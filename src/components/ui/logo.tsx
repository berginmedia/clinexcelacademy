import { GraduationCap } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-blue text-white shadow-card">
        <GraduationCap className="h-5 w-5" />
      </div>
      <div className="leading-tight">
        <div className="text-base font-bold text-primary">Clinexcel</div>
        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Academy
        </div>
      </div>
    </Link>
  );
}
