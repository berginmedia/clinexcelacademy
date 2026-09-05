import { useState, useRef, useEffect } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { LogOut, User } from "lucide-react";
import { logoutFn } from "@/lib/auth";

export function ProfileDropdown({ seed = "Raymond", role = "student" }: { seed?: string, role?: "student" | "admin" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutFn();
    window.location.href = "/login";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-primary bg-muted cursor-pointer transition-transform hover:scale-105 active:scale-95"
      >
        <img
          src={`https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`}
          alt="User Avatar"
          className="h-full w-full object-cover"
        />
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-white py-1 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-sm font-semibold text-foreground">My Account</p>
            <p className="text-xs text-muted-foreground capitalize">{role}</p>
          </div>
          <Link 
            to={role === "admin" ? "/admin-dashboard" : "/dashboard"}
            className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <User size={16} />
            Profile
          </Link>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
