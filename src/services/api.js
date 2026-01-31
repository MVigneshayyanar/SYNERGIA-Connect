// Import Google Generative AI at the top
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export const api = {
    // ... (existing methods)

  // --- SCHOLARSHIPS / FOUNDATIONS ---

  registerFoundation: async (foundationData) => {
    try {
      const docRef = await addDoc(collection(db, "foundations"), {
        ...foundationData,
        createdAt: new Date().toISOString(),
        verified: false // Default to unverified until admin checks
      });
      console.log("Foundation registered with ID: ", docRef.id);
      return { success: true, id: docRef.id };
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e;
    }
  },

  getFoundations: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "foundations"));
      const foundations = [];
      querySnapshot.forEach((doc) => {
        foundations.push({ id: doc.id, ...doc.data() });
      });
      return foundations;
    } catch (e) {
        console.error("Error fetching foundations: ", e);
        return []; 
    }
  },

  // --- HEALTHCARE DATA ---
// ... (rest of the file)
  
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
  },

  // --- CONSENT FORM SCANNER ---

  scanConsentForm: async (file) => {
    try {
      // Check if API key exists
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onload = () => {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
      
      const base64Data = await base64Promise;
      const mimeType = file.type;

      console.log("Scanning file:", file.name, "Type:", mimeType);

      // Create a detailed prompt for the AI
      const prompt = `You are an expert medical form analyzer. Carefully analyze this medical consent form image and extract ALL patient information visible.

Extract the following details and return them as a valid JSON object:

{
  "patientName": "Full name of the patient",
  "dateOfBirth": "Date of birth in YYYY-MM-DD format if possible",
  "gender": "Male/Female/Other",
  "address": "Complete address",
  "phoneNumber": "Phone number with country code if available",
  "email": "Email address",
  "emergencyContact": "Emergency contact name and number",
  "medicalConditions": ["List any pre-existing medical conditions"],
  "allergies": ["List any allergies mentioned"],
  "medications": ["List any current medications"],
  "consentDate": "Date when consent was signed (YYYY-MM-DD format)",
  "hasSignature": true or false
}

IMPORTANT RULES:
1. Extract ONLY information that is clearly visible in the form
2. If a field is not found, use "Not found" for text fields, [] for arrays, and false for booleans
3. Return ONLY valid JSON, no additional text or markdown
4. Be thorough and check all sections of the form`;

      // Generate content with the image
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
      ]);

      const response = await result.response;
      const text = response.text();
      
      console.log("Gemini API Response:", text);

      // Parse the JSON response
      let jsonText = text.trim();
      
      // Remove markdown code blocks if present
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Try to find JSON object in the response
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }

      const patientDetails = JSON.parse(jsonText);
      
      console.log("Parsed patient details:", patientDetails);
      
      return patientDetails;
    } catch (error) {
      console.error("Error scanning consent form:", error);
      
      if (error.message.includes("API key")) {
        throw new Error("API key configuration error: " + error.message);
      }
      
      if (error instanceof SyntaxError) {
        throw new Error("Failed to parse AI response. Please try again with a clearer image.");
      }
      
      throw new Error("Failed to extract patient details. Please ensure the image is clear and contains a consent form.");
    }
  },

  // Keep mock function for testing
  scanConsentFormMock: async (file) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      patientName: "John Doe",
      dateOfBirth: "1990-05-15",
      gender: "Male",
      address: "123 Main Street, City, State 12345",
      phoneNumber: "+1 (555) 123-4567",
      email: "john.doe@email.com",
      emergencyContact: "Jane Doe - +1 (555) 987-6543",
      medicalConditions: ["Hypertension", "Type 2 Diabetes"],
      allergies: ["Penicillin", "Peanuts"],
      medications: ["Metformin 500mg", "Lisinopril 10mg"],
      consentDate: "2024-03-15",
      hasSignature: true
    };
  },

  savePatientDetails: async (patientDetails) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("Saving patient details:", patientDetails);
    // TODO: Save to backend/database/Firestore
    return { success: true, id: Math.random() };
  }
};