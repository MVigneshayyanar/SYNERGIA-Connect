import { useState, useEffect } from "react";
import { 
    CalendarPlus, 
    Student, 
    Cube, 
    Wheelchair, 
    ArrowLeft,
    Trophy,
    Clock,
    MapPin
} from "@phosphor-icons/react";
import { db } from "../../firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

// Sub-components
import EventFinder from "./EventFinder";
import Scholarships from "./Scholarships";
import ImmersiveLearning from "./ImmersiveLearning";
import DisabilitySupport from "./DisabilitySupport";

const Home = () => {
    const [activeView, setActiveView] = useState("menu");
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    // Mock user status since registration doesn't persist to user profile yet
    const [userStatus] = useState({
        eventsAttended: 12,
        nextEventFormatted: "Mar 15"
    });

    useEffect(() => {
        // Fetch recent events for the "Upcoming Events" section
        const q = query(
            collection(db, "events"), 
            orderBy("createdAt", "desc"), 
            limit(3)
        );
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const eventsData = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data() 
            }));
            setUpcomingEvents(eventsData);
        }, (error) => {
            console.error("Error fetching events:", error);
        });

        return () => unsubscribe();
    }, []);

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
        <div className="min-h-full pb-12 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Education Hub</h1>
                    <p className="text-slate-500 mt-2 text-lg">Your personalized learning dashboard.</p>
                </div>
            </div>

            {/* Status & Upcoming Events Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Status Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm md:col-span-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                        <Trophy className="mr-2 text-yellow-500" size={24} weight="fill"/>
                        My Activity
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Events Attended</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{userStatus.eventsAttended}</p>
                            </div>
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <CalendarPlus size={20} weight="fill"/>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Next Event</p>
                            <p className="font-semibold text-slate-800">Introduction to AI</p>
                            <p className="text-slate-500 text-sm mt-1">{userStatus.nextEventFormatted} • 10:00 AM</p>
                        </div>
                    </div>
                </div>

                {/* Approaching Events List */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm md:col-span-2">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                        <Clock className="mr-2 text-purple-500" size={24} weight="fill"/>
                        Upcoming Events
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {upcomingEvents.length > 0 ? (
                            upcomingEvents.map(evt => (
                                <div key={evt.id} className="group p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all cursor-pointer" onClick={() => setActiveView('events')}>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-1 ${evt.bg || 'bg-slate-200'} ${evt.color || 'text-slate-600'} rounded-full`}>
                                            {evt.type || "Event"}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400">{evt.date}</span>
                                    </div>
                                    <h4 className="font-bold text-slate-800 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">{evt.title}</h4>
                                    <div className="flex items-center text-xs text-slate-500">
                                        <MapPin size={14} className="mr-1"/>
                                        <span className="truncate">{evt.location}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-8 text-center text-slate-400">
                                <p>No upcoming events found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 pt-4">Explore Modules</h3>
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
