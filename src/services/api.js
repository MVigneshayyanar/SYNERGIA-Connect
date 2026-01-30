export const api = {
  // --- MOCK HEALTHCARE DATA ---
  
  getHealthcareProviders: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        name: "City General Hospital",
        specialty: "General Medicine",
        rating: 4.8,
        distance: 2.5,
        availableSlots: ["10:00 AM", "2:30 PM", "4:00 PM"]
      },
      {
        id: 2,
        name: "Dr. Sarah Smith",
        specialty: "Cardiologist",
        rating: 4.9,
        distance: 1.2,
        availableSlots: ["9:00 AM", "11:30 AM"]
      },
      {
        id: 3,
        name: "Metro Dental Clinic",
        specialty: "Dentistry",
        rating: 4.7,
        distance: 3.0,
        availableSlots: ["10:00 AM", "1:00 PM", "3:30 PM"]
      }
    ];
  },

  getAppointments: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: 1,
        provider: "City General Hospital",
        doctor: "Dr. Emily Tran",
        specialty: "General Checkup",
        date: "2024-03-20",
        time: "10:00 AM",
        status: "Confirmed"
      }
    ];
  },

  bookAppointment: async (appointment) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      id: Math.random(),
      ...appointment,
      status: "Confirmed"
    };
  },

  getHealthRecords: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [
      {
        id: 1,
        type: "Blood Test Report",
        doctor: "Dr. John Doe",
        date: "2024-02-15",
        diagnosis: "Normal levels, slight Vitamin D deficiency.",
        prescription: "Vitamin D3 supplements once a week."
      },
      {
        id: 2,
        type: "Dental X-Ray",
        doctor: "Dr. Lisa Wong",
        date: "2024-01-10",
        diagnosis: "Cavity in lower left molar.",
        prescription: "Scheduled for filling."
      }
    ];
  },

  // --- TELEMEDICINE ---

  getTelemedicineDoctors: async () => {
    return [
        { id: 1, name: "Dr. A. Kumar", specialty: "General Physician", rating: 4.8, experience: 8, available: true },
        { id: 2, name: "Dr. B. Singh", specialty: "Pediatrician", rating: 4.9, experience: 12, available: false },
        { id: 3, name: "Dr. C. Davis", specialty: "Dermatologist", rating: 4.7, experience: 5, available: true },
    ];
  },

  getTelemedicineHistory: async () => {
    return [
        { id: 101, doctorName: "Dr. A. Kumar", date: "Mar 10, 2024", duration: "15 mins" }
    ];
  },

  initiateTelemedicineCall: async (doctorId) => {
    return { status: "connecting", doctorId };
  },

  // --- MEDICATION ---

  getMedications: async () => {
    return [
        { id: 1, name: "Amoxicillin", dosage: "500mg", frequency: "Twice daily", doctor: "Dr. Smith", refills: 2, refillNeeded: false },
        { id: 2, name: "Lisinopril", dosage: "10mg", frequency: "Daily", doctor: "Dr. Johnson", refills: 0, refillNeeded: true },
    ];
  },

  getTodayMedicationSchedule: async () => {
    return [
        { id: 1, name: "Amoxicillin", dosage: "500mg", time: "08:00 AM", withFood: true, taken: true, instructions: "Take with full glass of water" },
        { id: 2, name: "Lisinopril", dosage: "10mg", time: "09:00 AM", withFood: false, taken: false, instructions: "Take on empty stomach" },
        { id: 1, name: "Amoxicillin", dosage: "500mg", time: "08:00 PM", withFood: true, taken: false, instructions: "Take with full glass of water" },
    ];
  },

  markMedicationTaken: async (id) => {
    return { success: true };
  },

  getAdherenceScore: async () => {
    return 85; 
  },

  // --- HEALTH CAMPAIGNS ---

  getHealthCampaigns: async () => {
    return [
        { 
            id: 1, 
            name: "Polio Vaccination Drive", 
            type: "vaccination", 
            description: "Free polio drops for children under 5.", 
            date: "Mar 25, 2024", 
            location: "Community Center Hall",
            iconBg: "bg-rose-100", 
            iconColor: "text-rose-600",
            status: "Upcoming",
            statusBg: "bg-green-100",
            statusColor: "text-green-700",
            enrolled: 45,
            capacity: 200,
            free: true,
            priority: true
        },
        { 
            id: 2, 
            name: "Blood Donation Camp", 
            type: "awareness", 
            description: "Donate blood, save lives. Snacks provided.", 
            date: "Mar 28, 2024", 
            location: "City Hospital Grounds",
            iconBg: "bg-red-100", 
            iconColor: "text-red-600",
            status: "Registration Open",
            statusBg: "bg-blue-100",
            statusColor: "text-blue-700",
            enrolled: 120,
            capacity: 500,
            free: true,
            priority: false
        }
    ];
  },

  getUserHealthCampaigns: async () => {
    return [2]; // enrolled in Blood Donation
  },

  enrollInHealthCampaign: async (id) => {
    return { success: true };
  },

  getHealthCampaignImpact: async () => {
    return {
        vaccinations: 12500,
        screenings: 8400,
        participants: 25000
    };
  }
};
