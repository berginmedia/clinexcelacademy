import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/ui/logo";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  LayoutGrid,
  Activity,
  Bookmark,
  BookOpen,
  HelpCircle,
  Headphones,
  Settings,
  MessageCircle,
} from "lucide-react";

interface StudentSidebarProps {
  activeRoute: "/dashboard" | "/student-courses" | "/transcript";
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

export function StudentSidebar({
  activeRoute,
  mobileOpen = false,
  onMobileOpenChange,
}: StudentSidebarProps) {
  const renderNavLinks = (onNavigate?: () => void) => (
    <nav className="space-y-1">
      <SidebarItem
        icon={LayoutGrid}
        label="Home"
        to="/dashboard"
        active={activeRoute === "/dashboard"}
        onClick={onNavigate}
      />
      <SidebarItem
        icon={Activity}
        label="Transcript"
        to="/transcript"
        active={activeRoute === "/transcript"}
        onClick={onNavigate}
      />
      <SidebarItem icon={Bookmark} label="Bookmarks" onClick={onNavigate} />
      <div className="my-4" /> {/* Spacer */}
      <SidebarItem
        icon={BookOpen}
        label="Courses"
        to="/student-courses"
        active={activeRoute === "/student-courses"}
        onClick={onNavigate}
      />
      <SidebarItem icon={HelpCircle} label="Assessment" onClick={onNavigate} />
      <div className="my-4" /> {/* Spacer */}
      <SidebarItem icon={Headphones} label="Support" onClick={onNavigate} />
      <SidebarItem icon={Settings} label="Settings" onClick={onNavigate} />
    </nav>
  );

  const renderWhatsAppButton = () => (
    <div className="p-4">
      <a
        href="https://wa.me/919909393649?text=Hi%20Clinexcel%20Academy%2C%20I%27d%20like%20to%20learn%20more%20about%20your%20training%20programs."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-[#20BD5A] hover:shadow-md"
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40 opacity-75" />
          <MessageCircle className="relative h-5 w-5" />
        </span>
        <span>Chat with us</span>
      </a>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (100% untouched layout on desktop) */}
      <aside className="hidden w-[250px] shrink-0 flex-col border-r border-border bg-white lg:flex sticky top-0 h-screen">
        <div className="flex h-20 items-center px-6">
          <Logo />
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {renderNavLinks()}
        </div>
        {renderWhatsAppButton()}
      </aside>

      {/* Mobile Sidebar Drawer (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="w-[280px] p-0 bg-white border-r border-border flex flex-col h-full lg:hidden">
          <div className="flex h-20 items-center px-6 border-b border-border/50">
            <Logo />
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-6">
            {renderNavLinks(() => onMobileOpenChange?.(false))}
          </div>
          {renderWhatsAppButton()}
        </SheetContent>
      </Sheet>
    </>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  active,
  to,
  onClick,
}: {
  icon: any;
  label: string;
  active?: boolean;
  to?: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <Icon size={18} className={active ? "text-primary" : "text-muted-foreground"} />
      {label}
    </>
  );

  const className = `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
    active
      ? "bg-blue-50 text-primary font-semibold"
      : "text-muted-foreground hover:bg-[#F1F5F9] hover:text-foreground"
  }`;

  if (to) {
    return (
      <Link to={to} className={className} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <a href="#" className={className} onClick={onClick}>
      {content}
    </a>
  );
}
