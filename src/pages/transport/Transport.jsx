import { useState, useEffect } from "react";
import {
    Bus,
    Train,
    Car,
    MapTrifold,
    ArrowLeft,
    MapPin,
    Clock,
    NavigationArrow,
    User,
    Calendar,
    CurrencyInr,
    Plus,
    CheckCircle,
    X,
    Ticket,
    Armchair,
    SunHorizon
} from "@phosphor-icons/react";
import { loadGoogleMaps } from "../../utils/googleMaps";
import busRouteImg from "../../assets/images/bus_route.png";
import bookingSuccessImg from "../../assets/images/booking_success.png";
import carpoolImg from "../../assets/images/carpool.png";

const LocationInput = ({ placeholder, value, onChange, icon, ringColor }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleInput = async (e) => {
        const val = e.target.value;
        onChange(val);

        if (!val || val.length < 3) {
            setSuggestions([]);
            return;
        }

        try {
            const googleMaps = await loadGoogleMaps(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
            const autocompleteService = new googleMaps.places.AutocompleteService();

            autocompleteService.getPlacePredictions({ input: val, componentRestrictions: { country: "in" } }, (predictions, status) => {
                if (status === googleMaps.places.PlacesServiceStatus.OK && predictions) {
                    setSuggestions(predictions);
                    setShowSuggestions(true);
                } else {
                    setSuggestions([]);
                }
            });
        } catch (error) {
            console.error("Error fetching places:", error);
        }
    };

    const handleSelect = (description) => {
        onChange(description);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <div className="relative">
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 ${icon.bg} rounded-lg flex items-center justify-center ${icon.text}`}>
                {icon.component}
            </div>
            <input
                type="text"
                placeholder={placeholder}
                className={`w-full pl-16 pr-4 py-4 bg-slate-50 border-0 rounded-xl focus:ring-2 ${ringColor} font-medium transition-all`}
                value={value}
                onChange={handleInput}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                required
            />
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 max-h-60 overflow-y-auto">
                    {suggestions.map((item) => (
                        <div
                            key={item.place_id}
                            className="p-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 border-b border-slate-50 last:border-0"
                            onClick={() => handleSelect(item.description)}
                        >
                            <MapPin className="text-slate-400 min-w-[16px]" size={16} />
                            <div>
                                <p className="text-sm font-bold text-slate-800">{item.structured_formatting.main_text}</p>
                                <p className="text-xs text-slate-500">{item.structured_formatting.secondary_text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const BusSchedule = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState("routes"); // 'routes' or 'booking'

    // Google Maps Logic (Public Routes)
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Booking Logic
    const [bookingStep, setBookingStep] = useState("search"); // 'search', 'list', 'seats', 'success'
    const [searchParams, setSearchParams] = useState({ from: "", to: "", date: "" });
    const [selectedBus, setSelectedBus] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);

    const handleGoogleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setRoutes([]);

        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            setError("Google Maps API Key is missing.");
            setLoading(false);
            return;
        }

        try {
            const googleMaps = await loadGoogleMaps(apiKey);
            const directionsService = new googleMaps.DirectionsService();

            directionsService.route(
                {
                    origin: source,
                    destination: destination,
                    travelMode: googleMaps.TravelMode.TRANSIT,
                    transitOptions: { modes: [googleMaps.TransitMode.BUS] },
                    provideRouteAlternatives: true
                },
                (result, status) => {
                    if (status === googleMaps.DirectionsStatus.OK) {
                        const sortedRoutes = result.routes.sort((a, b) => {
                            const timeA = a.legs[0].departure_time?.value || 0;
                            const timeB = b.legs[0].departure_time?.value || 0;
                            return timeA - timeB;
                        });
                        setRoutes(sortedRoutes);
                    } else {
                        setError(`Could not find bus routes: ${status}`);
                    }
                    setLoading(false);
                }
            );
        } catch (err) {
            setError("Failed to load Google Maps API.");
            setLoading(false);
        }
    };

    // Dummy Buses Data
    const dummyBuses = [
        { id: 1, name: "SRM Transports", type: "Non-AC Seater (2+2)", rating: 4.2, dep: "21:30", arr: "05:00", dur: "7h 30m", price: 450, seats: 40 },
        { id: 2, name: "Parveen Travels", type: "AC Sleeper (2+1)", rating: 4.8, dep: "22:15", arr: "06:00", dur: "7h 45m", price: 850, seats: 30 },
        { id: 3, name: "KPN Travels", type: "AC Semi-Sleeper", rating: 4.0, dep: "23:00", arr: "06:30", dur: "7h 30m", price: 600, seats: 36 }
    ].sort((a, b) => a.dep.localeCompare(b.dep));

    const handleSearchBooking = (e) => {
        e.preventDefault();
        setBookingStep("list");
    };

    const toggleSeat = (seatId) => {
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(id => id !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const renderSeatLayout = () => {
        // Simple 2x2 Layout for demo
        const rows = 10;
        return (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mx-auto max-w-xs relative">
                <div className="absolute top-2 right-4 text-slate-300">
                    <SteeringWheelIcon />
                </div>
                <div className="grid grid-cols-4 gap-3 mt-8">
                    {/* Walking path in middle? No, standard 2+2 */}
                    {Array.from({ length: 40 }).map((_, i) => {
                        const seatId = i + 1;
                        const isSelected = selectedSeats.includes(seatId);
                        const isBooked = [2, 5, 12, 18, 33].includes(seatId); // Mock booked seats

                        return (
                            <button
                                key={seatId}
                                disabled={isBooked}
                                onClick={() => toggleSeat(seatId)}
                                className={`
                                    w-8 h-8 rounded-lg flex items-center justify-center transition-all
                                    ${isBooked ? 'bg-red-100 text-red-300 cursor-not-allowed' :
                                        isSelected ? 'bg-green-500 text-white shadow-lg scale-110' : 'bg-white border border-slate-300 text-slate-400 hover:border-green-500 hover:text-green-500'}
                                `}
                            >
                                <Armchair weight={isSelected ? "fill" : "regular"} size={20} />
                            </button>
                        );
                    })}
                </div>
                <div className="flex justify-between mt-6 text-xs font-bold text-slate-500">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-white border border-slate-300 rounded"></div> Available</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded"></div> Selected</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-100 rounded"></div> Booked</div>
                </div>
            </div>
        );
    };

    // Helper for Steering Wheel Icon since I wasn't sure if I imported it. Using a simple circle div fallback if needed, but I'll use a div representation.
    const SteeringWheelIcon = () => (
        <div className="w-8 h-8 rounded-full border-4 border-slate-200 flex items-center justify-center opacity-50">
            <div className="w-full h-1 bg-slate-200"></div>
        </div>
    );

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <button
                    onClick={onBack}
                    className="mr-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-2xl font-bold text-slate-900">Bus Services</h2>
            </div>

            {/* Tabs */}
            <div className="flex bg-slate-100 p-1.5 rounded-xl mb-8 w-fit">
                <button
                    onClick={() => setActiveTab("routes")}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "routes" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                    <MapPin className="inline-block mr-2" weight="bold" /> Public Routes
                </button>
                <button
                    onClick={() => setActiveTab("booking")}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "booking" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                    <Ticket className="inline-block mr-2" weight="bold" /> Book Tickets
                </button>
            </div>

            {activeTab === "routes" && (
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 mb-8 animate-fade-in">
                    <h3 className="font-bold text-lg mb-4 text-slate-700">Find Public Transit Routes</h3>
                    <form onSubmit={handleGoogleSearch} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <LocationInput
                                placeholder="Starting Point (e.g., SRM University)"
                                value={source}
                                onChange={setSource}
                                icon={{ bg: "bg-blue-50", text: "text-blue-600", component: <MapPin size={18} weight="fill" /> }}
                                ringColor="focus:ring-blue-500"
                            />
                            <LocationInput
                                placeholder="Destination (e.g., Tambaram)"
                                value={destination}
                                onChange={setDestination}
                                icon={{ bg: "bg-indigo-50", text: "text-indigo-600", component: <NavigationArrow size={18} weight="fill" /> }}
                                ringColor="focus:ring-indigo-500"
                            />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                            {loading ? 'Searching...' : 'Find Routes'}
                        </button>
                    </form>

                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

                    <div className="mt-6 space-y-4">
                        {routes.map((route, index) => (
                            <div key={index} className="border-t border-slate-100 pt-4">
                                <div className="flex justify-between">
                                    <span className="font-bold text-slate-800">{route.legs[0].departure_time?.text}</span>
                                    <span className="text-slate-500">{route.legs[0].duration.text}</span>
                                </div>
                                <p className="text-sm text-slate-600 mt-1">{route.legs[0].steps.filter(s => s.travel_mode === 'TRANSIT')[0]?.transit?.line?.name || 'Bus'}</p>
                            </div>
                        ))}
                    </div>

                    {routes.length === 0 && !loading && !error && (
                        <div className="text-center py-12 text-slate-400">
                            <img src={busRouteImg} alt="Bus Route" className="mx-auto mb-6 w-64 opacity-80" />
                            <p>Enter locations to find bus schedules</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "booking" && (
                <div className="animate-fade-in">
                    {bookingStep === "search" && (
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-100">
                            <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2"><Bus className="text-blue-500" weight="fill" /> Search Intercity Buses</h3>
                            <form onSubmit={handleSearchBooking} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="relative">
                                        <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-1 block">From</label>
                                        <input required placeholder="Enter City" className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                    <div className="relative">
                                        <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-1 block">To</label>
                                        <input required placeholder="Enter City" className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                    <div className="relative">
                                        <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-1 block">Travel Date</label>
                                        <input required type="date" className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                </div>
                                <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all text-lg">
                                    Search Buses
                                </button>
                            </form>
                        </div>
                    )}

                    {bookingStep === "list" && (
                        <div>
                            <button onClick={() => setBookingStep("search")} className="mb-4 text-sm text-slate-500 font-bold hover:text-blue-600 flex items-center gap-1"><ArrowLeft /> Modify Search</button>
                            <div className="space-y-4">
                                {dummyBuses.map(bus => (
                                    <div key={bus.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                            <div>
                                                <h4 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                                    {bus.name} <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded flex items-center gap-1">★ {bus.rating}</span>
                                                </h4>
                                                <p className="text-sm text-slate-500 font-medium">{bus.type}</p>
                                                <div className="flex items-center gap-4 mt-3 text-slate-700 font-semibold">
                                                    <span>{bus.dep}</span>
                                                    <span className="text-xs text-slate-400">--- {bus.dur} ---</span>
                                                    <span>{bus.arr}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-slate-900 mb-2">₹{bus.price}</div>
                                                <button
                                                    onClick={() => { setSelectedBus(bus); setBookingStep("seats"); }}
                                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all w-full md:w-auto"
                                                >
                                                    View Seats
                                                </button>
                                                <p className="text-xs text-slate-400 mt-2 font-medium">{bus.seats} Seats left</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {bookingStep === "seats" && selectedBus && (
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1">
                                <button onClick={() => setBookingStep("list")} className="mb-4 text-sm text-slate-500 font-bold hover:text-blue-600 flex items-center gap-1"><ArrowLeft /> Back to List</button>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Select Seats</h3>
                                <p className="text-slate-500 mb-6">{selectedBus.name} • {selectedBus.type}</p>
                                {renderSeatLayout()}
                            </div>
                            <div className="w-full md:w-80 bg-white p-6 rounded-2xl border border-slate-200 h-fit shadow-xl">
                                <h4 className="font-bold text-lg mb-4 text-slate-800 border-b border-slate-100 pb-2">Booking Summary</h4>
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Seat(s)</span>
                                        <span className="font-bold text-slate-900">{selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Price</span>
                                        <span className="font-bold text-slate-900">₹{selectedBus.price} x {selectedSeats.length}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold border-t border-slate-100 pt-3">
                                        <span>Total</span>
                                        <span className="text-blue-600">₹{selectedBus.price * selectedSeats.length}</span>
                                    </div>
                                </div>
                                <button
                                    disabled={selectedSeats.length === 0}
                                    onClick={() => setBookingStep("success")}
                                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                                >
                                    Proceed to Pay
                                </button>
                            </div>
                        </div>
                    )}

                    {bookingStep === "success" && (
                        <div className="text-center py-12 bg-white rounded-3xl shadow-xl border border-slate-100">
                            <img src={bookingSuccessImg} alt="Booking Confirmed" className="mx-auto mb-6 w-48" />
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h3>
                            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Your tickets have been sent to your email. Have a safe journey!</p>
                            <button onClick={() => { setBookingStep("search"); setSelectedSeats([]); }} className="bg-slate-100 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all">
                                Book Another Ticket
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const Carpool = ({ onBack }) => {
    const [view, setView] = useState("browse"); // 'browse', 'create', 'details'
    const [selectedRide, setSelectedRide] = useState(null);
    const [notification, setNotification] = useState(null);

    // Dummy Data
    const [rides, setRides] = useState([
        {
            id: 1,
            driver: "Rahul S.",
            role: "Student (CSE)",
            rating: 4.8,
            source: "Tambaram",
            destination: "SRM Tech Park",
            date: "2024-03-20",
            time: "08:30 AM",
            seats: 3,
            cost: 40,
            car: "Swift Dzire (White)",
            verified: true
        },
        {
            id: 2,
            driver: "Dr. Priya M.",
            role: "Faculty",
            rating: 5.0,
            source: "Adyar",
            destination: "Main Block",
            date: "2024-03-20",
            time: "08:00 AM",
            seats: 2,
            cost: 80,
            car: "Honda City (Grey)",
            verified: true
        },
        {
            id: 3,
            driver: "Karthik",
            role: "Student (Mech)",
            rating: 4.5,
            source: "Guindy",
            destination: "SRM University",
            date: "2024-03-20",
            time: "07:45 AM",
            seats: 1,
            cost: 60,
            car: "Hyundai i20 (Red)",
            verified: false
        }
    ]);

    const handleCreateRide = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const newRide = {
            id: rides.length + 1,
            driver: "You",
            role: "Student",
            rating: 5.0,
            source: formData.get("source"),
            destination: formData.get("destination"),
            date: formData.get("date"),
            time: formData.get("time"),
            seats: parseInt(formData.get("seats")),
            cost: parseInt(formData.get("cost")),
            car: formData.get("car"),
            verified: true
        };

        setRides([newRide, ...rides]);
        setView("browse");
        setNotification({ type: "success", message: "Ride published successfully!" });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleBookRide = () => {
        setNotification({ type: "success", message: "Ride booked successfully! Driver will contact you." });
        setTimeout(() => {
            setNotification(null);
            setView("browse");
            setSelectedRide(null);
        }, 2000);
    };

    const renderBrowse = () => (
        <div className="animate-slide-up">
            <div className="mb-6 rounded-2xl overflow-hidden shadow-lg relative h-48">
                <img src={carpoolImg} alt="Carpool Community" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">Ride Together, Save Together</h2>
                </div>
            </div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Ride Sharing</h2>
                <button
                    onClick={() => setView("create")}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                >
                    <Plus weight="bold" /> Offer Ride
                </button>
            </div>

            <div className="grid gap-4">
                {rides.map(ride => (
                    <div key={ride.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={() => { setSelectedRide(ride); setView("details"); }}>
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                                    <User size={20} weight="fill" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                        {ride.driver}
                                        {ride.verified && <CheckCircle className="text-blue-500" weight="fill" size={14} />}
                                    </h4>
                                    <p className="text-xs text-slate-500 font-medium">{ride.role} • ★ {ride.rating}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-bold text-slate-900">₹{ride.cost}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-slate-700">
                            <span className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-500 uppercase font-bold tracking-wider">Route</span>
                            {ride.source} <ArrowLeft size={12} className="rotate-180 text-slate-400" /> {ride.destination}
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-50 pt-3 text-sm text-slate-500">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1"><Clock /> {ride.time}</span>
                                <span className="flex items-center gap-1"><Calendar /> {ride.date}</span>
                            </div>
                            <div className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                                {ride.seats} seats left
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderCreate = () => (
        <div className="animate-slide-up max-w-lg mx-auto bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Car weight="duotone" className="text-green-600" size={24} /> Offer a Ride
            </h3>
            <form onSubmit={handleCreateRide} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">From</label>
                        <input name="source" required placeholder="Source" className="w-full bg-slate-50 p-3 rounded-xl font-medium outline-none border border-transparent focus:border-green-500 focus:bg-white transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">To</label>
                        <input name="destination" required placeholder="Destination" className="w-full bg-slate-50 p-3 rounded-xl font-medium outline-none border border-transparent focus:border-green-500 focus:bg-white transition-all" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                        <input name="date" type="date" required className="w-full bg-slate-50 p-3 rounded-xl font-medium outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Time</label>
                        <input name="time" type="time" required className="w-full bg-slate-50 p-3 rounded-xl font-medium outline-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Car Details</label>
                    <input name="car" required placeholder="e.g. Toyota Etios (TN-01-AB-1234)" className="w-full bg-slate-50 p-3 rounded-xl font-medium outline-none focus:border-green-500 border border-transparent focus:bg-white transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Seats Available</label>
                        <input name="seats" type="number" min="1" max="6" required className="w-full bg-slate-50 p-3 rounded-xl font-medium outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cost per Seat (₹)</label>
                        <input name="cost" type="number" required className="w-full bg-slate-50 p-3 rounded-xl font-medium outline-none" />
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setView("browse")} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                    <button type="submit" className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20">Publish Ride</button>
                </div>
            </form>
        </div>
    );

    const renderDetails = () => (
        <div className="animate-slide-up max-w-lg mx-auto bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
            <button onClick={() => setView("browse")} className="absolute top-6 left-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                <ArrowLeft weight="bold" />
            </button>

            <div className="text-center mb-8 mt-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-4 border-4 border-white shadow-lg">
                    <User size={40} weight="fill" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{selectedRide.driver}</h3>
                <p className="text-slate-500 font-medium">{selectedRide.role}</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-amber-500 text-sm font-bold">
                    <span className="px-2 py-0.5 bg-amber-50 rounded-full">★ {selectedRide.rating} Rating</span>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Route</p>
                        <p className="font-bold text-slate-800 flex items-center gap-2">
                            {selectedRide.source} <ArrowLeft size={14} className="rotate-180 text-slate-400" /> {selectedRide.destination}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Date & Time</p>
                        <p className="font-bold text-slate-800">{selectedRide.time}</p>
                        <p className="text-xs text-slate-500">{selectedRide.date}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Car Model</p>
                        <p className="font-bold text-slate-800 text-sm">{selectedRide.car}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 border-2 border-green-100 rounded-2xl bg-green-50/50">
                    <div>
                        <p className="text-xs text-green-700 font-bold uppercase">Price</p>
                        <p className="text-2xl font-bold text-green-700">₹{selectedRide.cost}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-green-700 font-bold uppercase">Available</p>
                        <p className="text-xl font-bold text-slate-800 text-right">{selectedRide.seats} Seats</p>
                    </div>
                </div>
            </div>

            <button onClick={handleBookRide} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
                Book Seat Now
            </button>
        </div>
    );

    return (
        <div className="animate-fade-in relative">
            {notification && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-bounce-in">
                    <CheckCircle weight="fill" className="text-green-400" size={20} />
                    {notification.message}
                </div>
            )}

            <div className="flex items-center mb-6">
                <button
                    onClick={onBack}
                    className="mr-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                {view !== 'browse' && <span className="text-slate-400 font-bold mr-2 text-sm">/ Ride Sharing</span>}
            </div>

            {view === 'browse' && renderBrowse()}
            {view === 'create' && renderCreate()}
            {view === 'details' && renderDetails()}
        </div>
    );
};



const useAutocomplete = (query, type) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const apiKey = import.meta.env.VITE_TRAIN_TRACKING_API;

    useEffect(() => {
        if (!query || query.length < 1) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            setLoading(true);
            try {
                if (apiKey) {
                    const endpoint = type === 'station' ? 'search/stations' : 'search/trains';
                    const response = await fetch(`https://api.railradar.in/api/v1/${endpoint}?query=${query}`, {
                        headers: {
                            'X-API-Key': apiKey,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const rawResults = data.data || data.results || [];
                        const normalizeData = rawResults.map(item => ({
                            name: item.station_name || item.train_name,
                            code: item.station_code || item.train_number
                        })).slice(0, 10);

                        if (normalizeData.length > 0) {
                            setSuggestions(normalizeData);
                            setLoading(false);
                            return;
                        }
                    }
                }
            } catch (error) {
                // Ignore API errors
            }

            // Fallback
            await new Promise(resolve => setTimeout(resolve, 100));

            let results = [];
            if (type === 'station') {
                const mockStations = [
                    { name: "Chennai Egmore", code: "MS" },
                    { name: "Chennai Central", code: "MAS" },
                    { name: "Tambaram", code: "TBM" },
                    { name: "New Delhi", code: "NDLS" },
                    { name: "Mumbai CST", code: "CSMT" },
                    { name: "Bangalore City", code: "SBC" },
                    { name: "Hyderabad Deccan", code: "HYB" },
                    { name: "Kolkata Howrah", code: "HWH" },
                    { name: "Pune Junction", code: "PUNE" },
                    { name: "Ahmedabad", code: "ADI" },
                    { name: "Jaipur", code: "JP" }
                ];
                results = mockStations.filter(s =>
                    s.name.toLowerCase().includes(query.toLowerCase()) ||
                    s.code.toLowerCase().includes(query.toLowerCase())
                );
            } else if (type === 'train') {
                const mockTrains = [
                    { name: "Vande Bharat Express", code: "20607" },
                    { name: "Vaigai Express", code: "12636" },
                    { name: "Pallavan Express", code: "12605" },
                    { name: "Rockfort Express", code: "12653" },
                    { name: "Mumbai Rajdhani", code: "12951" }
                ];
                results = mockTrains.filter(t =>
                    t.name.toLowerCase().includes(query.toLowerCase()) ||
                    t.code.includes(query)
                );
            }

            setSuggestions(results);
            setLoading(false);
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [query, type, apiKey]);

    return { suggestions, loading };
};

