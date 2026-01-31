import { useState, useEffect } from "react";
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

// --- Autocomplete Hook ---
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
                    // Corrected Endpoints: /api/v1/search/stations and /api/v1/search/trains
                    const endpoint = type === 'station' ? 'search/stations' : 'search/trains';
                    // console.log(`Fetching ${type} from RailRadar: ${query}`);
                    
                    const response = await fetch(`https://api.railradar.in/api/v1/${endpoint}?query=${query}`, {
                        headers: {
                            'X-API-Key': apiKey,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        
                        // Normalize API data
                        // Stations: { data: [{ station_name, station_code }, ...] }
                        // Trains: { data: [{ train_name, train_number }, ...] }
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
                // console.warn("API Fail, utilizing offline DB:", error);
            }

            // --- OFFLINE FALLBACK ---
            await new Promise(resolve => setTimeout(resolve, 100));
            
            let results = [];
            if (type === 'station') {
                 // Expanded Mock List with Codes
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
                    { name: "Jaipur", code: "JP" },
                    { name: "Kanpur Central", code: "CNB" },
                    { name: "Lucknow", code: "LKO" },
                    { name: "Patna", code: "PNBE" },
                    { name: "Visakhapatnam", code: "VSKP" },
                    { name: "Coimbatore", code: "CBE" },
                    { name: "Madurai", code: "MDU" },
                    { name: "Trichy", code: "TPJ" },
                    { name: "Trivandrum", code: "TVC" },
                    { name: "Guwahati", code: "GHY" },
                    { name: "Bhubaneswar", code: "BBS" },
                    { name: "Varanasi", code: "BSB" }
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
                    { name: "Mumbai Rajdhani", code: "12951" },
                    { name: "Coromandel Express", code: "12841" },
                    { name: "Tejas Express", code: "22671" },
                    { name: "Shatabdi Express", code: "12002" },
                    { name: "Garib Rath", code: "12215" }
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
    const [searchType, setSearchType] = useState("pnr"); // 'pnr' (Live Status) or 'route' (Between Stations)
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
             setSearchParams(prev => ({...prev, source: `${item.name} - ${item.code}`}));
             setShowSourceSuggestions(false);
        } else if (field === 'destination') {
             setSearchParams(prev => ({...prev, destination: `${item.name} - ${item.code}`}));
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

        // Helper to extract code from "Name - CODE" format
        const extractCode = (str) => {
            if (!str) return "";
            const parts = str.split(" - ");
            return parts.length > 1 ? parts[parts.length - 1] : str;
        };

        try {
            if (searchType === 'route') {
                const textSrc = extractCode(searchParams.source);
                const textDest = extractCode(searchParams.destination);
                
                // console.log(`Searching trains between ${textSrc} and ${textDest}`);

                if (apiKey) {
                    // Endpoint: /trains/between-stations?from=<station_code>&to=<station_code>&date=<dd-mm-yyyy>
                    // Note: Date format for API might be dd-mm-yyyy usually
                    const [y, m, d] = searchParams.date.split('-');
                    const formattedDate = `${d}-${m}-${y}`;

                    // Attempt: search/trains/between-stations often used pattern
                    const url = `https://api.railradar.in/api/v1/trains/between-stations?from=${textSrc}&to=${textDest}&date=${formattedDate}`;
                    
                    const response = await fetch(url, {
                        headers: { 'X-API-Key': apiKey }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        // Assume data.data or data.trains contains the list
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
                    } else {
                         // console.warn("API Error:", response.status);
                    }
                }
            } else {
                // Live Status (By Train Number)
                let trainNo = extractCode(pnrQuery);
                
                if (apiKey) {
                    // Endpoint: /trains/{trainNo}/status
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
            console.error("API Search failed, falling back to simulation", error);
        }

        // --- FALLBACK MOCK DATA (If API fails or returns empty) ---
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
                
                {/* Search Type Tabs */}
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
                                        onChange={(e) => { setSearchParams({...searchParams, source: e.target.value}); setShowSourceSuggestions(true); }}
                                        onFocus={() => setShowSourceSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSourceSuggestions(false), 200)}
                                        className="w-full pl-16 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-medium transition-all"
                                    />
                                    {/* Suggestions Dropdown */}
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

                            {/* Swap Button */}
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
                                        onChange={(e) => { setSearchParams({...searchParams, destination: e.target.value}); setShowDestSuggestions(true); }}
                                        onFocus={() => setShowDestSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowDestSuggestions(false), 200)}
                                        className="w-full pl-16 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-medium transition-all"
                                    />
                                     {/* Suggestions Dropdown */}
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
                                      {/* Suggestions Dropdown */}
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
                                    onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
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

// ... Rest of the component (LiveMap)
const LiveMap = ({ onBack }) => {
    const apiKey = import.meta.env.VITE_LOCATION_FINDER;

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
                         <MapTrifold size={48} weight="duotone" className="mb-2"/>
                         <p>Map API Key is missing.</p>
                     </div>
                 )}
            </div>
        </div>
    );
};

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
            case "map": return <LiveMap onBack={() => setActiveView("menu")} />;
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
