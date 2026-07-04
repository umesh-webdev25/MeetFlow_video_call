import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, ShipWheelIcon, MoonIcon, SunIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { useState, useEffect } from "react";
import SearchModal from "./SearchModal";
import { useNotificationStore } from "../store/useNotificationStore";
import { useThemeStore } from "../store/useThemeStore";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const { toggleTheme, theme } = useThemeStore();
  const { unreadCount } = useNotificationStore();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <nav className="top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-5  bg-base-200">
        {/* LEFT — GREETING */}
        <div className={cn("hidden md:block", isChatPage && "hidden")}>
          <h1 className="text-4xl font-bold text-base-content flex items-center gap-2 tracking-tight">
            Welcome back, {authUser?.fullName?.split(" ")[0] || "User"}! <span className="text-xl">👋</span>
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            Here's what's happening with your groups and contacts today.
          </p>
        </div>

        {/* MOBILE LOGO */}
        <div className={cn("flex items-center md:hidden", !isChatPage && "lg:hidden")}>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="p-1.5 bg-primary rounded-lg">
              <ShipWheelIcon className="size-4 text-primary-content" />
            </div>
            <span className="text-base font-bold tracking-tight text-base-content">
              MeetFlow
            </span>
          </Link>
        </div>

        {/* RIGHT — ACTIONS */}
        <div className="flex items-center gap-4 ml-auto">
          {/* SEARCH INPUT */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center justify-between w-[400px] h-11 px-4  border border-base-300/70 rounded-xl shadow-sm text-base-content/40 hover:bg-base-200/50 hover:text-base-content/60 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-base-content/30 group-hover:text-base-content/50 transition-colors"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span className="text-[14px]">Search anything...</span>
            </div>
            <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-medium text-base-content/50 bg-base-200/50 border border-base-200 rounded-md transition-colors group-hover:bg-base-200 group-hover:text-base-content/70">
              ⌘ K
            </kbd>
          </button>

          {/* NOTIFICATIONS */}
          <Link to="/notifications" className="relative">
            <button className="flex items-center justify-center size-11 rounded-full bg-base-200 shadow-sm text-base-content/70 hover:bg-base-200/50 transition-colors">
              <BellIcon className="size-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex size-[18px] items-center justify-center rounded-full bg-error text-[10px] font-bold text-white ring-2 ring-base-100">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          </Link>

          {/* THEME TOGGLE */}
          <button
            className="btn btn-ghost btn-sm btn-circle hover:bg-base-200 text-base-content/50 hover:text-base-content transition-colors"
            onClick={toggleTheme}
          >
            {theme === "MeetFlow-pro" ? (
              <MoonIcon className="size-4.5" />
            ) : (
              <SunIcon className="size-4.5" />
            )}
          </button>
        </div>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;