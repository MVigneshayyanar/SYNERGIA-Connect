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
            color: "text-blue-500",
            bg: "bg-blue-50",
            border: "hover:border-blue-200",
            desc: "Interactive map search, advanced filters & 3D virtual tours.",
            path: "/marketplace"
        },
        {
            id: "property-management",
            title: "Property Management",
            icon: Buildings,
            color: "text-purple-500",
            bg: "bg-purple-50",
            border: "hover:border-purple-200",
            desc: "Tenant dashboard, rent payments & maintenance requests.",
            path: "/property-management/tenant"
        },
        {
            id: "home-services",
            title: "Home Services",
            icon: Wrench,
            color: "text-teal-500",
            bg: "bg-teal-50",
            border: "hover:border-teal-200",
            desc: "On-demand verified professionals & real-time booking.",
            path: "/home-services"
        }
    ];

    return (
        <div className="min-h-full pb-12">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900">Housing Hub</h1>
                <p className="text-slate-500 mt-2 text-lg">One unified platform for all your real estate needs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                    <Link
                        key={item.id}
                        to={item.path}
                        className={`bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-all duration-300 cursor-pointer group hover:shadow-xl hover:-translate-y-1 ${item.border} relative overflow-hidden h-80 flex flex-col justify-between`}
                    >
                        {/* Background Decoration */}
                        <div className={`absolute top-0 right-0 w-32 h-32 ${item.bg} rounded-bl-[100px] -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110`}></div>

                        <div className="relative z-10">
                            <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                                <item.icon size={32} weight="duotone" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                        </div>

                        <div className="relative z-10 pt-4">
                            <span className={`inline-flex items-center font-bold ${item.color} text-sm group-hover:translate-x-1 transition-transform`}>
                                Enter Module <ArrowRight className="ml-2" weight="bold" />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Housing;
