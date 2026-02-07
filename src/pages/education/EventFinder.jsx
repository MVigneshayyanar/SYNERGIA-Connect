import { useState, useEffect, useRef } from "react";
import { CalendarPlus, MapPin, Users, Ticket, CaretLeft, CaretRight, Plus, X, Trash, Globe, Spinner } from "@phosphor-icons/react";
import { db, storage, auth } from "../../firebase";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc, increment, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

// Backend API URL
const API_URL = import.meta.env.PROD
    ? 'https://synergia-connect.onrender.com'
    : 'http://localhost:3001';

const EventFinder = () => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [showPostModal, setShowPostModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
    const [registrationsList, setRegistrationsList] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null); // For date filtering

    const [events, setEvents] = useState([]);
    const [knowafestEvents, setKnowafestEvents] = useState([]);
    const [isLoadingKnowafest, setIsLoadingKnowafest] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const locationInputRef = useRef(null);
    const collegeInputRef = useRef(null);

    // Load Google Maps Script
    useEffect(() => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }
    }, []);

    // Initialize Autocomplete when Modal Opens
    useEffect(() => {
        if (showPostModal && window.google && locationInputRef.current) {
            const autocomplete = new window.google.maps.places.Autocomplete(locationInputRef.current, {
                types: ['geocode', 'establishment']
            });

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (place.formatted_address || place.name) {
                    setFormData(prev => ({
                        ...prev,
                        location: place.name || place.formatted_address
                    }));
                }
            });
        }
    }, [showPostModal]);

    // Initialize Autocomplete for College Input
    useEffect(() => {
        if (showRegisterModal && window.google && collegeInputRef.current) {
            const autocomplete = new window.google.maps.places.Autocomplete(collegeInputRef.current, {
                types: ['establishment'],
                fields: ['name', 'formatted_address']
            });

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (place.name) {
                    setRegisterData(prev => ({
                        ...prev,
                        college: place.name
                    }));
                }
            });
        }
    }, [showRegisterModal]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        console.log("Initializing Event Listener...");
        // Try ordering by createdAt. If it fails (index needed), we might fall back or alert.
        const q = query(collection(db, "events"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log("Snapshot received!", snapshot.docs.length, "docs");
            const eventsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEvents(eventsData);
        }, (error) => {
            console.error("Error fetching events:", error);
            if (error.code === 'failed-precondition') {
                alert("Error: Missing Firestore Index. Please check console for the link to create it.");
            } else if (error.code === 'permission-denied') {
                alert("Error: Permission Denied. Please check Firestore Rules.");
            } else {
                alert(`Error loading events: ${error.message}`);
            }
        });
        return () => unsubscribe();
    }, []);

    // Fetch external events from backend (Knowafest + AllEvents.in)
    useEffect(() => {
        const fetchExternalEvents = async () => {
            setIsLoadingKnowafest(true);
            try {
                // Fetch from both sources in parallel
                const [knowafestRes, alleventsRes] = await Promise.all([
                    fetch(`${API_URL}/api/events`).then(r => r.json()).catch(() => ({ events: [] })),
                    fetch(`${API_URL}/api/allevents`).then(r => r.json()).catch(() => ({ events: [] }))
                ]);

                const knowafest = knowafestRes.events || [];
                const allevents = alleventsRes.events || [];

                // Combine both sources
                const combined = [...knowafest, ...allevents];
                setKnowafestEvents(combined);
                console.log(`Loaded ${knowafest.length} Knowafest + ${allevents.length} AllEvents.in = ${combined.length} total external events`);
            } catch (error) {
                console.error('Failed to fetch external events:', error);
            } finally {
                setIsLoadingKnowafest(false);
            }
        };

        fetchExternalEvents();
    }, []);

    // Combine Firebase and external events
    const allEventsUnfiltered = [...events, ...knowafestEvents];

    // Helper function to check if event date matches selected date
    const matchesSelectedDate = (eventDate) => {
        if (!selectedDate || !eventDate) return true;

        // Parse various date formats
        const eventDateStr = eventDate.toLowerCase();
        const selectedDay = selectedDate.getDate();
        const selectedMonth = selectedDate.toLocaleString('default', { month: 'short' }).toLowerCase();
        const selectedMonthLong = selectedDate.toLocaleString('default', { month: 'long' }).toLowerCase();
        const selectedYear = selectedDate.getFullYear();

        // Use regex to match exact day number with word boundaries
        // This prevents "9" from matching "19" or "29"
        const dayRegex = new RegExp(`\\b${selectedDay}(st|nd|rd|th)?\\b`, 'i');
        const hasDay = dayRegex.test(eventDateStr);
        const hasMonth = eventDateStr.includes(selectedMonth) || eventDateStr.includes(selectedMonthLong);
        const hasYear = eventDateStr.includes(`${selectedYear}`);

        return hasDay && hasMonth && hasYear;
    };

    // Filter events by selected date
    const allEvents = selectedDate
        ? allEventsUnfiltered.filter(evt => matchesSelectedDate(evt.date))
        : allEventsUnfiltered;

    // Handle Knowafest event registration - fetch actual registration link
    const handleKnowafestRegister = async (eventLink) => {
        try {
            // Show loading state briefly
            const response = await fetch(`${API_URL}/api/event-register?url=${encodeURIComponent(eventLink)}`);
            const data = await response.json();

            if (data.registerLink) {
                window.open(data.registerLink, '_blank');
            } else {
                window.open(eventLink, '_blank');
            }
        } catch (error) {
            console.error('Error fetching registration link:', error);
            window.open(eventLink, '_blank');
        }
    };

    const initialFormState = {
        title: "",
        dateFrom: "",
        dateTo: "",
        location: "",
        type: "Workshop",
        desc: "",
        poster: null
    };

    const [formData, setFormData] = useState(initialFormState);

    const closePostModal = () => {
        setShowPostModal(false);
        setFormData(initialFormState);
    };

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

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Add registration to 'registrations' subcollection
            await addDoc(collection(db, "events", selectedEvent.id, "registrations"), {
                ...registerData,
                submittedAt: serverTimestamp(),
                userId: currentUser ? currentUser.uid : "anonymous"
            });

            // 2. Increment attendees count on the event document
            const eventRef = doc(db, "events", selectedEvent.id);
            await updateDoc(eventRef, {
                attendees: increment(1)
            });

            alert(`Successfully registered for ${selectedEvent.title}!`);
            setShowRegisterModal(false);
            setRegisterData({ name: "", email: "", college: "", year: "", department: "" });
        } catch (error) {
            console.error("Error registering:", error);
            alert("Failed to register. Please try again.");
        }
    };

    const handleViewRegistrations = async (event) => {
        setSelectedEvent(event);
        try {
            const q = query(collection(db, "events", event.id, "registrations"), orderBy("submittedAt", "desc"));
            const querySnapshot = await getDocs(q);
            const regs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRegistrationsList(regs);
            setShowRegistrationsModal(true);
        } catch (error) {
            console.error("Error fetching registrations:", error);
            alert("Failed to load registrations.");
        }
    };

    const handlePostEvent = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
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

            // Format Dates from YYYY-MM-DD to "Mar 18"
            const formatDate = (dateStr) => {
                if (!dateStr) return "";
                const date = new Date(dateStr);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            };

            const startStr = formatDate(formData.dateFrom);
            const endStr = formatDate(formData.dateTo);

            const dateDisplay = startStr === endStr
                ? startStr
                : `${startStr} - ${endStr}`;

            let posterUrl = null;
            if (formData.poster) {
                const storageRef = ref(storage, `event-posters/${Date.now()}_${formData.poster.name}`);
                await uploadBytes(storageRef, formData.poster);
                posterUrl = await getDownloadURL(storageRef);
            }

            await addDoc(collection(db, "events"), {
                title: formData.title,
                date: dateDisplay,
                location: formData.location,
                attendees: 0,
                type: formData.type,
                color,
                bg,
                poster: posterUrl,
                desc: formData.desc,
                userId: currentUser ? currentUser.uid : "anonymous",
                createdAt: serverTimestamp()
            });

            closePostModal();
            // setFormData(initialFormState) is called inside closePostModal, but logic below was doing it manually.
            // Actually closePostModal does both.
        } catch (error) {
            console.error("Error adding event: ", error);
            alert(`Failed to post event. Reason: ${error.message}`);
        } finally {
        }
    };

    const handleDeleteEvent = async (event) => {
        if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
            try {
                // Optimistic UI update for instant feedback
                setEvents(prev => prev.filter(e => e.id !== event.id));

                // 1. Delete Poster from Storage if it exists
                if (event.poster) {
                    try {
                        const imageRef = ref(storage, event.poster);
                        await deleteObject(imageRef);
                    } catch (imgError) {
                        console.warn("Failed to delete poster image:", imgError);
                        // Continue to delete doc even if image fails
                    }
                }

                // 2. Delete Document from Firestore
                await deleteDoc(doc(db, "events", event.id));
                alert("Event deleted successfully.");
            } catch (error) {
                console.error("Error deleting event:", error);
                alert("Failed to delete event.");
                // Optionally revert UI here if needed, but onSnapshot usually handles sync.
            }
        }
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
            const thisDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const isSelected = selectedDate && thisDate.toDateString() === selectedDate.toDateString();

            days.push(
                <div
                    key={i}
                    onClick={() => {
                        setSelectedDate(thisDate);
                        setShowCalendar(false);
                    }}
                    className={`h-8 w-8 flex items-center justify-center rounded-full text-sm cursor-pointer transition-colors 
                        ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-700' :
                            isToday ? 'bg-slate-900 text-white hover:bg-slate-800' :
                                'text-slate-700 hover:bg-slate-100'}`}
                >
                    {i}
                </div>
            );
        }

        return (
            <div className="absolute top-12 right-0 bg-white p-4 rounded-2xl shadow-xl border border-slate-200 z-50 w-72 animate-fade-in-up">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-600"><CaretLeft weight="bold" /></button>
                    <span className="font-bold text-slate-800">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                    <button onClick={() => changeMonth(1)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-600"><CaretRight weight="bold" /></button>
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
                    {/* Show selected date filter with clear button */}
                    {selectedDate && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium">
                            <span>{selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            <button
                                onClick={() => setSelectedDate(null)}
                                className="p-0.5 hover:bg-blue-200 rounded-full"
                            >
                                <X size={14} weight="bold" />
                            </button>
                        </div>
                    )}
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

            {/* Event Details Modal */}
            {showDetailsModal && selectedEvent && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowDetailsModal(false)}>
                    <div
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative">
                            {selectedEvent.poster ? (
                                <div className="h-48 w-full bg-slate-100 relative">
                                    <img src={selectedEvent.poster} alt={selectedEvent.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                </div>
                            ) : (
                                <div className={`h-32 w-full ${selectedEvent.bg || 'bg-slate-100'} flex items-center justify-center`}>
                                    <CalendarPlus size={48} className={`opacity-20 ${selectedEvent.color || 'text-slate-600'}`} />
                                </div>
                            )}
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-full transition-all"
                            >
                                <X size={20} weight="bold" />
                            </button>
                        </div>

                        <div className="p-8">
                            <span className={`text-xs font-bold px-3 py-1 ${selectedEvent.bg || 'bg-slate-100'} ${selectedEvent.color || 'text-slate-600'} rounded-full mb-3 inline-block`}>
                                {selectedEvent.type || "Event"}
                            </span>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedEvent.title}</h2>

                            <div className="flex flex-col gap-2 mb-6 text-slate-600 text-sm">
                                <span className="flex items-center font-medium"><CalendarPlus className="mr-2 text-slate-400" size={18} /> {selectedEvent.date}</span>
                                <span className="flex items-center font-medium"><MapPin className="mr-2 text-slate-400" size={18} /> {selectedEvent.location}</span>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                                <h4 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">About Event</h4>
                                <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">
                                    {selectedEvent.desc || "No description provided."}
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    if (selectedEvent.isKnowafest && selectedEvent.link) {
                                        handleKnowafestRegister(selectedEvent.link);
                                    } else if (selectedEvent.isAllevents && selectedEvent.link) {
                                        window.open(selectedEvent.link, '_blank');
                                    } else {
                                        setShowRegisterModal(true);
                                    }
                                }}
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center"
                            >
                                <Ticket className="mr-2" size={18} weight="bold" /> Register Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Post Event Modal */}
            {showPostModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xl font-bold text-slate-800">Post New Event</h3>
                            <button onClick={closePostModal} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
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
                                        type="date"
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
                                        type="date"
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
                                    <style>{`
                                        .pac-container { z-index: 10005 !important; } 
                                    `}</style>
                                    <input
                                        name="location"
                                        ref={locationInputRef}
                                        required
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        type="text"
                                        placeholder="Search for an address or place..."
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
                                    required
                                    value={formData.desc}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Add event details and eligibility criteria..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all mt-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? "Publishing..." : "Publish Event"}
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
                                    name="college"
                                    ref={collegeInputRef}
                                    required
                                    value={registerData.college}
                                    onChange={handleRegisterChange}
                                    type="text"
                                    placeholder="Search for University/College..."
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

            {/* Registrations List Modal (Owner Only) */}
            {showRegistrationsModal && selectedEvent && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden animate-scale-in max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Registered Users</h3>
                                <p className="text-xs text-slate-500 mt-1">Event: <span className="font-bold text-blue-600">{selectedEvent.title}</span></p>
                            </div>
                            <button onClick={() => setShowRegistrationsModal(false)} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
                                <X size={20} weight="bold" />
                            </button>
                        </div>
                        <div className="p-0 overflow-y-auto">
                            {registrationsList.length === 0 ? (
                                <div className="p-12 text-center text-slate-400">
                                    <Users size={48} className="mx-auto mb-3 opacity-20" />
                                    <p>No registrations yet.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 sticky top-0 z-10">
                                        <tr>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b border-slate-100">Name</th>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b border-slate-100">Email</th>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b border-slate-100">College</th>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b border-slate-100">Dept/Year</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {registrationsList.map((reg) => (
                                            <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="p-4 text-sm font-bold text-slate-700">{reg.name}</td>
                                                <td className="p-4 text-sm text-slate-600">{reg.email}</td>
                                                <td className="p-4 text-sm text-slate-600">{reg.college}</td>
                                                <td className="p-4 text-sm text-slate-500">{reg.department} <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 ml-1">Yr {reg.year}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex justify-end shrink-0">
                            <button onClick={() => setShowRegistrationsModal(false)} className="px-6 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {isLoadingKnowafest && (
                    <div className="flex items-center justify-center py-8 bg-white rounded-2xl border border-slate-100">
                        <Spinner size={24} className="text-blue-500 animate-spin mr-2" />
                        <span className="text-slate-500">Loading college fests from Knowafest...</span>
                    </div>
                )}
                {allEvents.map((evt) => {
                    // Robust Date Parsing
                    // Expected formats: "Mar 18", "Mar 18 - Mar 20", "13th Feb 2026"
                    let month = "TBD";
                    let day = "??";

                    if (evt.date) {
                        const dateStr = evt.date.split('-')[0].trim();
                        // Try "13th Feb 2026" format first
                        const match1 = dateStr.match(/(\d+)(?:st|nd|rd|th)?\s*([a-zA-Z]+)/i);
                        // Try "Mar 18" format
                        const match2 = dateStr.match(/([a-zA-Z]+)\s+(\d+)/);

                        if (match1) {
                            day = match1[1];
                            month = match1[2].substring(0, 3);
                        } else if (match2) {
                            month = match2[1];
                            day = match2[2];
                        }
                    }

                    const location = evt.location || "Location TBD";
                    const isExternal = evt.isKnowafest || evt.isAllevents;

                    return (
                        <div key={evt.id} className={`bg-white p-6 rounded-2xl border shadow-sm hover:shadow-lg transition-all group flex flex-col md:flex-row gap-6 animate-slide-up ${isExternal ? 'border-blue-100' : 'border-slate-100'}`}>
                            {/* Date Badge or Poster */}
                            {evt.poster ? (
                                <img src={evt.poster} alt={evt.title || "Event"} className="w-full md:w-24 h-24 rounded-2xl object-cover shrink-0 shadow-sm border border-slate-100" />
                            ) : (
                                <div className={`w-full md:w-24 h-24 ${evt.bg || 'bg-slate-100'} ${evt.color || 'text-slate-600'} rounded-2xl flex flex-col items-center justify-center shrink-0 relative`}>
                                    <span className="text-xs font-bold uppercase tracking-wider opacity-70">{month}</span>
                                    <span className="text-3xl font-bold">{day}</span>
                                    {isExternal && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                            <Globe size={12} weight="bold" className="text-white" />
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Event Info */}
                            <div className="flex-1">
                                <div className="flex items-center flex-wrap gap-2 mb-2">
                                    <span className={`text-xs font-bold px-2.5 py-1 ${evt.bg || 'bg-slate-100'} ${evt.color || 'text-slate-600'} rounded-full`}>{evt.type || "Event"}</span>
                                    {location.toLowerCase().includes("online") && <span className="text-xs font-bold px-2.5 py-1 bg-green-100 text-green-700 rounded-full">Remote</span>}
                                    {isExternal && <span className="text-xs font-bold px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">{evt.isKnowafest ? 'Knowafest' : 'AllEvents'}</span>}
                                </div>
                                <h3 className="font-bold text-slate-800 text-xl mb-1 group-hover:text-teal-600 transition-colors">{evt.title || "Untitled Event"}</h3>
                                {evt.college && <p className="text-sm text-slate-600 mb-2">{evt.college}</p>}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                    <span className="flex items-center"><MapPin className="mr-1.5" size={16} weight="fill" /> {location}</span>
                                </div>
                            </div>

                            {/* Action */}
                            <div className="flex md:flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                                <button
                                    onClick={() => { setSelectedEvent(evt); setShowDetailsModal(true); }}
                                    className="flex-1 md:flex-none px-6 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center justify-center"
                                >
                                    Details
                                </button>

                                {isExternal ? (
                                    <button
                                        onClick={() => {
                                            if (evt.isKnowafest) handleKnowafestRegister(evt.link);
                                            else window.open(evt.link, '_blank');
                                        }}
                                        className="flex-1 md:flex-none px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center shadow-md shadow-blue-600/20"
                                    >
                                        <Ticket className="mr-2" size={16} weight="bold" /> Register
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => { setSelectedEvent(evt); setShowRegisterModal(true); }}
                                        className="flex-1 md:flex-none px-6 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center shadow-md shadow-slate-900/10"
                                    >
                                        <Ticket className="mr-2" size={16} weight="bold" /> Register
                                    </button>
                                )}

                                {/* Buttons for Owner (only for Firebase events) */}
                                {!isExternal && currentUser && evt.userId === currentUser.uid && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleViewRegistrations(evt); }}
                                            className="mt-2 md:mt-4 p-2 w-full text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center justify-center text-xs font-bold"
                                            title="View Registrations"
                                        >
                                            <Users size={16} weight="bold" className="mr-1" /> View Registrations
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteEvent(evt); }}
                                            className="mt-2 md:mt-4 p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center border border-transparent hover:border-red-100"
                                            title="Delete Event"
                                        >
                                            <Trash size={20} weight="bold" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default EventFinder;
