import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/ui/logo";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  LayoutGrid,
  Bookmark,
  BookOpen,
  Users,
  Headphones,
  Settings,
  Crown,
} from "lucide-react";

interface AdminSidebarProps {
  activeRoute: "/admin-dashboard" | "/admin-courses" | "/admin-students";
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

export function AdminSidebar({
  activeRoute,
  mobileOpen = false,
  onMobileOpenChange,
}: AdminSidebarProps) {
  const renderNavLinks = (onNavigate?: () => void) => (
    <nav className="space-y-1">
      <SidebarItem
        icon={LayoutGrid}
        label="Home"
        to="/admin-dashboard"
        active={activeRoute === "/admin-dashboard"}
        onClick={onNavigate}
      />
      <SidebarItem icon={Bookmark} label="Bookmarks" onClick={onNavigate} />
      <div className="my-4" /> {/* Spacer */}
      <SidebarItem
        icon={BookOpen}
        label="All Courses"
        to="/admin-courses"
        active={activeRoute === "/admin-courses"}
        onClick={onNavigate}
      />
      <SidebarItem
        icon={Users}
        label="Manage Students"
        to="/admin-students"
        active={activeRoute === "/admin-students"}
        onClick={onNavigate}
      />
      <div className="my-4" /> {/* Spacer */}
      <SidebarItem icon={Headphones} label="Support" onClick={onNavigate} />
      <SidebarItem icon={Settings} label="Settings" onClick={onNavigate} />
    </nav>
  );

  const renderPremiumCard = () => (
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
        {renderPremiumCard()}
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
          {renderPremiumCard()}
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
