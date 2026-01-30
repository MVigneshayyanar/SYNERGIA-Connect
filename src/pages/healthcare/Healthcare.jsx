import { useState, useEffect } from "react";
import {
  Hospital,
  Calendar,
  Clock,
  MapPin,
  Star,
  Plus,
  ArrowLeft,
  FileText,
  VideoCamera,
  Pill,
  Users,
  Sparkle,
  Heartbeat,
  FirstAid
} from "@phosphor-icons/react";
import { api } from "../../services/api";
import { useApp } from "../../context/AppContext";

// Sub-components
import Telemedicine from "./Telemedicine";
import MedicationTracker from "./MedicationTracker";
import HealthCampaigns from "./HealthCampaigns";
import MedicalCompanion from "./MedicalCompanion";

const Healthcare = () => {
    const [activeView, setActiveView] = useState("menu");
    const [providers, setProviders] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [healthRecords, setHealthRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const { addNotification } = useApp();

    // Load data only when needed (e.g., when entering appointments view)
    const loadHealthcareData = async () => {
        setLoading(true);
        try {
            const [providersData, appointmentsData, recordsData] = await Promise.all([
                api.getHealthcareProviders(),
                api.getAppointments(),
                api.getHealthRecords(),
            ]);
            setProviders(providersData);
            setAppointments(appointmentsData);
            setHealthRecords(recordsData);
        } catch (error) {
            console.error("Failed to load healthcare data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Load data on mount if we want stats, or just lazy load. 
    // For now, let's load on mount to support the internal components easily.
    useEffect(() => {
        loadHealthcareData();
    }, []);

    const menuItems = [
        { 
            id: "companion", 
            title: "AI Medical Companion", 
            icon: Sparkle, 
            accent: "teal",
            desc: "24/7 AI health guidance & symptom checker." 
        },
        { 
            id: "telemedicine", 
            title: "Telemedicine", 
            icon: VideoCamera, 
            accent: "purple",
            desc: "Consult doctors online from home." 
        },
        { 
            id: "medications", 
            title: "Medication Tracker", 
            icon: Pill, 
            accent: "green",
            desc: "Track prescriptions & get reminders." 
        },
        { 
            id: "campaigns", 
            title: "Health Campaigns", 
            icon: Users, 
            accent: "rose",
            desc: "Join community health drives & camps." 
        },
        { 
            id: "appointments", 
            title: "Appointments", 
            icon: Calendar, 
            accent: "blue",
            desc: "Book & manage doctor visits." 
        },
        { 
            id: "records", 
            title: "Health Records", 
            icon: FileText, 
            accent: "amber",
            desc: "View your medical history & reports." 
        },
    ];

    const renderView = () => {
        switch (activeView) {
            case "companion": 
                return <MedicalCompanion onBack={() => setActiveView("menu")} />;
            case "telemedicine": 
                return <Telemedicine onBack={() => setActiveView("menu")} />;
            case "medications": 
                return <MedicationTracker onBack={() => setActiveView("menu")} />;
            case "campaigns": 
                return <HealthCampaigns onBack={() => setActiveView("menu")} />;
            case "appointments":
                return (
                    <AppointmentBooking
                        providers={providers}
                        appointments={appointments} // Pass appointments for list
                        loading={loading}
                        onBack={() => setActiveView("menu")}
                        onBook={async (appointment) => {
                            const newAppt = await api.bookAppointment(appointment);
                            setAppointments((prev) => [...prev, newAppt]);
                            addNotification({
                                title: "Appointment Confirmed",
                                message: `Your appointment at ${appointment.provider} is confirmed for ${appointment.date}`,
                                type: "success",
                            });
                            setActiveView("menu");
                        }}
                    />
                );
            case "records":
                return <HealthRecords records={healthRecords} onBack={() => setActiveView("menu")} />;
            default: return null;
        }
    };

    // Helper to get color classes based on accent
    const getColorClasses = (accent) => {
        const colors = {
            blue: { bg: "bg-blue-100", text: "text-blue-600" },
            purple: { bg: "bg-purple-100", text: "text-purple-600" },
            green: { bg: "bg-emerald-100", text: "text-emerald-600" },
            teal: { bg: "bg-teal-100", text: "text-teal-600" },
            rose: { bg: "bg-rose-100", text: "text-rose-600" },
            amber: { bg: "bg-amber-100", text: "text-amber-600" },
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
                    Back to Healthcare Hub
                </button>
                {renderView()}
            </div>
        );
    }

    return (
        <div className="min-h-full pb-12 animate-fade-in">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900">Healthcare Services</h1>
                <p className="text-slate-500 mt-2 text-lg">Access comprehensive medical resources and manage your health.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

// Internal Components (Preserved and slightly updated styles)

const AppointmentBooking = ({ providers, appointments, loading, onBack, onBook }) => {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("Checkup");
  const [view, setView] = useState("list"); // 'list' or 'book'

  if (loading) return <div className="p-8 text-center text-slate-500">Loading appointments...</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedProvider && selectedDate && selectedTime) {
      onBook({
        provider: selectedProvider.name,
        doctor: `Dr. ${selectedProvider.specialty} Specialist`,
        specialty: selectedProvider.specialty,
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
      });
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
           <div>
               <h2 className="text-2xl font-bold text-slate-800">Your Appointments</h2>
               <p className="text-slate-500 text-sm">Manage upcoming visits</p>
           </div>
           {view === "list" && (
                <button 
                    onClick={() => setView("book")}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Plus size={18} weight="bold" className="mr-2"/> Book New
                </button>
           )}
           {view === "book" && (
                <button 
                    onClick={() => setView("list")}
                    className="flex items-center px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                    Cancel Booking
                </button>
           )}
       </div>

       {view === "list" ? (
            <div className="grid gap-4">
                {appointments.length > 0 ? appointments.map((appt, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
                                <Hospital size={24} weight="duotone" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">{appt.provider}</h4>
                                <p className="text-sm text-slate-600">{appt.doctor} • {appt.specialty}</p>
                                <div className="flex items-center space-x-3 mt-1 text-xs text-slate-500">
                                    <span className="flex items-center"><Calendar size={14} className="mr-1"/> {appt.date}</span>
                                    <span className="flex items-center"><Clock size={14} className="mr-1"/> {appt.time}</span>
                                </div>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">{appt.status}</span>
                    </div>
                )) : (
                    <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                        <Calendar size={48} className="mx-auto mb-3 opacity-20" />
                        <p>No appointments found.</p>
                    </div>
                )}
            </div>
       ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 animate-slide-up">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Book New Appointment</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Select Provider</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {providers.map((provider) => (
                        <div
                        key={provider.id}
                        onClick={() => setSelectedProvider(provider)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedProvider?.id === provider.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-100 hover:border-slate-200"
                        }`}
                        >
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-slate-800">{provider.name}</h4>
                            <div className="flex items-center text-amber-500 text-sm">
                            <Star size={16} weight="fill" className="mr-1" />{provider.rating}
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{provider.specialty}</p>
                        <div className="flex items-center text-xs text-slate-500">
                            <MapPin size={14} className="mr-1" />{provider.distance} km away
                        </div>
                        </div>
                    ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
                        <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                        />
                    </div>
                    <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
                         <select
                            value={appointmentType}
                            onChange={(e) => setAppointmentType(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option>Checkup</option>
                            <option>Consultation</option>
                            <option>Follow-up</option>
                            <option>Emergency</option>
                        </select>
                    </div>
                </div>

                {selectedProvider && (
                    <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Available Time Slots</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {selectedProvider.availableSlots.map((slot) => (
                        <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={`px-4 py-2 border rounded-xl font-medium transition-all text-sm ${
                            selectedTime === slot
                                ? "border-blue-500 bg-blue-600 text-white"
                                : "border-slate-200 hover:border-slate-300 text-slate-600"
                            }`}
                        >
                            {slot}
                        </button>
                        ))}
                    </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!selectedProvider || !selectedDate || !selectedTime}
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Confirm Appointment
                </button>
            </form>
          </div>
       )}
    </div>
  );
};

const HealthRecords = ({ records }) => {
  return (
    <div className="space-y-6">
       <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-6">
           <h2 className="text-2xl font-bold text-slate-800">My Health Records</h2>
           <p className="text-slate-500 text-sm">Analysis, prescriptions & history</p>
       </div>
       <div className="grid gap-4">
          {records.map((record, i) => (
            <div
              key={i}
              className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6"
            >
              <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800 text-lg">{record.type}</h3>
                    <span className="text-xs text-slate-400 font-bold bg-slate-50 px-2 py-1 rounded-lg">{record.date}</span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium mb-4">{record.doctor}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-50 p-3 rounded-xl">
                        <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Diagnosis</span>
                        <p className="text-slate-700">{record.diagnosis}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-xl">
                        <span className="text-xs font-bold text-blue-400 uppercase block mb-1">Prescription</span>
                        <p className="text-blue-700">{record.prescription}</p>
                    </div>
                  </div>
              </div>
            </div>
          ))}
          {records.length === 0 && (
              <div className="text-center py-12 text-slate-400">No records found.</div>
          )}
        </div>
    </div>
  );
};

export default Healthcare;
