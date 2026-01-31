import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppProvider } from "../context/AppContext";
import Sidebar, { MobileMenuButton } from "../components/Sidebar";
import { AnimatePresence, motion } from "framer-motion";
import { CaretRight } from "@phosphor-icons/react";
import AccessibilityPopup from "../components/AccessibilityPopup";
import VoiceAssistant from "../components/VoiceAssistant";
import VoiceAssistantToggle from "../components/VoiceAssistantToggle";
import LanguageSwitcher from "../components/LanguageSwitcher";

const MainLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Helper to get readable title from path
  const getPageTitle = (path) => {
    if (path === "/") return "Dashboard";
    return path.substring(1).charAt(0).toUpperCase() + path.slice(2);
  };

  const currentTitle = getPageTitle(location.pathname);

  const toggleSidebar = (open) => {
    setSidebarOpen(typeof open === 'boolean' ? open : !sidebarOpen);
  };

  return (
    <AppProvider>
      <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        <AccessibilityPopup />
        <VoiceAssistant />


        {/* Main Content Wrapper */}
        <main className="flex-1 md:ml-64 h-screen flex flex-col relative w-full">
          {/* Top Navigation Header */}
          <header className="h-14 md:h-16 min-h-[3.5rem] md:min-h-[4rem] bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10 w-full">
            <div className="flex items-center gap-2 md:gap-4">
              {/* Mobile menu button */}
              <MobileMenuButton onClick={() => toggleSidebar(true)} />

              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <span className="hidden sm:inline hover:text-slate-700 transition-colors">App</span>
                <CaretRight size={14} weight="bold" className="hidden sm:block text-slate-300" />
                <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-1 rounded-md text-xs md:text-sm">
                  {currentTitle}
                </span>
              </div>
            </div>
            {/* Right side of header */}
            <div className="text-xs font-medium text-slate-400 flex items-center gap-2 md:gap-4">
              <VoiceAssistantToggle />
              <LanguageSwitcher />
              <span className="hidden sm:inline">
                {new Date().toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="sm:hidden">
                {new Date().toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </header>

          {/* Scrollable Page Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="bg-transparent"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </AppProvider>
  );
};

export default MainLayout;