const MetroMap = ({ onBack }) => {
    const [searchType, setSearchType] = useState("pnr");
    const [searchParams, setSearchParams] = useState({
        source: "",
        destination: "",
        date: new Date().toISOString().split('T')[0],
        time: "08:00"
    });
    const [pnrQuery, setPnrQuery] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    // Autocomplete Logic
    const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
    const [showDestSuggestions, setShowDestSuggestions] = useState(false);
    const [showTrainSuggestions, setShowTrainSuggestions] = useState(false);

    const sourceData = useAutocomplete(searchParams.source, 'station');
    const destData = useAutocomplete(searchParams.destination, 'station');
    const trainData = useAutocomplete(pnrQuery, 'train');

    const handleSwap = () => {
        setSearchParams(prev => ({
            ...prev,
            source: prev.destination,
            destination: prev.source
        }));
    };

    const handleSelect = (field, item) => {
        if (field === 'source') {
            setSearchParams(prev => ({ ...prev, source: `${item.name} - ${item.code}` }));
            setShowSourceSuggestions(false);
        } else if (field === 'destination') {
            setSearchParams(prev => ({ ...prev, destination: `${item.name} - ${item.code}` }));
            setShowDestSuggestions(false);
        } else if (field === 'pnr') {
            setPnrQuery(`${item.name} - ${item.code}`);
            setShowTrainSuggestions(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResults(null);

        const apiKey = import.meta.env.VITE_TRAIN_TRACKING_API;

        const extractCode = (str) => {
            if (!str) return "";
            const parts = str.split(" - ");
            return parts.length > 1 ? parts[parts.length - 1] : str;
        };

        try {
            if (searchType === 'route') {
                const textSrc = extractCode(searchParams.source);
                const textDest = extractCode(searchParams.destination);

                if (apiKey) {
                    const [y, m, d] = searchParams.date.split('-');
                    const formattedDate = `${d}-${m}-${y}`;
                    const url = `https://api.railradar.in/api/v1/trains/between-stations?from=${textSrc}&to=${textDest}&date=${formattedDate}`;

                    const response = await fetch(url, {
                        headers: { 'X-API-Key': apiKey }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const list = data.data || data.trains || [];

                        const mappedResults = list.map((t, index) => ({
                            id: index,
                            name: t.train_name,
                            number: t.train_number,
                            departure: t.src_departure_time,
                            arrival: t.dest_arrival_time,
                            price: "Check IRCTC",
                            status: "Scheduled",
                            info: t
                        }));

                        if (mappedResults.length > 0) {
                            setResults(mappedResults);
                            setLoading(false);
                            return;
                        }
                    }
                }
            } else {
                let trainNo = extractCode(pnrQuery);

                if (apiKey) {
                    const url = `https://api.railradar.in/api/v1/trains/${trainNo}/status`;
                    const response = await fetch(url, {
                        headers: { 'X-API-Key': apiKey }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const status = data.data || data;

                        setResults([{
                            id: 101,
                            name: status.train_name || `Train ${trainNo}`,
                            pnr: trainNo,
                            departure: status.source_departure_time || "N/A",
                            arrival: status.destination_arrival_time || "N/A",
                            status: status.current_status || "Running",
                            currentLocation: status.current_station_name || "En Route",
                            coach: "N/A",
                            seat: "N/A"
                        }]);
                        setLoading(false);
                        return;
                    }
                }
            }
        } catch (error) {
            console.error("API Search failed", error);
        }

        setTimeout(() => {
            if (searchType === 'route') {
                setResults([
                    { id: 1, name: "Express Line A", departure: "08:15", arrival: "08:45", price: "₹45", status: "On Time" },
                    { id: 2, name: "Metro Line 3", departure: "08:30", arrival: "09:10", price: "₹30", status: "Delayed 5m" },
                    { id: 3, name: "Local Train", departure: "09:00", arrival: "09:50", price: "₹15", status: "On Time" },
                ]);
            } else {
                setResults([
                    {
                        id: 101,
                        name: pnrQuery.includes("-") ? pnrQuery.split("-")[0] : "Chennai Express (12601)",
                        pnr: "8901234567",
                        departure: "10:30",
                        arrival: "14:15",
                        status: "Running - On Time",
                        currentLocation: "Tambaram Sanatorium",
                        coach: "B1",
                        seat: "45 (Window)"
                    }
                ]);
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold text-slate-900">Metro & Rail Planner</h2>

                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    <button
                        onClick={() => { setSearchType("pnr"); setResults(null); }}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${searchType === "pnr" ? "bg-purple-100 text-purple-700" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
                    >
                        Live Status
                    </button>
                    <button
                        onClick={() => { setSearchType("route"); setResults(null); }}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${searchType === "route" ? "bg-purple-100 text-purple-700" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
                    >
                        Between Stations
                    </button>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-purple-900/5 mb-8 overflow-visible relative z-10">
                <form onSubmit={handleSearch}>
                    {searchType === "route" ? (
                        <div className="flex flex-col md:flex-row items-end gap-4 relative">
                            <div className="space-y-2 relative w-full">
                                <label className="text-xs font-bold text-slate-500 uppercase">From (Source)</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Station Name"
                                        required
                                        value={searchParams.source}
                                        onChange={(e) => { setSearchParams({ ...searchParams, source: e.target.value }); setShowSourceSuggestions(true); }}
                                        onFocus={() => setShowSourceSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSourceSuggestions(false), 200)}
                                        className="w-full pl-16 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-medium transition-all"
                                    />
                                    {showSourceSuggestions && sourceData.suggestions.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-50">
                                            {sourceData.suggestions.map((s, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => handleSelect('source', s)}
                                                    className="px-4 py-3 hover:bg-purple-50 cursor-pointer text-sm font-medium border-b border-slate-50 last:border-0 flex justify-between items-center group"
                                                >
                                                    <span className="text-slate-700 group-hover:text-purple-700">{s.name}</span>
                                                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded group-hover:bg-purple-100 group-hover:text-purple-700">{s.code}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleSwap}
                                className="mb-1 p-3 rounded-full bg-slate-100 text-slate-500 hover:bg-purple-100 hover:text-purple-600 transition-all shadow-sm border border-slate-200 z-10 shrink-0"
                                title="Swap Stations"
                            >
                                <ArrowLeft size={20} className="md:rotate-0 rotate-90" weight="bold" />
                            </button>

                            <div className="space-y-2 relative w-full">
                                <label className="text-xs font-bold text-slate-500 uppercase">To (Destination)</label>
                                <div className="relative">
                                    <NavigationArrow className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Station Name"
                                        required
                                        value={searchParams.destination}
                                        onChange={(e) => { setSearchParams({ ...searchParams, destination: e.target.value }); setShowDestSuggestions(true); }}
                                        onFocus={() => setShowDestSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowDestSuggestions(false), 200)}
                                        className="w-full pl-16 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-medium transition-all"
                                    />
                                    {showDestSuggestions && destData.suggestions.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-50">
                                            {destData.suggestions.map((s, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => handleSelect('destination', s)}
                                                    className="px-4 py-3 hover:bg-purple-50 cursor-pointer text-sm font-medium border-b border-slate-50 last:border-0 flex justify-between items-center group"
                                                >
                                                    <span className="text-slate-700 group-hover:text-purple-700">{s.name}</span>
                                                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded group-hover:bg-purple-100 group-hover:text-purple-700">{s.code}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 relative">
                                <label className="text-xs font-bold text-slate-500 uppercase">Enter Train Name or PNR Number</label>
                                <div className="relative">
                                    <Train className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600" size={18} />
                                    <input
                                        type="text"
                                        placeholder="e.g., Chennai Express or 8901234567"
                                        required
                                        value={pnrQuery}
                                        onChange={(e) => { setPnrQuery(e.target.value); setShowTrainSuggestions(true); }}
                                        onFocus={() => setShowTrainSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowTrainSuggestions(false), 200)}
                                        className="w-full pl-16 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-medium transition-all"
                                    />
                                    {showTrainSuggestions && trainData.suggestions.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-50">
                                            {trainData.suggestions.map((s, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => { setPnrQuery(s); setShowTrainSuggestions(false); }}
                                                    className="px-4 py-2 hover:bg-purple-50 cursor-pointer text-sm text-slate-700 font-medium border-b border-slate-50 last:border-0"
                                                >
                                                    {s}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Date of Journey</label>
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={searchParams.date}
                                    onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-medium transition-all"
                                />
                            </div>
                        </div>
                    )}

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
                        >
                            {loading ? "Searching..." : <><Train weight="fill" size={20} /> {searchType === 'route' ? 'Find Trains' : 'Check Status'}</>}
                        </button>
                    </div>
                </form>
            </div>

            {results && (
                <div className="space-y-4 animate-slide-up">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center mb-4">
                        <Clock size={20} className="mr-2 text-purple-500" weight="duotone" />
                        {searchType === 'route' ? `Available Options for ${searchParams.date}` : "Search Results"}
                    </h3>

                    {results.map((train) => (
                        <div key={train.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-center gap-4 group">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <Train size={24} weight="duotone" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{train.name}</h4>
                                    {searchType === 'route' ? (
                                        <p className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-md inline-block mt-1">
                                            {searchParams.source} → {searchParams.destination}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-md inline-block mt-1">
                                            PNR: {train.pnr} | {train.currentLocation}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                <div className="text-center">
                                    <p className="text-xs text-slate-400 uppercase font-bold">Departure</p>
                                    <p className="font-bold text-slate-800 text-lg">{train.departure}</p>
                                </div>
                                <div className="hidden md:block w-16 h-[2px] bg-slate-100 relative">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-300"></div>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-slate-400 uppercase font-bold">Arrival</p>
                                    <p className="font-bold text-slate-800 text-lg">{train.arrival}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${train.status.includes("On Time") ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                                    {train.status}
                                </span>
                                {searchType === 'route' && (
                                    <button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors">
                                        Book {train.price}
                                    </button>
                                )}
                                {searchType === 'pnr' && (
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-400">Coach/Seat</p>
                                        <p className="text-sm font-bold text-slate-800">{train.coach} / {train.seat}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const LiveMap = ({ onBack }) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    return (
        <div className="animate-fade-in h-[calc(100vh-12rem)] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Live Campus Map</h2>
                    <p className="text-slate-500">Real-time view of transit routes and stops.</p>
                </div>
                <div className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-100 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    Live Updates
                </div>
            </div>

            <div className="flex-1 bg-slate-100 rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative">
                {apiKey ? (
                    <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=SRM+Institute+of+Science+and+Technology+Kattankulathur`}
                    ></iframe>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                        <MapTrifold size={48} weight="duotone" className="mb-2" />
                        <p>Map API Key is missing.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const Transport = () => {
    const [activeView, setActiveView] = useState("menu");

    useEffect(() => {
        console.log("Transport Component Mounted");
    }, []);

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
            case "map": return <LiveMap onBack={() => setActiveView("menu")} />;
            default: return null;
        }
    };

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
                        <ArrowLeft size={18} weight="bold" />
                    </div>
                    Back to Transport Hub
                </button>
                {renderView()}
            </div>
        );
    }

    return (
        <div className="min-h-full pb-12 animate-fade-in">


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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


                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Transport;
