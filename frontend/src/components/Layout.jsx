import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";
import { useThemeStore } from "../store/useThemeStore";
import { cn } from "../lib/utils";

const Layout = ({ children, showSidebar = false }) => {
  const { theme } = useThemeStore();

  return (
    <div className={cn(
      "min-h-screen flex flex-col lg:flex-row transition-colors duration-200",
      theme === "MeetFlow-pro" ? "bg-[#f8fafc]" : "bg-base-200"
    )}>
      {showSidebar && <Sidebar />}

      <div className="flex-1 flex flex-col relative">
        <Navbar />

        <main className={`flex-1 overflow-y-auto ${showSidebar ? "pb-20 lg:pb-0" : ""}`}>
          {children}
        </main>

        {showSidebar && <MobileNav />}
      </div>
    </div>
  );
};
export default Layout;

