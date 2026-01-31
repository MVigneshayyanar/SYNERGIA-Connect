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
  NavigationArrow,
  Warning,
} from "@phosphor-icons/react";
import { useApp } from "../../context/AppContext";

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
        <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">
          On Time
        </span>
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
        <p className="text-xs text-slate-500">
          Save money and reduce carbon footprint.
        </p>
      </div>
      <button className="ml-auto bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
        Find Ride
      </button>
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
          <h3 className="font-bold text-indigo-900">
            Wheelchair Assistance Vehicle
          </h3>
          <p className="text-indigo-700 text-sm mt-1">
            Book a dedicated vehicle for campus movement.
          </p>
          <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
            Request Now
          </button>
        </div>
      </div>
    </div>
  </div>
);

// --- Autocomplete Hook ---
const useAutocomplete = (query, type) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 100));

      let results = [];
      if (type === "station") {
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
          { name: "Varanasi", code: "BSB" },
        ];
        results = mockStations.filter(
          (s) =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.code.toLowerCase().includes(query.toLowerCase()),
        );
      } else if (type === "train") {
        const mockTrains = [
          { name: "Vande Bharat Express", code: "20607" },
          { name: "Vaigai Express", code: "12636" },
          { name: "Pallavan Express", code: "12605" },
          { name: "Rockfort Express", code: "12653" },
          { name: "Mumbai Rajdhani", code: "12951" },
          { name: "Coromandel Express", code: "12841" },
          { name: "Tejas Express", code: "22671" },
          { name: "Shatabdi Express", code: "12002" },
          { name: "Garib Rath", code: "12215" },
        ];
        results = mockTrains.filter(
          (t) =>
            t.name.toLowerCase().includes(query.toLowerCase()) ||
            t.code.includes(query),
        );
      }

      setSuggestions(results);
      setLoading(false);
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query, type]);

  return { suggestions, loading };
};

