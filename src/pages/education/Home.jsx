import { useState } from "react";
import { 
    BookOpen, 
    CalendarPlus, 
    Student, 
    Lightning, 
    Cube, 
    Wheelchair, 
    ArrowLeft 
} from "@phosphor-icons/react";

// Sub-components
import LearningCourses from "./LearningCourses";
import EventFinder from "./EventFinder";
import Scholarships from "./Scholarships";
import SkillDevelopment from "./SkillDevelopment";
import ImmersiveLearning from "./ImmersiveLearning";
import DisabilitySupport from "./DisabilitySupport";

const Home = () => {
    const [activeView, setActiveView] = useState("menu");

    const menuItems = [
        { 
            id: "courses", 
            title: "Learning Courses", 
            icon: BookOpen, 
            color: "text-blue-500", 
            bg: "bg-blue-50", 
            border: "hover:border-blue-200",
            desc: "Access premium video content and tutorials." 
        },
        { 
            id: "events", 
            title: "Event Finder", 
            icon: CalendarPlus, 
            color: "text-purple-500", 
            bg: "bg-purple-50", 
            border: "hover:border-purple-200",
            desc: "Workshops, seminars & local meetups." 
        },
        { 
            id: "scholarships", 
            title: "Scholarships", 
            icon: Student, 
            color: "text-yellow-500", 
            bg: "bg-yellow-50", 
            border: "hover:border-yellow-200",
            desc: "Financial aid & grant opportunities." 
        },
        { 
            id: "skills", 
            title: "Skill Development", 
            icon: Lightning, 
            color: "text-orange-500", 
            bg: "bg-orange-50", 
            border: "hover:border-orange-200",
            desc: "Track progress & earn certifications." 
        },
        { 
            id: "immersive", 
            title: "360° Learning", 
            icon: Cube, 
            color: "text-teal-500", 
            bg: "bg-teal-50", 
            border: "hover:border-teal-200",
            desc: "Interactive 3D object viewer & AR." 
        },
        { 
            id: "disability", 
            title: "Disability Support", 
            icon: Wheelchair, 
            color: "text-indigo-500", 
            bg: "bg-indigo-50", 
            border: "hover:border-indigo-200",
            desc: "Inclusive tools & accessibility settings." 
        },
    ];

    const renderView = () => {
        switch (activeView) {
            case "courses": return <LearningCourses />;
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

    return (
        <div className="min-h-full pb-12">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900">Education Hub</h1>
                <p className="text-slate-500 mt-2 text-lg">Select a module to begin your learning journey.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                    <div 
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
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
                                Explore Module <ArrowLeft className="rotate-180 ml-2" weight="bold"/>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
