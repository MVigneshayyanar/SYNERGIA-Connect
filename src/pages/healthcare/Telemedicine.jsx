import { useState, useEffect } from "react";
import {
  VideoCamera,
  Phone,
  Calendar,
  Clock,
  User,
  CheckCircle,
  Warning,
} from "@phosphor-icons/react";
import { api } from "../../services/api";
import { useApp } from "../../context/AppContext";

const Telemedicine = () => {
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [activeCall, setActiveCall] = useState(null);
  const [callHistory, setCallHistory] = useState([]);
  const { addNotification } = useApp();

  useEffect(() => {
    loadTelemedicineData();
  }, []);

  const loadTelemedicineData = async () => {
    const doctors = await api.getTelemedicineDoctors();
    const history = await api.getTelemedicineHistory();
    setAvailableDoctors(doctors);
    setCallHistory(history);
  };

  const startVideoCall = async (doctor) => {
    const call = await api.initiateTelemedicineCall(doctor.id);
    setActiveCall(call);
    addNotification({
      title: "Video Call Started",
      message: `Connected with ${doctor.name}`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Telemedicine Services</h2>
            <p className="text-purple-100">
              Connect with doctors from anywhere, anytime
            </p>
          </div>
          <VideoCamera size={64} weight="duotone" className="opacity-50" />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur rounded-xl p-4">
            <h3 className="text-2xl font-bold">24/7</h3>
            <p className="text-sm text-purple-100">Availability</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-xl p-4">
            <h3 className="text-2xl font-bold">$0</h3>
            <p className="text-sm text-purple-100">Consultation Fee</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-xl p-4">
            <h3 className="text-2xl font-bold">&lt;2min</h3>
            <p className="text-sm text-purple-100">Wait Time</p>
          </div>
        </div>
      </div>

      {/* Available Doctors */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Available Now</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="p-4 border border-slate-200 rounded-xl hover:border-purple-300 transition-all"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <User
                    size={24}
                    className="text-purple-600"
                    weight="duotone"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{doctor.name}</h4>
                  <p className="text-sm text-slate-500">{doctor.specialty}</p>
                </div>
                {doctor.available && (
                  <span className="ml-auto w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span>Experience: {doctor.experience} years</span>
                <span>Rating: {doctor.rating} ⭐</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => startVideoCall(doctor)}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <VideoCamera size={16} className="mr-2" weight="bold" />
                  Video Call
                </button>
                <button className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center justify-center">
                  <Phone size={16} className="mr-2" weight="bold" />
                  Audio Call
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call History */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">
          Recent Consultations
        </h3>
        <div className="space-y-3">
          {callHistory.map((call) => (
            <div
              key={call.id}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <VideoCamera size={20} className="text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    {call.doctorName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {call.date} • {call.duration}
                  </p>
                </div>
              </div>
              <button className="text-sm text-purple-600 font-medium hover:underline">
                View Summary
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Telemedicine;
