import {
    Storefront,
    Buildings,
    Wrench,
    ArrowRight
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";

const Housing = () => {
    const menuItems = [
        {
            id: "marketplace",
            title: "Marketplace",
            icon: Storefront,
            accent: "blue",
            desc: "Browse properties, post listings & find your perfect home.",
            path: "/marketplace"
        },
        {
            id: "property-management",
            title: "Property Management",
            icon: Buildings,
            accent: "purple",
            desc: "Manage tenants, pay rent & track maintenance requests.",
            path: "/property-management/tenant"
        },
        {
            id: "home-services",
            title: "Home Services",
            icon: Wrench,
            accent: "emerald",
            desc: "Book verified professionals for repairs & home care.",
            path: "/home-services"
        }
    ];



    // Helper to get color classes based on accent
    const getColorClasses = (accent) => {
        const colors = {
            blue: { bg: "bg-blue-100", text: "text-blue-600", border: "hover:border-blue-200" },
            purple: { bg: "bg-purple-100", text: "text-purple-600", border: "hover:border-purple-200" },
            emerald: { bg: "bg-emerald-100", text: "text-emerald-600", border: "hover:border-emerald-200" },
            orange: { bg: "bg-orange-100", text: "text-orange-600", border: "hover:border-orange-200" },
        };
        return colors[accent] || colors.blue;
    };

    return (
        <div className="min-h-full pb-12 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Housing Hub</h1>
                <p className="text-slate-500 mt-2 text-lg">One unified platform for all your real estate needs. Find homes, manage rentals, and book services.</p>
            </div>



            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => {
                    const theme = getColorClasses(item.accent);
                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={`bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between`}
                        >
                            <div>
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${theme.bg} ${theme.text} group-hover:scale-110 transition-transform`}>
                                    <item.icon size={28} weight="fill" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                    {item.desc}
                                </p>
                            </div>
                            
                            
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Housing;