const MetroMap = ({ onBack }) => {
  const { addNotification } = useApp();
  const [searchType, setSearchType] = useState("route");
  const [searchParams, setSearchParams] = useState({
    source: "",
    destination: "",
    date: new Date().toISOString().split("T")[0],
    time: "08:00",
  });
  const [pnrQuery, setPnrQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [showTrainSuggestions, setShowTrainSuggestions] = useState(false);

  const sourceData = useAutocomplete(searchParams.source, "station");
  const destData = useAutocomplete(searchParams.destination, "station");
  const trainData = useAutocomplete(pnrQuery, "train");

  const handleSwap = () => {
    setSearchParams((prev) => ({
      ...prev,
      source: prev.destination,
      destination: prev.source,
    }));
  };

  const handleSelect = (field, item) => {
    if (field === "source") {
      setSearchParams((prev) => ({
        ...prev,
        source: `${item.name} - ${item.code}`,
      }));
      setShowSourceSuggestions(false);
    } else if (field === "destination") {
      setSearchParams((prev) => ({
        ...prev,
        destination: `${item.name} - ${item.code}`,
      }));
      setShowDestSuggestions(false);
    } else if (field === "pnr") {
      setPnrQuery(`${item.name} - ${item.code}`);
      setShowTrainSuggestions(false);
    }
  };

  const extractCode = (str) => {
    if (!str) return "";
    const match = str.match(/\s-\s([A-Z0-9]+)$/);
    return match ? match[1] : str;
  };

  // Replace the handleSearch function with this corrected version:

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);
    setError(null);

    const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;

    try {
      if (searchType === "route") {
        const textSrc = extractCode(searchParams.source);
        const textDest = extractCode(searchParams.destination);

        console.log("Searching trains from", textSrc, "to", textDest);

        if (!textSrc || !textDest) {
          setError("Please select both source and destination stations");
          setLoading(false);
          return;
        }

        // Try multiple possible API endpoint formats
        if (rapidApiKey) {
          const possibleEndpoints = [
            // Format 1: Direct path
            {
              url: `https://indian-railway-irctc.p.rapidapi.com/trains/betweenStations`,
              params: `?fromStationCode=${textSrc}&toStationCode=${textDest}`,
              host: "indian-railway-irctc.p.rapidapi.com",
            },
            // Format 2: Different path structure
            {
              url: `https://indian-railway-irctc.p.rapidapi.com/getTrainsBetweenStations`,
              params: `?fromStationCode=${textSrc}&toStationCode=${textDest}`,
              host: "indian-railway-irctc.p.rapidapi.com",
            },
            // Format 3: Search endpoint
            {
              url: `https://indian-railway-irctc.p.rapidapi.com/search`,
              params: `?from=${textSrc}&to=${textDest}`,
              host: "indian-railway-irctc.p.rapidapi.com",
            },
          ];

          for (const endpoint of possibleEndpoints) {
            try {
              const fullUrl = endpoint.url + endpoint.params;
              console.log("Trying API endpoint:", fullUrl);

              const response = await fetch(fullUrl, {
                method: "GET",
                headers: {
                  "X-RapidAPI-Key": rapidApiKey,
                  "X-RapidAPI-Host": endpoint.host,
                  "Content-Type": "application/json",
                },
              });

              const data = await response.json();
              console.log(`Response from ${endpoint.url}:`, data);

              if (response.ok && data) {
                // Check if we got valid train data
                let trains = [];

                if (Array.isArray(data)) {
                  trains = data;
                } else if (data.data && Array.isArray(data.data)) {
                  trains = data.data;
                } else if (data.trains && Array.isArray(data.trains)) {
                  trains = data.trains;
                } else if (data.result && Array.isArray(data.result)) {
                  trains = data.result;
                } else if (data.success && data.data) {
                  trains = Array.isArray(data.data) ? data.data : [data.data];
                }

                if (trains.length > 0) {
                  console.log("✅ Success! Found trains:", trains);

                  const mappedResults = trains.map((t, index) => ({
                    id: index,
                    name:
                      t.train_name || t.trainName || t.name || "Unknown Train",
                    number:
                      t.train_number ||
                      t.trainNumber ||
                      t.trainNo ||
                      t.number ||
                      "N/A",
                    departure:
                      t.src_departure_time ||
                      t.departure_time ||
                      t.departureTime ||
                      t.from_time ||
                      t.departureTime ||
                      "N/A",
                    arrival:
                      t.dest_arrival_time ||
                      t.arrival_time ||
                      t.arrivalTime ||
                      t.to_time ||
                      t.arrivalTime ||
                      "N/A",
                    duration:
                      t.duration || t.travel_time || t.travelTime || "N/A",
                    price: t.price || "Check IRCTC",
                    status: t.status || "Scheduled",
                    classes: t.classes || t.available_classes || [],
                    info: t,
                  }));

                  setResults(mappedResults);
                  addNotification({
                    title: "Real-Time Trains Found",
                    message: `Found ${mappedResults.length} trains`,
                    type: "success",
                  });
                  setLoading(false);
                  return; // Exit on success
                }
              }
            } catch (endpointError) {
              console.warn(`Endpoint ${endpoint.url} failed:`, endpointError);
              // Continue to next endpoint
            }
          }

          // If all API attempts failed
          console.log("All API endpoints failed, using fallback data");
        }

        // Fallback to cached realistic data
        console.log("Using cached train data for", textSrc, "to", textDest);
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Replace the routeDatabase object in the handleSearch function with this expanded version:

        const routeDatabase = {
          // Chennai routes
          "MAS-SBC": [
            {
              train_number: "12639",
              train_name: "Brindavan Express",
              src_departure_time: "07:00",
              dest_arrival_time: "12:45",
              duration: "5h 45m",
              classes: ["SL", "AC"],
            },
            {
              train_number: "12007",
              train_name: "Shatabdi Express",
              src_departure_time: "06:00",
              dest_arrival_time: "11:30",
              duration: "5h 30m",
              classes: ["CC", "EC"],
            },
            {
              train_number: "12609",
              train_name: "Bangalore Express",
              src_departure_time: "22:00",
              dest_arrival_time: "05:30",
              duration: "7h 30m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "16021",
              train_name: "Kaveri Express",
              src_departure_time: "13:45",
              dest_arrival_time: "20:30",
              duration: "6h 45m",
              classes: ["SL", "3A"],
            },
            {
              train_number: "12607",
              train_name: "Lalbagh Express",
              src_departure_time: "05:45",
              dest_arrival_time: "11:15",
              duration: "5h 30m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "16053",
              train_name: "Tirupati Express",
              src_departure_time: "16:30",
              dest_arrival_time: "22:15",
              duration: "5h 45m",
              classes: ["SL", "3A"],
            },
            {
              train_number: "22625",
              train_name: "Double Decker",
              src_departure_time: "08:30",
              dest_arrival_time: "14:00",
              duration: "5h 30m",
              classes: ["2S", "CC"],
            },
            {
              train_number: "12679",
              train_name: "Coimbatore Express",
              src_departure_time: "23:45",
              dest_arrival_time: "05:30",
              duration: "5h 45m",
              classes: ["SL", "3A", "2A"],
            },
          ],
          "MS-SBC": [
            {
              train_number: "12639",
              train_name: "Brindavan Express",
              src_departure_time: "07:00",
              dest_arrival_time: "12:45",
              duration: "5h 45m",
              classes: ["SL", "AC"],
            },
            {
              train_number: "12007",
              train_name: "Shatabdi Express",
              src_departure_time: "06:00",
              dest_arrival_time: "11:30",
              duration: "5h 30m",
              classes: ["CC", "EC"],
            },
            {
              train_number: "12609",
              train_name: "Bangalore Express",
              src_departure_time: "22:00",
              dest_arrival_time: "05:30",
              duration: "7h 30m",
              classes: ["SL", "3A", "2A"],
            },
          ],
          "MAS-NDLS": [
            {
              train_number: "12621",
              train_name: "Tamil Nadu Express",
              src_departure_time: "22:30",
              dest_arrival_time: "06:30",
              duration: "32h",
              classes: ["SL", "3A", "2A", "1A"],
            },
            {
              train_number: "12615",
              train_name: "Grand Trunk Express",
              src_departure_time: "19:05",
              dest_arrival_time: "02:10",
              duration: "31h 05m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "12433",
              train_name: "Rajdhani Express",
              src_departure_time: "15:50",
              dest_arrival_time: "10:00",
              duration: "28h 10m",
              classes: ["3A", "2A", "1A"],
            },
            {
              train_number: "12617",
              train_name: "Mangala Lakshadweep Exp",
              src_departure_time: "11:30",
              dest_arrival_time: "20:30",
              duration: "33h",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "12625",
              train_name: "Kerala Express",
              src_departure_time: "13:00",
              dest_arrival_time: "22:00",
              duration: "33h",
              classes: ["SL", "3A", "2A", "1A"],
            },
          ],
          "MAS-HYB": [
            {
              train_number: "12759",
              train_name: "Charminar Express",
              src_departure_time: "18:25",
              dest_arrival_time: "05:55",
              duration: "11h 30m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "12604",
              train_name: "Hyderabad Express",
              src_departure_time: "05:40",
              dest_arrival_time: "18:00",
              duration: "12h 20m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "12764",
              train_name: "Padmavathi Express",
              src_departure_time: "20:15",
              dest_arrival_time: "08:30",
              duration: "12h 15m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "12785",
              train_name: "KCG Double Decker",
              src_departure_time: "06:15",
              dest_arrival_time: "18:00",
              duration: "11h 45m",
              classes: ["2S", "CC"],
            },
          ],
          "MAS-CSMT": [
            {
              train_number: "12163",
              train_name: "Chennai Mumbai Express",
              src_departure_time: "12:30",
              dest_arrival_time: "17:30",
              duration: "29h",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "11042",
              train_name: "Mumbai Express",
              src_departure_time: "21:00",
              dest_arrival_time: "04:00",
              duration: "31h",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "12701",
              train_name: "Hussain Sagar Express",
              src_departure_time: "17:45",
              dest_arrival_time: "00:15",
              duration: "30h 30m",
              classes: ["SL", "3A", "2A"],
            },
          ],
          "MAS-PUNE": [
            {
              train_number: "11043",
              train_name: "Pune Express",
              src_departure_time: "21:00",
              dest_arrival_time: "21:30",
              duration: "24h 30m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "12163",
              train_name: "Intercity Express",
              src_departure_time: "12:30",
              dest_arrival_time: "12:00",
              duration: "23h 30m",
              classes: ["SL", "3A", "2A"],
            },
          ],
          "MAS-HWH": [
            {
              train_number: "12841",
              train_name: "Coromandel Express",
              src_departure_time: "08:45",
              dest_arrival_time: "18:55",
              duration: "34h 10m",
              classes: ["SL", "3A", "2A", "1A"],
            },
            {
              train_number: "12663",
              train_name: "Howrah Express",
              src_departure_time: "22:40",
              dest_arrival_time: "06:20",
              duration: "31h 40m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "22841",
              train_name: "Antyodaya Express",
              src_departure_time: "13:30",
              dest_arrival_time: "23:00",
              duration: "33h 30m",
              classes: ["SL", "3A"],
            },
          ],
          "MAS-CBE": [
            {
              train_number: "12679",
              train_name: "Coimbatore Express",
              src_departure_time: "20:45",
              dest_arrival_time: "05:30",
              duration: "8h 45m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "12676",
              train_name: "Kovai Express",
              src_departure_time: "06:30",
              dest_arrival_time: "13:30",
              duration: "7h",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "22625",
              train_name: "Double Decker Express",
              src_departure_time: "14:45",
              dest_arrival_time: "21:30",
              duration: "6h 45m",
              classes: ["2S", "CC"],
            },
            {
              train_number: "12683",
              train_name: "Nagercoil Express",
              src_departure_time: "22:30",
              dest_arrival_time: "06:00",
              duration: "7h 30m",
              classes: ["SL", "3A"],
            },
          ],
          "MAS-MDU": [
            {
              train_number: "12637",
              train_name: "Pandian Express",
              src_departure_time: "21:05",
              dest_arrival_time: "06:20",
              duration: "9h 15m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "12693",
              train_name: "Pearl City Express",
              src_departure_time: "05:55",
              dest_arrival_time: "14:45",
              duration: "8h 50m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "16127",
              train_name: "Guruvayur Express",
              src_departure_time: "11:20",
              dest_arrival_time: "20:30",
              duration: "9h 10m",
              classes: ["SL", "3A"],
            },
          ],
          "MAS-TVC": [
            {
              train_number: "12623",
              train_name: "Trivandrum Mail",
              src_departure_time: "19:30",
              dest_arrival_time: "09:45",
              duration: "14h 15m",
              classes: ["SL", "3A", "2A", "1A"],
            },
            {
              train_number: "12695",
              train_name: "Trivandrum Express",
              src_departure_time: "12:45",
              dest_arrival_time: "03:00",
              duration: "14h 15m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "16127",
              train_name: "Guruvayur Express",
              src_departure_time: "11:20",
              dest_arrival_time: "02:15",
              duration: "14h 55m",
              classes: ["SL", "3A"],
            },
          ],

          // Bangalore routes
          "SBC-MAS": [
            {
              train_number: "12640",
              train_name: "Brindavan Express",
              src_departure_time: "14:00",
              dest_arrival_time: "19:45",
              duration: "5h 45m",
              classes: ["SL", "AC"],
            },
            {
              train_number: "12008",
              train_name: "Shatabdi Express",
              src_departure_time: "15:00",
              dest_arrival_time: "20:30",
              duration: "5h 30m",
              classes: ["CC", "EC"],
            },
            {
              train_number: "12610",
              train_name: "Chennai Express",
              src_departure_time: "20:15",
              dest_arrival_time: "03:45",
              duration: "7h 30m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "16022",
              train_name: "Kaveri Express",
              src_departure_time: "22:00",
              dest_arrival_time: "05:15",
              duration: "7h 15m",
              classes: ["SL", "3A"],
            },
            {
              train_number: "12608",
              train_name: "Lalbagh Express",
              src_departure_time: "13:00",
              dest_arrival_time: "18:30",
              duration: "5h 30m",
              classes: ["SL", "3A", "2A"],
            },
          ],
          "SBC-NDLS": [
            {
              train_number: "12429",
              train_name: "Rajdhani Express",
              src_departure_time: "20:00",
              dest_arrival_time: "05:55",
              duration: "33h 55m",
              classes: ["3A", "2A", "1A"],
            },
            {
              train_number: "12649",
              train_name: "Karnataka Sampark Kranti",
              src_departure_time: "14:45",
              dest_arrival_time: "00:30",
              duration: "33h 45m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "22691",
              train_name: "Rajdhani Express",
              src_departure_time: "18:00",
              dest_arrival_time: "04:20",
              duration: "34h 20m",
              classes: ["3A", "2A", "1A"],
            },
          ],
          "SBC-CSMT": [
            {
              train_number: "11013",
              train_name: "Coimbatore Express",
              src_departure_time: "13:30",
              dest_arrival_time: "07:30",
              duration: "18h",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "16529",
              train_name: "Udyan Express",
              src_departure_time: "20:15",
              dest_arrival_time: "16:45",
              duration: "20h 30m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "12133",
              train_name: "Mumbai Express",
              src_departure_time: "11:40",
              dest_arrival_time: "06:30",
              duration: "18h 50m",
              classes: ["SL", "3A", "2A"],
            },
          ],
          "SBC-HYB": [
            {
              train_number: "12785",
              train_name: "KCG Double Decker",
              src_departure_time: "19:30",
              dest_arrival_time: "07:15",
              duration: "11h 45m",
              classes: ["2S", "CC"],
            },
            {
              train_number: "12786",
              train_name: "Kacheguda Express",
              src_departure_time: "21:00",
              dest_arrival_time: "08:30",
              duration: "11h 30m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "12794",
              train_name: "Rayalaseema Express",
              src_departure_time: "23:00",
              dest_arrival_time: "10:45",
              duration: "11h 45m",
              classes: ["SL", "3A"],
            },
          ],

          // Delhi routes
          "NDLS-MAS": [
            {
              train_number: "12622",
              train_name: "Tamil Nadu Express",
              src_departure_time: "22:45",
              dest_arrival_time: "06:30",
              duration: "31h 45m",
              classes: ["SL", "3A", "2A", "1A"],
            },
            {
              train_number: "12616",
              train_name: "Grand Trunk Express",
              src_departure_time: "18:30",
              dest_arrival_time: "02:10",
              duration: "31h 40m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "12434",
              train_name: "Rajdhani Express",
              src_departure_time: "16:00",
              dest_arrival_time: "20:10",
              duration: "28h 10m",
              classes: ["3A", "2A", "1A"],
            },
            {
              train_number: "12626",
              train_name: "Kerala Express",
              src_departure_time: "11:00",
              dest_arrival_time: "20:00",
              duration: "33h",
              classes: ["SL", "3A", "2A", "1A"],
            },
          ],
          "NDLS-SBC": [
            {
              train_number: "12430",
              train_name: "Rajdhani Express",
              src_departure_time: "20:30",
              dest_arrival_time: "06:25",
              duration: "33h 55m",
              classes: ["3A", "2A", "1A"],
            },
            {
              train_number: "12650",
              train_name: "Karnataka Sampark Kranti",
              src_departure_time: "23:15",
              dest_arrival_time: "09:00",
              duration: "33h 45m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "22692",
              train_name: "Rajdhani Express",
              src_departure_time: "15:50",
              dest_arrival_time: "02:10",
              duration: "34h 20m",
              classes: ["3A", "2A", "1A"],
            },
          ],
          "NDLS-CSMT": [
            {
              train_number: "12951",
              train_name: "Mumbai Rajdhani",
              src_departure_time: "16:55",
              dest_arrival_time: "08:35",
              duration: "15h 40m",
              classes: ["3A", "2A", "1A"],
            },
            {
              train_number: "12953",
              train_name: "August Kranti Rajdhani",
              src_departure_time: "17:20",
              dest_arrival_time: "09:10",
              duration: "15h 50m",
              classes: ["3A", "2A", "1A"],
            },
            {
              train_number: "12137",
              train_name: "Punjab Mail",
              src_departure_time: "19:30",
              dest_arrival_time: "14:00",
              duration: "18h 30m",
              classes: ["SL", "3A", "2A"],
            },
          ],
          "NDLS-HWH": [
            {
              train_number: "12301",
              train_name: "Rajdhani Express",
              src_departure_time: "16:55",
              dest_arrival_time: "10:05",
              duration: "17h 10m",
              classes: ["3A", "2A", "1A"],
            },
            {
              train_number: "12311",
              train_name: "Kalka Mail",
              src_departure_time: "07:15",
              dest_arrival_time: "10:45",
              duration: "27h 30m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "12381",
              train_name: "Poorva Express",
              src_departure_time: "16:05",
              dest_arrival_time: "15:55",
              duration: "23h 50m",
              classes: ["SL", "3A", "2A", "1A"],
            },
          ],

          // Mumbai routes
          "CSMT-MAS": [
            {
              train_number: "12164",
              train_name: "Chennai Express",
              src_departure_time: "20:45",
              dest_arrival_time: "01:45",
              duration: "29h",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "11041",
              train_name: "Mumbai Chennai Express",
              src_departure_time: "10:20",
              dest_arrival_time: "17:20",
              duration: "31h",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "12702",
              train_name: "Hussain Sagar Express",
              src_departure_time: "21:50",
              dest_arrival_time: "04:20",
              duration: "30h 30m",
              classes: ["SL", "3A", "2A"],
            },
          ],
          "CSMT-SBC": [
            {
              train_number: "11014",
              train_name: "Lokmanya TT Express",
              src_departure_time: "21:25",
              dest_arrival_time: "15:25",
              duration: "18h",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "16530",
              train_name: "Udyan Express",
              src_departure_time: "08:05",
              dest_arrival_time: "04:35",
              duration: "20h 30m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "12134",
              train_name: "Bangalore Express",
              src_departure_time: "20:05",
              dest_arrival_time: "14:55",
              duration: "18h 50m",
              classes: ["SL", "3A", "2A"],
            },
          ],
          "CSMT-NDLS": [
            {
              train_number: "12952",
              train_name: "Mumbai Rajdhani",
              src_departure_time: "17:00",
              dest_arrival_time: "08:35",
              duration: "15h 35m",
              classes: ["3A", "2A", "1A"],
            },
            {
              train_number: "12954",
              train_name: "August Kranti Rajdhani",
              src_departure_time: "17:55",
              dest_arrival_time: "09:45",
              duration: "15h 50m",
              classes: ["3A", "2A", "1A"],
            },
            {
              train_number: "12138",
              train_name: "Punjab Mail",
              src_departure_time: "19:05",
              dest_arrival_time: "13:35",
              duration: "18h 30m",
              classes: ["SL", "3A", "2A"],
            },
          ],

          // Kolkata routes
          "HWH-MAS": [
            {
              train_number: "12842",
              train_name: "Coromandel Express",
              src_departure_time: "14:00",
              dest_arrival_time: "00:10",
              duration: "34h 10m",
              classes: ["SL", "3A", "2A", "1A"],
            },
            {
              train_number: "12664",
              train_name: "Howrah Express",
              src_departure_time: "23:50",
              dest_arrival_time: "07:30",
              duration: "31h 40m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "22842",
              train_name: "Antyodaya Express",
              src_departure_time: "06:40",
              dest_arrival_time: "16:10",
              duration: "33h 30m",
              classes: ["SL", "3A"],
            },
          ],
          "HWH-NDLS": [
            {
              train_number: "12302",
              train_name: "Rajdhani Express",
              src_departure_time: "16:50",
              dest_arrival_time: "10:00",
              duration: "17h 10m",
              classes: ["3A", "2A", "1A"],
            },
            {
              train_number: "12312",
              train_name: "Kalka Mail",
              src_departure_time: "22:10",
              dest_arrival_time: "01:40",
              duration: "27h 30m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "12382",
              train_name: "Poorva Express",
              src_departure_time: "15:50",
              dest_arrival_time: "15:40",
              duration: "23h 50m",
              classes: ["SL", "3A", "2A", "1A"],
            },
          ],
          "HWH-SBC": [
            {
              train_number: "22825",
              train_name: "SHM DBRG Express",
              src_departure_time: "15:25",
              dest_arrival_time: "23:30",
              duration: "32h 05m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "12245",
              train_name: "Yesvantpur Duronto",
              src_departure_time: "08:55",
              dest_arrival_time: "12:30",
              duration: "27h 35m",
              classes: ["3A", "2A", "1A"],
            },
          ],

          // Hyderabad routes
          "HYB-MAS": [
            {
              train_number: "12760",
              train_name: "Charminar Express",
              src_departure_time: "17:25",
              dest_arrival_time: "04:55",
              duration: "11h 30m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "12603",
              train_name: "Hyderabad Express",
              src_departure_time: "20:00",
              dest_arrival_time: "07:20",
              duration: "11h 20m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "12763",
              train_name: "Padmavathi Express",
              src_departure_time: "19:45",
              dest_arrival_time: "08:00",
              duration: "12h 15m",
              classes: ["SL", "3A", "2A"],
            },
          ],
          "HYB-SBC": [
            {
              train_number: "12785",
              train_name: "KCG Double Decker",
              src_departure_time: "08:15",
              dest_arrival_time: "20:00",
              duration: "11h 45m",
              classes: ["2S", "CC"],
            },
            {
              train_number: "12786",
              train_name: "Bangalore Express",
              src_departure_time: "22:15",
              dest_arrival_time: "09:45",
              duration: "11h 30m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "12793",
              train_name: "Rayalaseema Express",
              src_departure_time: "22:00",
              dest_arrival_time: "09:45",
              duration: "11h 45m",
              classes: ["SL", "3A"],
            },
          ],

          // Additional routes
          "PUNE-MAS": [
            {
              train_number: "11044",
              train_name: "Lokamanya TT",
              src_departure_time: "00:50",
              dest_arrival_time: "01:20",
              duration: "24h 30m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "12164",
              train_name: "Chennai Express",
              src_departure_time: "23:45",
              dest_arrival_time: "00:15",
              duration: "24h 30m",
              classes: ["SL", "3A", "2A"],
            },
          ],
          "CBE-MAS": [
            {
              train_number: "12680",
              train_name: "Coimbatore Express",
              src_departure_time: "20:25",
              dest_arrival_time: "05:10",
              duration: "8h 45m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "12675",
              train_name: "Kovai Express",
              src_departure_time: "15:15",
              dest_arrival_time: "22:15",
              duration: "7h",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "22626",
              train_name: "Double Decker Express",
              src_departure_time: "05:30",
              dest_arrival_time: "12:15",
              duration: "6h 45m",
              classes: ["2S", "CC"],
            },
          ],
          "MDU-MAS": [
            {
              train_number: "12638",
              train_name: "Pandian Express",
              src_departure_time: "19:35",
              dest_arrival_time: "04:50",
              duration: "9h 15m",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "12694",
              train_name: "Pearl City Express",
              src_departure_time: "17:05",
              dest_arrival_time: "01:55",
              duration: "8h 50m",
              classes: ["SL", "3A", "2A"],
            },
          ],
          "TVC-MAS": [
            {
              train_number: "12624",
              train_name: "Trivandrum Mail",
              src_departure_time: "15:15",
              dest_arrival_time: "05:30",
              duration: "14h 15m",
              classes: ["SL", "3A", "2A", "1A"],
            },
            {
              train_number: "12696",
              train_name: "Trivandrum Express",
              src_departure_time: "19:00",
              dest_arrival_time: "09:15",
              duration: "14h 15m",
              classes: ["SL", "3A", "2A"],
            },
          ],
        };

        const routeKey = `${textSrc}-${textDest}`;
        const reverseKey = `${textDest}-${textSrc}`;

        let trains = routeDatabase[routeKey] || routeDatabase[reverseKey] || [];

        if (trains.length === 0) {
          // Generic trains for unlisted routes
          trains = [
            {
              train_number: "12345",
              train_name: "Express Train",
              src_departure_time: "08:00",
              dest_arrival_time: "14:00",
              duration: "6h",
              classes: ["SL", "3A", "2A"],
            },
            {
              train_number: "22222",
              train_name: "Superfast Express",
              src_departure_time: "15:30",
              dest_arrival_time: "20:30",
              duration: "5h",
              classes: ["SL", "3A"],
            },
          ];
        }

        const mappedResults = trains.map((t, index) => ({
          id: index,
          name: t.train_name,
          number: t.train_number,
          departure: t.src_departure_time,
          arrival: t.dest_arrival_time,
          duration: t.duration,
          price: "Check IRCTC",
          status: "Scheduled",
          classes: t.classes,
          info: t,
        }));

        setResults(mappedResults);

        const notificationMessage = rapidApiKey
          ? `API endpoint not found. Showing ${mappedResults.length} trains from database. Please check API documentation for correct endpoint.`
          : `Found ${mappedResults.length} trains. Add VITE_RAPIDAPI_KEY for real-time data.`;

        addNotification({
          title: "Train Schedule",
          message: notificationMessage,
          type: rapidApiKey ? "warning" : "info",
        });
      } else {
        // Live Status
        let trainNo = pnrQuery.trim();
        const codeMatch = trainNo.match(/\s-\s([A-Z0-9]+)$/);
        if (codeMatch) {
          trainNo = codeMatch[1];
        }
        trainNo = trainNo.replace(/\D/g, "");

        if (!trainNo) {
          setError("Please enter a valid train number");
          setLoading(false);
          return;
        }

        // Simulate with realistic data
        await new Promise((resolve) => setTimeout(resolve, 800));

        const trainStatusDatabase = {
          12639: {
            name: "Brindavan Express",
            source: "Chennai Central",
            destination: "Bangalore City",
            current: "Arakkonam",
            delay: "On Time",
          },
          12007: {
            name: "Shatabdi Express",
            source: "Chennai Central",
            destination: "Bangalore City",
            current: "Katpadi",
            delay: "15 mins",
          },
          12621: {
            name: "Tamil Nadu Express",
            source: "Chennai Central",
            destination: "New Delhi",
            current: "Vijayawada",
            delay: "On Time",
          },
          12607: {
            name: "Lalbagh Express",
            source: "Chennai Central",
            destination: "Bangalore City",
            current: "Bangalore Cantonment",
            delay: "5 mins",
          },
          12609: {
            name: "Bangalore Express",
            source: "Chennai Central",
            destination: "Bangalore City",
            current: "Jolarpettai",
            delay: "On Time",
          },
        };

        const status = trainStatusDatabase[trainNo] || {
          name: `Train ${trainNo}`,
          source: "Source Station",
          destination: "Destination Station",
          current: "En Route",
          delay: "On Time",
        };

        setResults([
          {
            id: 101,
            name: status.name,
            pnr: trainNo,
            departure: "06:00 AM",
            arrival: "11:30 AM",
            status: "Running",
            currentLocation: status.current,
            delay: status.delay,
            lastUpdate: new Date().toLocaleTimeString(),
            coach: "N/A",
            seat: "N/A",
          },
        ]);

        addNotification({
          title: "Train Status",
          message: `Status for train ${trainNo}`,
          type: "info",
        });
      }
    } catch (error) {
      console.error("API Search failed:", error);
      setError(error.message || "Failed to fetch train information.");
      addNotification({
        title: "Search Failed",
        message: error.message || "Failed to fetch train information",
        type: "error",
      });
    }

    setLoading(false);
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Metro & Rail Planner
        </h2>

        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => {
              setSearchType("pnr");
              setResults(null);
              setError(null);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${searchType === "pnr" ? "bg-purple-100 text-purple-700" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
          >
            Live Status
          </button>
          <button
            onClick={() => {
              setSearchType("route");
              setResults(null);
              setError(null);
            }}
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
                <label className="text-xs font-bold text-slate-500 uppercase">
                  From (Source)
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Station Name"
                    required
                    value={searchParams.source}
                    onChange={(e) => {
                      setSearchParams({
                        ...searchParams,
                        source: e.target.value,
                      });
                      setShowSourceSuggestions(true);
                    }}
                    onFocus={() => setShowSourceSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowSourceSuggestions(false), 200)
                    }
                    className="w-full pl-16 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-medium transition-all"
                  />
                  {showSourceSuggestions &&
                    sourceData.suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-50">
                        {sourceData.suggestions.map((s, i) => (
                          <div
                            key={i}
                            onClick={() => handleSelect("source", s)}
                            className="px-4 py-3 hover:bg-purple-50 cursor-pointer text-sm font-medium border-b border-slate-50 last:border-0 flex justify-between items-center group"
                          >
                            <span className="text-slate-700 group-hover:text-purple-700">
                              {s.name}
                            </span>
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded group-hover:bg-purple-100 group-hover:text-purple-700">
                              {s.code}
                            </span>
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
                <ArrowLeft
                  size={20}
                  className="md:rotate-0 rotate-90"
                  weight="bold"
                />
              </button>

              <div className="space-y-2 relative w-full">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  To (Destination)
                </label>
                <div className="relative">
                  <NavigationArrow
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Station Name"
                    required
                    value={searchParams.destination}
                    onChange={(e) => {
                      setSearchParams({
                        ...searchParams,
                        destination: e.target.value,
                      });
                      setShowDestSuggestions(true);
                    }}
                    onFocus={() => setShowDestSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowDestSuggestions(false), 200)
                    }
                    className="w-full pl-16 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-medium transition-all"
                  />
                  {showDestSuggestions && destData.suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-50">
                      {destData.suggestions.map((s, i) => (
                        <div
                          key={i}
                          onClick={() => handleSelect("destination", s)}
                          className="px-4 py-3 hover:bg-purple-50 cursor-pointer text-sm font-medium border-b border-slate-50 last:border-0 flex justify-between items-center group"
                        >
                          <span className="text-slate-700 group-hover:text-purple-700">
                            {s.name}
                          </span>
                          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded group-hover:bg-purple-100 group-hover:text-purple-700">
                            {s.code}
                          </span>
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
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Enter Train Name or Number
                </label>
                <div className="relative">
                  <Train
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="e.g., Vande Bharat or 20607"
                    required
                    value={pnrQuery}
                    onChange={(e) => {
                      setPnrQuery(e.target.value);
                      setShowTrainSuggestions(true);
                    }}
                    onFocus={() => setShowTrainSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowTrainSuggestions(false), 200)
                    }
                    className="w-full pl-16 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-medium transition-all"
                  />
                  {showTrainSuggestions && trainData.suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-50">
                      {trainData.suggestions.map((s, i) => (
                        <div
                          key={i}
                          onClick={() => handleSelect("pnr", s)}
                          className="px-4 py-3 hover:bg-purple-50 cursor-pointer text-sm font-medium border-b border-slate-50 last:border-0 flex justify-between items-center group"
                        >
                          <span className="text-slate-700 group-hover:text-purple-700">
                            {s.name}
                          </span>
                          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded group-hover:bg-purple-100 group-hover:text-purple-700">
                            {s.code}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Date of Journey
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={searchParams.date}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, date: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-medium transition-all"
                />
              </div>
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Train weight="fill" size={20} />
                  {searchType === "route" ? "Find Trains" : "Check Status"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 animate-fade-in">
          <div className="flex items-center gap-3 text-red-700">
            <Warning size={20} weight="bold" />
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      {results && (
        <div className="space-y-4 animate-slide-up">
          <h3 className="font-bold text-slate-800 text-lg flex items-center mb-4">
            <Clock
              size={20}
              className="mr-2 text-purple-500"
              weight="duotone"
            />
            {searchType === "route"
              ? `${results.length} trains found for ${searchParams.date}`
              : "Live Train Status"}
          </h3>

          {results.map((train) => (
            <div
              key={train.id}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-center gap-4 group"
            >
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Train size={24} weight="duotone" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{train.name}</h4>
                  {train.number && (
                    <p className="text-xs text-slate-500 font-medium">
                      Train #{train.number}
                    </p>
                  )}
                  {searchType === "pnr" && train.currentLocation && (
                    <p className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-md inline-block mt-1">
                      Current: {train.currentLocation}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                <div className="text-center">
                  <p className="text-xs text-slate-400 uppercase font-bold">
                    Departure
                  </p>
                  <p className="font-bold text-slate-800 text-lg">
                    {train.departure}
                  </p>
                </div>
                {train.duration && (
                  <div className="text-center hidden md:block">
                    <p className="text-xs text-slate-400 uppercase font-bold">
                      Duration
                    </p>
                    <p className="font-bold text-slate-600 text-sm">
                      {train.duration}
                    </p>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-xs text-slate-400 uppercase font-bold">
                    Arrival
                  </p>
                  <p className="font-bold text-slate-800 text-lg">
                    {train.arrival}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    train.status.toLowerCase().includes("on time") ||
                    train.delay === "On Time"
                      ? "bg-green-100 text-green-700"
                      : train.status.toLowerCase().includes("delayed") ||
                          train.delay !== "On Time"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {train.delay && train.delay !== "On Time"
                    ? `Delayed: ${train.delay}`
                    : train.status}
                </span>
                {searchType === "route" && (
                  <a
                    href={`https://www.irctc.co.in/nget/train-search`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors"
                  >
                    Book on IRCTC
                  </a>
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
  const apiKey = import.meta.env.VITE_LOCATION_FINDER;

  return (
    <div className="animate-fade-in h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Live Campus Map</h2>
          <p className="text-slate-500">
            Real-time view of transit routes and stops.
          </p>
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

  const menuItems = [
    {
      id: "bus",
      title: "Campus Shuttle",
      icon: Bus,
      accent: "blue",
      desc: "Live tracking & schedules for university buses.",
    },
    {
      id: "metro",
      title: "Metro & Rail",
      icon: Train,
      accent: "purple",
      desc: "Connect to city transit networks.",
    },
    {
      id: "carpool",
      title: "Ride Sharing",
      icon: Car,
      accent: "green",
      desc: "Find peers to carpool with securely.",
    },
    {
      id: "bicycles",
      title: "Micro Mobility",
      icon: Bicycle,
      accent: "orange",
      desc: "Rent e-bikes and scooters on campus.",
    },
    {
      id: "accessibility",
      title: "Accessible Transit",
      icon: Wheelchair,
      accent: "indigo",
      desc: "Book wheelchair-accessible vehicles.",
    },
    {
      id: "map",
      title: "Live Map",
      icon: MapTrifold,
      accent: "red",
      desc: "Real-time view of all transport options.",
    },
  ];

  const renderView = () => {
    switch (activeView) {
      case "bus":
        return <BusSchedule onBack={() => setActiveView("menu")} />;
      case "metro":
        return <MetroMap onBack={() => setActiveView("menu")} />;
      case "carpool":
        return <Carpool onBack={() => setActiveView("menu")} />;
      case "accessibility":
        return <AccessibleTransport onBack={() => setActiveView("menu")} />;
      case "map":
        return <LiveMap onBack={() => setActiveView("menu")} />;
      case "bicycles":
        return (
          <div className="p-10 text-center">
            Bicycles Component Coming Soon{" "}
            <button
              onClick={() => setActiveView("menu")}
              className="block mt-4 text-blue-600 mx-auto"
            >
              Back
            </button>
          </div>
        );
      default:
        return null;
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
      <div className="mb-10 relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 shadow-xl">
        <div className="relative z-10 w-full md:w-2/3">
          <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
            Smart Mobility
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Getting Around Campus Made Easy
          </h1>
          <p className="text-white/70 text-lg mb-8 max-w-xl">
            Real-time schedules, sustainable travel options, and seamless
            connectivity for students and staff.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveView("bus")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center shadow-lg shadow-blue-600/30"
            >
              <Bus className="mr-2" weight="fill" /> Find Shuttle
            </button>
            <button
              onClick={() => setActiveView("map")}
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center"
            >
              <MapPin className="mr-2" weight="fill" /> Live Map
            </button>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 hidden md:block">
          <div className="absolute right-10 bottom-10 transform rotate-12">
            <Bus size={280} weight="duotone" className="text-white" />
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
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${theme.bg} ${theme.text} group-hover:scale-110 transition-transform`}
              >
                <item.icon size={28} weight="fill" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {item.desc}
              </p>

              <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                <ArrowLeft
                  size={20}
                  className="text-slate-300 rotate-180"
                  weight="bold"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Transport;
