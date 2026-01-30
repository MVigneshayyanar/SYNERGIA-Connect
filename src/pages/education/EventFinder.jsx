import { useState } from "react";
import { CalendarPlus, MapPin, Users, Ticket, CaretLeft, CaretRight, Plus, X } from "@phosphor-icons/react";

const EventFinder = () => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [showPostModal, setShowPostModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    const [events, setEvents] = useState([
        { id: 1, title: "Tech Career Fair 2024", date: "Mar 15", location: "City Convention Center", attendees: 120, type: "Career", color: "text-blue-600", bg: "bg-blue-100" },
        { id: 2, title: "Web Dev Workshop", date: "Mar 18", location: "Online (Zoom)", attendees: 450, type: "Workshop", color: "text-purple-600", bg: "bg-purple-100" },
        { id: 3, title: "Science Symposium", date: "Mar 22", location: "Main Auditorium", attendees: 85, type: "Seminar", color: "text-emerald-600", bg: "bg-emerald-100" },
    ]);

    const [formData, setFormData] = useState({
        title: "",
        dateFrom: "",
        dateTo: "",
        location: "",
        type: "Workshop",
        desc: "",
        poster: null
    });

    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        college: "",
        year: "",
        department: ""
    });

    // Simple Calendar Helpers
    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const changeMonth = (offset) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "poster") {
             setFormData({ ...formData, poster: files[0] });
        } else {
             setFormData({ ...formData, [name]: value });
        }
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({ ...registerData, [name]: value });
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        alert(`Successfully registered for ${selectedEvent.title}!`);
        setShowRegisterModal(false);
        setRegisterData({ name: "", email: "", college: "", year: "", department: "" });
    };

    const handlePostEvent = (e) => {
        e.preventDefault();
        
        // Determine colors based on type
        let color = "text-slate-600";
        let bg = "bg-slate-100";
        
        switch (formData.type) {
            case "Career": color = "text-blue-600"; bg = "bg-blue-100"; break;
            case "Workshop": color = "text-purple-600"; bg = "bg-purple-100"; break;
            case "Seminar": color = "text-emerald-600"; bg = "bg-emerald-100"; break;
            case "Meetup": color = "text-orange-600"; bg = "bg-orange-100"; break;
            case "Hackathon": color = "text-rose-600"; bg = "bg-rose-100"; break;
            case "Paper presentation": color = "text-yellow-600"; bg = "bg-yellow-100"; break;
            case "Tech Events": color = "text-indigo-600"; bg = "bg-indigo-100"; break;
            default: break;
        }

        const dateDisplay = formData.dateFrom === formData.dateTo 
            ? formData.dateFrom 
            : `${formData.dateFrom.split(' ')[0]} ${formData.dateFrom.split(' ')[1]} - ${formData.dateTo.split(' ')[1]}`;

        const newEvent = {
            id: events.length + 1,
            title: formData.title,
            date: dateDisplay, // approximate display logic
            location: formData.location,
            attendees: 0,
            type: formData.type,
            color,
            bg,
            poster: formData.poster ? URL.createObjectURL(formData.poster) : null
        };

        setEvents([newEvent, ...events]);
        setShowPostModal(false);
        setFormData({ title: "", dateFrom: "", dateTo: "", location: "", type: "Workshop", desc: "", poster: null });
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        // Empty slots for days before start
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
        }

        // Days
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = i === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
            days.push(
                <div key={i} className={`h-8 w-8 flex items-center justify-center rounded-full text-sm cursor-pointer hover:bg-slate-100 transition-colors ${isToday ? 'bg-slate-900 text-white hover:bg-slate-800' : 'text-slate-700'}`}>
                    {i}
                </div>
            );
        }

        return (
            <div className="absolute top-12 right-0 bg-white p-4 rounded-2xl shadow-xl border border-slate-200 z-50 w-72 animate-fade-in-up">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-600"><CaretLeft weight="bold"/></button>
                    <span className="font-bold text-slate-800">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                    <button onClick={() => changeMonth(1)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-600"><CaretRight weight="bold"/></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <span key={d} className="text-xs font-bold text-slate-400">{d}</span>)}
                </div>
                <div className="grid grid-cols-7 gap-1 place-items-center">
                    {days}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in relative" onClick={() => setShowCalendar(false)}>
             <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Event Finder</h2>
                    <p className="text-slate-500">Discover workshops, seminars, and meetups.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setShowPostModal(true)}
                        className="flex items-center px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md"
                    >
                        <Plus size={16} weight="bold" className="mr-2" />
                        Post Event
                    </button>
                    <div className="flex space-x-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm relative" onClick={(e) => e.stopPropagation()}>
                        <input type="text" placeholder="Search events..." className="px-4 py-2 bg-transparent text-sm focus:outline-none w-full md:w-48" />
                        <button 
                            className={`p-2 rounded-lg transition-colors ${showCalendar ? 'bg-slate-800 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                            onClick={() => setShowCalendar(!showCalendar)}
                        >
                            <CalendarPlus size={20} />
                        </button>
                        {showCalendar && renderCalendar()}
                    </div>
                </div>
            </div>

            {/* Post Event Modal */}
            {showPostModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xl font-bold text-slate-800">Post New Event</h3>
                            <button onClick={() => setShowPostModal(false)} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
                                <X size={20} weight="bold" />
                            </button>
                        </div>
                        <form onSubmit={handlePostEvent} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Event Title</label>
                                <input 
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    type="text" 
                                    placeholder="e.g. AI for Beginners Workshop" 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">From Date</label>
                                    <input 
                                        name="dateFrom"
                                        required
                                        value={formData.dateFrom}
                                        onChange={handleInputChange}
                                        type="text" 
                                        placeholder="e.g. Mar 18" 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">To Date</label>
                                    <input 
                                        name="dateTo"
                                        required
                                        value={formData.dateTo}
                                        onChange={handleInputChange}
                                        type="text" 
                                        placeholder="e.g. Mar 20" 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                                    <select 
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium appearance-none cursor-pointer"
                                    >
                                        <option value="Workshop">Workshop</option>
                                        <option value="Paper presentation">Paper presentation</option>
                                        <option value="Tech Events">Tech Events</option>
                                        <option value="Hackathon">Hackathon</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Event Poster</label>
                                    <label className="flex items-center justify-center w-full px-4 py-3 bg-slate-50 border border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                                        <span className="text-xs font-bold text-slate-500 truncate">{formData.poster ? formData.poster.name : "Upload Image"}</span>
                                        <input type="file" name="poster" onChange={handleInputChange} accept="image/*" className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                                <div className="relative">
                                    <input 
                                        name="location"
                                        required
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        type="text" 
                                        placeholder="e.g. Main Auditorium" 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium pr-10"
                                    />
                                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                                        <MapPin weight="fill" size={20} />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description / Criteria</label>
                                <textarea 
                                    name="desc"
                                    value={formData.desc}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Add event details and eligibility criteria..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none"
                                ></textarea>
                            </div>

                            <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all mt-2">
                                Publish Event
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Registration Modal */}
            {showRegisterModal && selectedEvent && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Event Registration</h3>
                                <p className="text-xs text-slate-500 mt-1">Registering for: <span className="font-bold text-blue-600">{selectedEvent.title}</span></p>
                            </div>
                            <button onClick={() => setShowRegisterModal(false)} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
                                <X size={20} weight="bold" />
                            </button>
                        </div>
                        <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                                <input 
                                    name="name" required value={registerData.name} onChange={handleRegisterChange} type="text" placeholder="John Doe" 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                                <input 
                                    name="email" required value={registerData.email} onChange={handleRegisterChange} type="email" placeholder="john@example.com" 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">College Name</label>
                                <input 
                                    name="college" required value={registerData.college} onChange={handleRegisterChange} type="text" placeholder="University of Technology" 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Year of Study</label>
                                    <select 
                                        name="year" required value={registerData.year} onChange={handleRegisterChange} 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Year</option>
                                        <option value="1">1st Year</option>
                                        <option value="2">2nd Year</option>
                                        <option value="3">3rd Year</option>
                                        <option value="4">4th Year</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department</label>
                                    <input 
                                        name="department" required value={registerData.department} onChange={handleRegisterChange} type="text" placeholder="CSE, ECE, etc." 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            
                            <button type="submit" className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 active:scale-95 transition-all mt-4">
                                Confirm Registration
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {events.map((evt) => (
                    <div key={evt.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group flex flex-col md:flex-row gap-6 animate-slide-up">
                        {/* Date Badge or Poster */}
                        {evt.poster ? (
                            <img src={evt.poster} alt={evt.title} className="w-full md:w-24 h-24 rounded-2xl object-cover shrink-0 shadow-sm border border-slate-100" />
                        ) : (
                            <div className={`w-full md:w-24 h-24 ${evt.bg} ${evt.color} rounded-2xl flex flex-col items-center justify-center shrink-0`}>
                                <span className="text-xs font-bold uppercase tracking-wider opacity-70">{evt.date.split(' ')[0]}</span>
                                <span className="text-3xl font-bold">{evt.date.split(' ')[1]}</span>
                            </div>
                        )}
                        
                        {/* Event Info */}
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className={`text-xs font-bold px-2.5 py-1 ${evt.bg} ${evt.color} rounded-full`}>{evt.type}</span>
                                {evt.location.toLowerCase().includes("online") && <span className="text-xs font-bold px-2.5 py-1 bg-green-100 text-green-700 rounded-full">Remote</span>}
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
                             <button 
                                onClick={() => { setSelectedEvent(evt); setShowRegisterModal(true); }}
                                className="flex-1 md:flex-none px-6 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center shadow-md shadow-slate-900/10"
                             >
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
