import { useState } from "react";
import {
  Bus,
  Train,
  Car,
  Bicycle,
  Wheelchair,
  MapTrifold,
  ArrowLeft,
  MapPin,
  Clock,
  NavigationArrow
} from "@phosphor-icons/react";

// Sub-components (Placeholders for now)
const BusSchedule = ({ onBack }) => (
    <div className="animate-fade-in">
        <h2 className="text-2xl font-bold mb-4">Campus Shuttle Schedules</h2>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4 border-b pb-4">
                <div>
                    <h3 className="font-bold text-lg">Route A: Main Gate - Library</h3>
                    <p className="text-slate-500 text-sm">Every 15 mins</p>
                </div>
                <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">On Time</span>
            </div>
            <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Next Bus</span>
                    <span className="font-bold">5 mins</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Following</span>
                    <span className="font-bold">20 mins</span>
                 </div>
            </div>
        </div>
    </div>
);

const MetroMap = ({ onBack }) => (
    <div className="animate-fade-in">
        <h2 className="text-2xl font-bold mb-4">Metro Connectivity</h2>
        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 text-center">
            <Train size={48} className="text-purple-600 mx-auto mb-4" />
            <p className="text-purple-800 font-medium">Nearest Station: University Central (Line 3)</p>
            <p className="text-purple-600 text-sm mt-2">Shuttles available from Gate 2 every 10 mins.</p>
        </div>
    </div>
);

const Carpool = ({ onBack }) => (
    <div className="animate-fade-in">
        <h2 className="text-2xl font-bold mb-4">Ride Sharing</h2>
        <p className="text-slate-500 mb-6">Find rides with fellow students.</p>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <Car size={24} weight="fill" />
            </div>
            <div>
                 <h4 className="font-bold">Active Pools: 12</h4>
                 <p className="text-xs text-slate-500">Save money and reduce carbon footprint.</p>
            </div>
            <button className="ml-auto bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Find Ride</button>
        </div>
    </div>
);

const AccessibleTransport = ({ onBack }) => (
    <div className="animate-fade-in">
        <h2 className="text-2xl font-bold mb-4">Accessible Transit</h2>
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
             <div className="flex items-start gap-4">
                <Wheelchair size={32} className="text-indigo-600 mt-1" />
                <div>
                    <h3 className="font-bold text-indigo-900">Wheelchair Assistance Vehicle</h3>
                    <p className="text-indigo-700 text-sm mt-1">Book a dedicated vehicle for campus movement.</p>
                    <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Request Now</button>
                </div>
             </div>
        </div>
    </div>
);


const Transport = () => {
    const [activeView, setActiveView] = useState("menu");

    const menuItems = [
        { 
            id: "bus", 
            title: "Campus Shuttle", 
            icon: Bus, 
            accent: "blue",
            desc: "Live tracking & schedules for university buses." 
        },
        { 
            id: "metro", 
            title: "Metro & Rail", 
            icon: Train, 
            accent: "purple",
            desc: "Connect to city transit networks." 
        },
        { 
            id: "carpool", 
            title: "Ride Sharing", 
            icon: Car, 
            accent: "green",
            desc: "Find peers to carpool with securely." 
        },
        { 
            id: "bicycles", 
            title: "Micro Mobility", 
            icon: Bicycle, 
            accent: "orange",
            desc: "Rent e-bikes and scooters on campus." 
        },
        { 
            id: "accessibility", 
            title: "Accessible Transit", 
            icon: Wheelchair, 
            accent: "indigo",
            desc: "Book wheelchair-accessible vehicles." 
        },
        { 
            id: "map", 
            title: "Live Map", 
            icon: MapTrifold, 
            accent: "red",
            desc: "Real-time view of all transport options." 
        },
    ];

    const renderView = () => {
        switch (activeView) {
            case "bus": return <BusSchedule onBack={() => setActiveView("menu")} />;
            case "metro": return <MetroMap onBack={() => setActiveView("menu")} />;
            case "carpool": return <Carpool onBack={() => setActiveView("menu")} />;
            case "accessibility": return <AccessibleTransport onBack={() => setActiveView("menu")} />;
            case "map": return <div className="p-10 text-center">Live Map Component Coming Soon <button onClick={() => setActiveView("menu")} className="block mt-4 text-blue-600 mx-auto">Back</button></div>;
            case "bicycles": return <div className="p-10 text-center">Bicycles Component Coming Soon <button onClick={() => setActiveView("menu")} className="block mt-4 text-blue-600 mx-auto">Back</button></div>;
            default: return null;
        }
    };

    // Helper to get color classes based on accent
    const getColorClasses = (accent) => {
        const colors = {
            blue: { bg: "bg-blue-100", text: "text-blue-600" },
            purple: { bg: "bg-purple-100", text: "text-purple-600" },
            green: { bg: "bg-emerald-100", text: "text-emerald-600" },
            orange: { bg: "bg-orange-100", text: "text-orange-600" },
            indigo: { bg: "bg-indigo-100", text: "text-indigo-600" },
            red: { bg: "bg-red-100", text: "text-red-600" },
        };
        return colors[accent] || colors.blue;
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
                    Back to Transport Hub
                </button>
                {renderView()}
            </div>
        );
    }

    return (
        <div className="min-h-full pb-12 animate-fade-in">
             <div className="mb-10 relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 shadow-xl">
                <div className="relative z-10 w-full md:w-2/3">
                    <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Smart Mobility</span>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">Getting Around Campus Made Easy</h1>
                    <p className="text-white/70 text-lg mb-8 max-w-xl">
                        Real-time schedules, sustainable travel options, and seamless connectivity for students and staff.
                    </p>
                    <div className="flex gap-4">
                        <button onClick={() => setActiveView("bus")} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center shadow-lg shadow-blue-600/30">
                           <Bus className="mr-2" weight="fill"/> Find Shuttle
                        </button>
                        <button onClick={() => setActiveView("map")} className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center">
                           <MapPin className="mr-2" weight="fill"/> Live Map
                        </button>
                    </div>
                </div>
                
                {/* Decorative Illustration (CSS Shapes or Icon Composition) */}
                <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 hidden md:block">
                     <div className="absolute right-10 bottom-10 transform rotate-12">
                         <Bus size={280} weight="duotone" className="text-white"/>
                     </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => {
                    const theme = getColorClasses(item.accent);
                    return (
                        <div 
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 relative overflow-hidden"
                        >
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${theme.bg} ${theme.text} group-hover:scale-110 transition-transform`}>
                                <item.icon size={28} weight="fill" />
                            </div>
                            
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                {item.desc}
                            </p>
                            
                             <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                <ArrowLeft size={20} className="text-slate-300 rotate-180" weight="bold"/>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Transport;
