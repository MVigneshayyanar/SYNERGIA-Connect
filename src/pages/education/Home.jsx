import { useState } from "react";
import { 
    CalendarPlus, 
    Student, 
    Cube, 
    Wheelchair, 
    ArrowLeft 
} from "@phosphor-icons/react";

// Sub-components
import EventFinder from "./EventFinder";
import Scholarships from "./Scholarships";
import ImmersiveLearning from "./ImmersiveLearning";
import DisabilitySupport from "./DisabilitySupport";

const Home = () => {
    const [activeView, setActiveView] = useState("menu");

    const menuItems = [
        { 
            id: "events", 
            title: "Event Finder", 
            icon: CalendarPlus, 
            accent: "purple",
            desc: "Workshops, seminars & local meetups." 
        },
        { 
            id: "scholarships", 
            title: "Scholarships", 
            icon: Student, 
            accent: "yellow",
            desc: "Financial aid & grant opportunities." 
        },

        { 
            id: "immersive", 
            title: "360° Learning", 
            icon: Cube, 
            accent: "teal",
            desc: "Interactive 3D object viewer & AR." 
        },
        { 
            id: "disability", 
            title: "Disability Support", 
            icon: Wheelchair, 
            accent: "indigo",
            desc: "Inclusive tools & accessibility settings." 
        },
    ];

    const renderView = () => {
        switch (activeView) {
            case "events": return <EventFinder />;
            case "scholarships": return <Scholarships />;
            case "immersive": return <ImmersiveLearning />;
            case "disability": return <DisabilitySupport />;
            default: return null;
        }
    };

    if (activeView !== "menu") {
        return (
            <div className="animate-fade-in relative min-h-full pb-12">
                <button 
                    onClick={() => setActiveView("menu")} 
                    className="flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors group font-medium"
                >
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 mr-3 group-hover:border-slate-300 transition-all">
                        <ArrowLeft size={18} weight="bold"/>
                    </div>
                    Back to Education Hub
                </button>
                {renderView()}
            </div>
        );
    }

    // Helper to get color classes based on accent
    const getColorClasses = (accent) => {
        const colors = {
            blue: {
                bg: "bg-blue-100",
                bgHover: "group-hover:bg-blue-200/80",
                text: "text-blue-600",
                bar: "bg-blue-500",
                groupText: "group-hover:text-blue-600"
            },
            purple: {
                bg: "bg-purple-100",
                bgHover: "group-hover:bg-purple-200/80",
                text: "text-purple-600",
                bar: "bg-purple-500",
                groupText: "group-hover:text-purple-600"
            },
            yellow: {
                bg: "bg-yellow-100",
                bgHover: "group-hover:bg-yellow-200/80",
                text: "text-yellow-600",
                bar: "bg-yellow-500",
                groupText: "group-hover:text-yellow-600"
            },
            orange: {
                bg: "bg-orange-100",
                bgHover: "group-hover:bg-orange-200/80",
                text: "text-orange-600",
                bar: "bg-orange-500",
                groupText: "group-hover:text-orange-600"
            },
            teal: {
                bg: "bg-teal-100",
                bgHover: "group-hover:bg-teal-200/80",
                text: "text-teal-600",
                bar: "bg-teal-500",
                groupText: "group-hover:text-teal-600"
            },
            indigo: {
                bg: "bg-indigo-100",
                bgHover: "group-hover:bg-indigo-200/80",
                text: "text-indigo-600",
                bar: "bg-indigo-500",
                groupText: "group-hover:text-indigo-600"
            }
        };
        return colors[accent] || colors.blue;
    };

    return (
        <div className="min-h-full pb-12">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900">Education Hub</h1>
                <p className="text-slate-500 mt-2 text-lg">Select a module to begin your learning journey.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {menuItems.map((item) => {
                    const theme = getColorClasses(item.accent);
                    return (
                        <div 
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${theme.bg} ${theme.text} group-hover:scale-110 transition-transform`}>
                                <item.icon size={32} weight="fill" />
                            </div>
                            
                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                {item.desc}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Home;
