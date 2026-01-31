import { useState, useEffect } from "react";
import {
    SquaresFour,
    Student,
    Heartbeat,
    Bus,
    House,
    Gear,
    SignOut,
    List,
    X,
} from "@phosphor-icons/react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import * as Avatar from "@radix-ui/react-avatar";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, onToggle }) => {
    const { logout, userProfile } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Close sidebar on route change (mobile)
    useEffect(() => {
        if (window.innerWidth < 768 && isOpen) {
            onToggle?.(false);
        }
    }, [location.pathname]);

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const navItems = [
        { icon: SquaresFour, label: "Dashboard", path: "/" },
        { icon: Student, label: "Education", path: "/education" },
        { icon: Heartbeat, label: "Healthcare", path: "/healthcare" },
        { icon: Bus, label: "Transport", path: "/transport" },
        { icon: House, label: "Housing", path: "/housing" },
    ];

    // Check if Housing sub-page is active
    const isHousingSubPage = (path) => {
        return path === '/housing' && (
            location.pathname.startsWith('/marketplace') ||
            location.pathname.startsWith('/property-management') ||
            location.pathname.startsWith('/home-services') ||
            location.pathname.startsWith('/post-property')
        );
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => onToggle?.(false)}
                />
            )}

            {/* Sidebar - White theme with coral accents */}
            <aside className={`
                h-screen w-64 bg-white text-slate-800 flex flex-col font-sans border-r border-slate-200 shadow-xl
                fixed left-0 top-0 z-50
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
            `}>
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-slate-100 bg-white">
                    <div className="flex items-center">
                        <div className="w-9 h-9 bg-gradient-to-br from-[#FF6347] to-[#FF8C69] rounded-xl mr-3 flex items-center justify-center shadow-lg shadow-[#FF6347]/20">
                            <span className="font-bold text-white text-lg">S</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">
                            SYNERGIA
                        </span>
                    </div>
                    {/* Close button for mobile */}
                    <button
                        onClick={() => onToggle?.(false)}
                        className="md:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 md:py-6 px-3 space-y-1 overflow-y-auto">
                    <div className="px-3 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Main Menu
                    </div>
                    {navItems.map((item) => {
                        const isSubPage = isHousingSubPage(item.path);

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => window.innerWidth < 768 && onToggle?.(false)}
                                className={({ isActive }) =>
                                    `flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group ${(isActive || isSubPage)
                                        ? "bg-[#FF6347] text-white shadow-lg shadow-[#FF6347]/25"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`
                                }
                            >
                                <item.icon
                                    size={22}
                                    weight="duotone"
                                    className="mr-3 transition-transform group-hover:scale-110"
                                />
                                <span className="font-semibold">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* User Profile / Settings */}
                <div className="p-3 md:p-4 border-t border-slate-100 bg-slate-50/50">
                    <button className="flex items-center w-full px-3 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors mb-2">
                        <Gear size={20} weight="duotone" className="mr-3 text-slate-400" />
                        <span className="text-sm font-medium">Settings</span>
                    </button>

                    <div className="flex items-center p-2 md:p-3 rounded-xl bg-white border border-slate-200 mt-2 hover:border-[#FF6347]/30 transition-colors group relative shadow-sm">
                        <Link to="/profile" onClick={() => window.innerWidth < 768 && onToggle?.(false)} className="flex items-center flex-1 min-w-0">
                            <Avatar.Root className="h-9 w-9 rounded-full bg-gradient-to-br from-[#FF6347] to-[#FF8C69] flex items-center justify-center overflow-hidden border-2 border-white shadow-md shrink-0">
                                {userProfile?.photoUrl ? (
                                    <Avatar.Image src={userProfile.photoUrl} className="h-full w-full object-cover" />
                                ) : (
                                    <Avatar.Fallback className="text-white text-xs font-bold">
                                        {userProfile?.name ? userProfile.name.slice(0, 2).toUpperCase() : "JD"}
                                    </Avatar.Fallback>
                                )}
                            </Avatar.Root>
                            <div className="ml-2 md:ml-3 flex-1 overflow-hidden">
                                <p className="text-sm font-semibold text-slate-900 truncate">
                                    {userProfile?.name || "User"}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                    {userProfile?.verificationStatus === 'verified' ? '✓ Verified' : 'Member'}
                                </p>
                            </div>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors ml-1 z-10 rounded-lg hover:bg-red-50"
                            title="Sign Out"
                        >
                            <SignOut size={20} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

// Mobile hamburger button component
export const MobileMenuButton = ({ onClick }) => (
    <button
        onClick={onClick}
        className="md:hidden p-2 text-slate-600 hover:text-[#FF6347] hover:bg-[#FF6347]/5 rounded-lg transition-colors"
        aria-label="Open menu"
    >
        <List size={24} />
    </button>
);

export default Sidebar;
