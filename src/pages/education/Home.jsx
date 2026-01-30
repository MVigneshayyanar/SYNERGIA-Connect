import { useState } from "react";
import { 
    CalendarPlus, 
    Student, 
    Lightning, 
    Cube, 
    Wheelchair, 
    ArrowLeft 
} from "@phosphor-icons/react";

// Sub-components
import EventFinder from "./EventFinder";
import Scholarships from "./Scholarships";
import SkillDevelopment from "./SkillDevelopment";
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
            id: "skills", 
            title: "Skill Development", 
            icon: Lightning, 
            accent: "orange",
            desc: "Track progress & earn certifications." 
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
            case "skills": return <SkillDevelopment />;
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {menuItems.map((item) => {
                    const theme = getColorClasses(item.accent);
                    return (
                        <div 
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group h-80 flex flex-col hover:-translate-y-1"
                        >
                            {/* Top Half - Image/Icon Area */}
                            <div className={`h-[55%] ${theme.bg} flex items-center justify-center relative ${theme.bgHover} transition-colors`}>
                                <div className={`w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-sm ${theme.text}`}>
                                    <item.icon size={36} weight="duotone" />
                                </div>
                            </div>

                            {/* Bottom Half - Content Area */}
                            <div className="h-[45%] p-6 flex flex-col justify-center bg-white relative">
                                {/* Decorative 'Title Bar' pill from reference */}
                                <div className={`w-12 h-1.5 rounded-full ${theme.bar} mb-4 opacity-80`}></div>
                                
                                <h3 className={`text-xl font-bold text-slate-900 mb-2 ${theme.groupText} transition-colors`}>
                                    {item.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-2">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Home;
