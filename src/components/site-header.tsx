import { Link } from "@tanstack/react-router";
import { Logo } from "./ui/logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary [&.active]:text-primary">Home</Link>
          <Link to="/courses" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary [&.active]:text-primary">Courses</Link>
          <a href="/#about" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">About</a>
          <a href="/#workshop" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">Workshops</a>
          <a href="/#contact" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">Contact</a>
        </nav>

        <div className="hidden items-center gap-4 sm:flex">
          <Link
            to="/login"
            className="text-sm font-semibold text-foreground/80 transition-colors hover:text-primary"
          >
            Sign In
          </Link>
          <Link
            to="/login"
            className="rounded-full bg-gradient-blue px-4 py-2 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
