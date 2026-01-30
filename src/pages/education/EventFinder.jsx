import { CalendarPlus, MapPin, Users, Ticket } from "@phosphor-icons/react";

const EventFinder = () => {
    const events = [
        { id: 1, title: "Tech Career Fair 2024", date: "Mar 15", location: "City Convention Center", attendees: 120, type: "Career", color: "text-blue-600", bg: "bg-blue-100" },
        { id: 2, title: "Web Dev Workshop", date: "Mar 18", location: "Online (Zoom)", attendees: 450, type: "Workshop", color: "text-purple-600", bg: "bg-purple-100" },
        { id: 3, title: "Science Symposium", date: "Mar 22", location: "Main Auditorium", attendees: 85, type: "Seminar", color: "text-emerald-600", bg: "bg-emerald-100" },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Event Finder</h2>
                    <p className="text-slate-500">Discover workshops, seminars, and meetups.</p>
                </div>
                <div className="flex space-x-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    <input type="text" placeholder="Search events..." className="px-4 py-2 bg-transparent text-sm focus:outline-none w-full md:w-64" />
                    <button className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
                        <CalendarPlus size={20} />
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {events.map((evt) => (
                    <div key={evt.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group flex flex-col md:flex-row gap-6">
                        {/* Date Badge */}
                        <div className={`w-full md:w-24 h-24 ${evt.bg} ${evt.color} rounded-2xl flex flex-col items-center justify-center shrink-0`}>
                            <span className="text-xs font-bold uppercase tracking-wider opacity-70">{evt.date.split(' ')[0]}</span>
                            <span className="text-3xl font-bold">{evt.date.split(' ')[1]}</span>
                        </div>
                        
                        {/* Event Info */}
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className={`text-xs font-bold px-2.5 py-1 ${evt.bg} ${evt.color} rounded-full`}>{evt.type}</span>
                                {evt.location.includes("Online") && <span className="text-xs font-bold px-2.5 py-1 bg-green-100 text-green-700 rounded-full">Remote</span>}
                            </div>
                            <h3 className="font-bold text-slate-800 text-xl mb-2 group-hover:text-teal-600 transition-colors">{evt.title}</h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center"><MapPin className="mr-1.5" size={16} weight="fill"/> {evt.location}</span>
                                <span className="flex items-center"><Users className="mr-1.5" size={16} weight="fill"/> {evt.attendees} Registered</span>
                            </div>
                        </div>

                        {/* Action */}
                        <div className="flex md:flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                             <button className="flex-1 md:flex-none px-6 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center justify-center">
                                Details
                             </button>
                             <button className="flex-1 md:flex-none px-6 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center shadow-md shadow-slate-900/10">
                                <Ticket className="mr-2" size={16} weight="bold"/> Register
                             </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventFinder;
