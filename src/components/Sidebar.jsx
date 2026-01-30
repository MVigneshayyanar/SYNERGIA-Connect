import {
    SquaresFour,
    Student,
    Heartbeat,
    Bus,
    House,
    Gear,
    SignOut,
} from "@phosphor-icons/react";
import { NavLink } from "react-router-dom";
import * as Avatar from "@radix-ui/react-avatar"; // Radix UI Avatar

const Sidebar = () => {
    const navItems = [
        { icon: SquaresFour, label: "Dashboard", path: "/" },
        { icon: Student, label: "Education", path: "/education" },
        { icon: Heartbeat, label: "Healthcare", path: "/healthcare" },
        { icon: Bus, label: "Transport", path: "/transport" },
        { icon: House, label: "Housing", path: "/housing" },
    ];

    return (
        <aside className="h-screen w-64 bg-slate-900 text-white flex flex-col font-sans border-r border-slate-800 shadow-xl fixed left-0 top-0 z-50">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg mr-3 flex items-center justify-center shadow-lg shadow-teal-500/20">
                    <span className="font-bold text-white text-lg">U</span>
                </div>
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    UBS Platform
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Main Menu
                </div>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                                ? "bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-[0_0_15px_-3px_rgba(45,212,191,0.2)]"
                                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                            }`
                        }
                    >
                        <item.icon
                            size={22}
                            weight="duotone"
                            className="mr-3 transition-transform group-hover:scale-110"
                        />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User Profile / Settings */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/30">
                <button className="flex items-center w-full px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors mb-2">
                    <Gear size={20} weight="duotone" className="mr-3" />
                    <span className="text-sm font-medium">Settings</span>
                </button>

                <div className="flex items-center p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 mt-2">
                    <Avatar.Root className="h-9 w-9 rounded-full bg-teal-600 flex items-center justify-center overflow-hidden border border-slate-600">
                        <Avatar.Fallback className="text-white text-xs font-bold">JD</Avatar.Fallback>
                    </Avatar.Root>
                    <div className="ml-3 flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">John Doe</p>
                        <p className="text-xs text-slate-400 truncate">Citizen ID: #8392</p>
                    </div>
                    <button className="text-slate-400 hover:text-red-400 transition-colors ml-1">
                        <SignOut size={20} />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
