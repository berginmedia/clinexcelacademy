import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./ui/logo";
import { Sheet, SheetContent } from "./ui/sheet";
import { Menu } from "lucide-react";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Navigation (Untouched) */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary [&.active]:text-primary">Home</Link>
          <Link to="/courses" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary [&.active]:text-primary">Courses</Link>
          <a href="/#about" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">About</a>
          <a href="/#workshop" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">Workshops</a>
          <a href="/#contact" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">Contact</a>
        </nav>

        {/* Desktop Auth Buttons (Untouched) */}
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

        {/* Mobile Hamburger Trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-muted-foreground transition-colors hover:bg-muted"
            aria-label="Open Navigation Menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0 bg-white border-r border-border flex flex-col h-full md:hidden">
          <div className="flex h-16 items-center px-6 border-b border-border/50">
            <Logo />
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Home
              </Link>
              <Link
                to="/courses"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Courses
              </Link>
              <a
                href="/#about"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                About
              </a>
              <a
                href="/#workshop"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Workshops
              </a>
              <a
                href="/#contact"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Contact
              </a>
            </nav>
          </div>
          <div className="border-t border-border/50 p-4 flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center rounded-xl border border-border py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center rounded-xl bg-gradient-blue py-2.5 text-sm font-semibold text-white shadow-card transition-all hover:opacity-90"
            >
              Sign Up
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
