import { useState, useEffect } from "react";
import {
  Pill,
  Bell,
  CheckCircle,
  Clock,
  Warning,
  Plus,
} from "@phosphor-icons/react";
import { api } from "../../services/api";
import { useApp } from "../../context/AppContext";

const MedicationTracker = () => {
  const [medications, setMedications] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [adherenceScore, setAdherenceScore] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const { addNotification } = useApp();

  useEffect(() => {
    loadMedicationData();
    scheduleReminders();
  }, []);

  const loadMedicationData = async () => {
    const meds = await api.getMedications();
    const schedule = await api.getTodayMedicationSchedule();
    const score = await api.getAdherenceScore();

    setMedications(meds);
    setTodaySchedule(schedule);
    setAdherenceScore(score);
  };

  const scheduleReminders = () => {
    // Set up browser notifications for medication reminders
    if ("Notification" in window && Notification.permission === "granted") {
      todaySchedule.forEach((med) => {
        const now = new Date();
        const scheduleTime = new Date(med.scheduledTime);
        const timeDiff = scheduleTime - now;

        if (timeDiff > 0) {
          setTimeout(() => {
            new Notification(`Time to take ${med.name}`, {
              body: `${med.dosage} - ${med.instructions}`,
              icon: "/medication-icon.png",
            });
          }, timeDiff);
        }
      });
    }
  };

  const markAsTaken = async (scheduleId) => {
    await api.markMedicationTaken(scheduleId);
    addNotification({
      title: "Medication Logged",
      message: "Great job staying on track!",
      type: "success",
    });
    loadMedicationData();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Adherence Score Card */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h3 className="text-lg font-medium text-green-100 mb-2">
            Medication Adherence
          </h3>
          <div className="flex items-end space-x-3 mb-4">
            <h2 className="text-5xl font-bold">{adherenceScore}%</h2>
            <span className="text-green-100 pb-2">This Month</span>
          </div>
          <div className="w-full bg-green-400/30 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all"
              style={{ width: `${adherenceScore}%` }}
            ></div>
          </div>
          <p className="text-sm text-green-100 mt-3">
            {adherenceScore >= 80
              ? "Excellent! Keep it up 🎉"
              : "Try to maintain consistency 💪"}
          </p>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-800">
            Today's Medications
          </h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} className="mr-2" weight="bold" />
            Add Medication
          </button>
        </div>

        <div className="space-y-3">
          {todaySchedule.map((med) => (
            <div
              key={med.id}
              className={`p-4 border-2 rounded-xl transition-all ${
                med.taken
                  ? "border-green-200 bg-green-50"
                  : "border-slate-200 hover:border-blue-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      med.taken ? "bg-green-100" : "bg-blue-100"
                    }`}
                  >
                    {med.taken ? (
                      <CheckCircle
                        size={24}
                        className="text-green-600"
                        weight="fill"
                      />
                    ) : (
                      <Pill
                        size={24}
                        className="text-blue-600"
                        weight="duotone"
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{med.name}</h4>
                    <p className="text-sm text-slate-600">{med.dosage}</p>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-xs text-slate-500 flex items-center">
                        <Clock size={12} className="mr-1" /> {med.time}
                      </span>
                      {med.withFood && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          Take with food
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {!med.taken && (
                  <button
                    onClick={() => markAsTaken(med.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Mark Taken
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Medications */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">
          All Prescriptions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medications.map((med) => (
            <div
              key={med.id}
              className="p-4 border border-slate-200 rounded-xl hover:border-blue-200 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-slate-800">{med.name}</h4>
                  <p className="text-sm text-slate-600">{med.dosage}</p>
                </div>
                {med.refillNeeded && (
                  <Warning size={20} className="text-amber-500" weight="fill" />
                )}
              </div>
              <div className="text-xs text-slate-500 space-y-1">
                <p>Frequency: {med.frequency}</p>
                <p>Prescribed by: {med.doctor}</p>
                <p>Refills remaining: {med.refills}</p>
              </div>
              {med.refillNeeded && (
                <button className="mt-3 w-full bg-amber-100 text-amber-700 py-2 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors">
                  Request Refill
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Medication Interaction Checker */}
      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border-2 border-red-200 p-6">
        <div className="flex items-center mb-3">
          <Warning size={24} className="text-red-600 mr-3" weight="fill" />
          <h3 className="text-lg font-bold text-slate-800">
            Drug Interaction Alert
          </h3>
        </div>
        <p className="text-sm text-slate-600 mb-3">
          Always consult your doctor before combining medications. Our AI checks
          for potential interactions.
        </p>
        <button className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
          Check My Medications
        </button>
      </div>
    </div>
  );
};

export default MedicationTracker;
