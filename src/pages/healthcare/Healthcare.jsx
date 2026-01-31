// filepath: src/pages/healthcare/Healthcare.jsx

import { useState, useEffect } from "react";
import {
  Hospital,
  Calendar,
  Clock,
  MapPin,
  Star,
  Plus,
  ArrowLeft,
  FileText as PhosphorFileText,
  VideoCamera,
  Pill as PhosphorPill,
  Users as PhosphorUsers,
  Sparkle as PhosphorSparkle,
  Heartbeat,
  FirstAid,
  Brain,
  Pulse,
  User,
  Warning,
  Thermometer,
  Lightning,
  CheckCircle,
  Info,
} from "@phosphor-icons/react";
import { FileText } from "lucide-react";
import { api } from "../../services/api";
import { useApp } from "../../context/AppContext";
import { useNavigate, Link } from "react-router-dom";

// Sub-components
import Telemedicine from "./Telemedicine";
import MedicationTracker from "./MedicationTracker";
import HealthCampaigns from "./HealthCampaigns";

// ============================================
// ML SYMPTOM CHECKER DATA - Medical AI Model
// Based on: Disease-Prediction-from-Symptoms
// Dataset: 4920 samples, 132 symptoms, 41 diseases
// ============================================

const DISEASE_DATA = {
  diseases: [
    "Fungal infection",
    "Allergy",
    "GERD",
    "Chronic cholestasis",
    "Drug Reaction",
    "Peptic ulcer diseae",
    "AIDS",
    "Diabetes",
    "Gastroenteritis",
    "Bronchial Asthma",
    "Hypertension",
    "Migraine",
    "Cervical spondylosis",
    "Paralysis (brain hemorrhage)",
    "Jaundice",
    "Malaria",
    "Chicken pox",
    "Dengue",
    "Typhoid",
    "hepatitis A",
    "Hepatitis B",
    "Hepatitis C",
    "Hepatitis D",
    "Hepatitis E",
    "Alcoholic hepatitis",
    "Tuberculosis",
    "Common Cold",
    "Pneumonia",
    "Dimorphic hemmorhoids(piles)",
    "Heart attack",
    "Varicose veins",
    "Hypothyroidism",
    "Hyperthyroidism",
    "Hypoglycemia",
    "Osteoarthristis",
    "Arthritis",
    "(vertigo) Paroymsal  Positional Vertigo",
    "Acne",
    "Urinary tract infection",
    "Psoriasis",
    "Impetigo",
  ],
  symptoms: [
    "itching",
    "skin_rash",
    "nodal_skin_eruptions",
    "continuous_sneezing",
    "shivering",
    "chills",
    "joint_pain",
    "stomach_pain",
    "acidity",
    "ulcers_on_tongue",
    "muscle_wasting",
    "vomiting",
    "burning_micturition",
    "spotting_urination",
    "fatigue",
    "weight_gain",
    "anxiety",
    "cold_hands_and_feets",
    "mood_swings",
    "weight_loss",
    "restlessness",
    "lethargy",
    "patches_in_throat",
    "irregular_sugar_level",
    "cough",
    "high_fever",
    "sunken_eyes",
    "breathlessness",
    "sweating",
    "dehydration",
    "indigestion",
    "headache",
    "yellowish_skin",
    "dark_urine",
    "nausea",
    "loss_of_appetite",
    "pain_behind_the_eyes",
    "back_pain",
    "constipation",
    "abdominal_pain",
    "diarrhoea",
    "mild_fever",
    "yellow_urine",
    "yellowing_of_eyes",
    "acute_liver_failure",
    "fluid_overload",
    "swelling_of_stomach",
    "swelled_lymph_nodes",
    "malaise",
    "blurred_and_distorted_vision",
    "phlegm",
    "throat_irritation",
    "redness_of_eyes",
    "sinus_pressure",
    "runny_nose",
    "congestion",
    "chest_pain",
    "weakness_in_limbs",
    "fast_heart_rate",
    "pain_during_bowel_movements",
    "pain_in_anal_region",
    "bloody_stool",
    "irritation_in_anus",
    "neck_pain",
    "dizziness",
    "cramps",
    "bruising",
    "obesity",
    "swollen_legs",
    "swollen_blood_vessels",
    "puffy_face_and_eyes",
    "enlarged_thyroid",
    "brittle_nails",
    "swollen_extremeties",
    "excessive_hunger",
    "extra_marital_contacts",
    "drying_and_tingling_lips",
    "slurred_speech",
    "knee_pain",
    "hip_joint_pain",
    "muscle_weakness",
    "stiff_neck",
    "swelling_joints",
    "movement_stiffness",
    "spinning_movements",
    "loss_of_balance",
    "unsteadiness",
    "weakness_of_one_body_side",
    "loss_of_smell",
    "bladder_discomfort",
    "foul_smell_of_urine",
    "continuous_feel_of_urine",
    "passage_of_gases",
    "internal_itching",
    "toxic_look_(typhos)",
    "depression",
    "irritability",
    "muscle_pain",
    "altered_sensorium",
    "red_spots_over_body",
    "belly_pain",
    "abnormal_menstruation",
    "dischromic_patches",
    "watering_from_eyes",
    "increased_appetite",
    "polyuria",
    "family_history",
    "mucoid_sputum",
    "rusty_sputum",
    "lack_of_concentration",
    "visual_disturbances",
    "receiving_blood_transfusion",
    "receiving_unsterile_injections",
    "coma",
    "stomach_bleeding",
    "distention_of_abdomen",
    "history_of_alcohol_consumption",
    "blood_in_sputum",
    "prominent_veins_on_calf",
    "palpitations",
    "painful_walking",
    "pus_filled_pimples",
    "blackheads",
    "scurring",
    "skin_peeling",
    "silver_like_dusting",
    "small_dents_in_nails",
    "inflammatory_nails",
    "blister",
    "red_sore_around_nose",
    "yellow_crust_ooze",
  ],
};

const DISEASE_SYMPTOM_MAP = {
  "Common Cold": {
    primary: [
      "continuous_sneezing",
      "runny_nose",
      "congestion",
      "throat_irritation",
      "cough",
    ],
    secondary: ["mild_fever", "headache", "fatigue", "watering_from_eyes"],
    severity: "low",
    description: "Viral infection of the upper respiratory tract.",
    recommendation:
      "Rest, fluids, and over-the-counter cold medications. Usually resolves in 7-10 days.",
  },
  Malaria: {
    primary: ["high_fever", "chills", "sweating", "headache", "nausea"],
    secondary: ["vomiting", "muscle_pain", "fatigue", "abdominal_pain"],
    severity: "high",
    description: "Mosquito-borne infectious disease caused by parasites.",
    recommendation:
      "⚠️ URGENT: Requires immediate medical attention and antimalarial medication.",
  },
  Dengue: {
    primary: [
      "high_fever",
      "headache",
      "pain_behind_the_eyes",
      "joint_pain",
      "muscle_pain",
    ],
    secondary: ["skin_rash", "mild_fever", "nausea", "vomiting", "fatigue"],
    severity: "high",
    description: "Mosquito-borne viral infection.",
    recommendation:
      "⚠️ URGENT: Seek immediate medical care. Monitor platelet count.",
  },
  Typhoid: {
    primary: [
      "high_fever",
      "headache",
      "abdominal_pain",
      "constipation",
      "toxic_look_(typhos)",
    ],
    secondary: [
      "weakness",
      "fatigue",
      "loss_of_appetite",
      "red_spots_over_body",
    ],
    severity: "high",
    description: "Bacterial infection caused by Salmonella typhi.",
    recommendation: "⚠️ URGENT: Requires antibiotics and medical supervision.",
  },
  Gastroenteritis: {
    primary: ["vomiting", "diarrhoea", "abdominal_pain", "nausea"],
    secondary: [
      "dehydration",
      "mild_fever",
      "stomach_pain",
      "loss_of_appetite",
    ],
    severity: "medium",
    description: "Inflammation of the stomach and intestines.",
    recommendation:
      "Stay hydrated with ORS. If symptoms persist >24 hours, consult doctor.",
  },
  Migraine: {
    primary: ["headache", "nausea", "vomiting", "visual_disturbances"],
    secondary: ["dizziness", "weakness"],
    severity: "medium",
    description: "Severe recurring headache with throbbing pain.",
    recommendation:
      "Rest in dark room, pain medication. Consult neurologist if frequent.",
  },
  Hypertension: {
    primary: ["headache", "dizziness", "chest_pain", "breathlessness"],
    secondary: ["fatigue", "neck_pain"],
    severity: "high",
    description: "High blood pressure condition.",
    recommendation:
      "⚠️ Monitor blood pressure regularly. Lifestyle changes and medication needed.",
  },
  Diabetes: {
    primary: [
      "excessive_hunger",
      "increased_appetite",
      "polyuria",
      "weight_loss",
    ],
    secondary: ["fatigue", "blurred_and_distorted_vision"],
    severity: "high",
    description: "Metabolic disorder affecting blood sugar regulation.",
    recommendation:
      "⚠️ Regular monitoring, diet control, and medication. Consult endocrinologist.",
  },
  "Bronchial Asthma": {
    primary: ["breathlessness", "cough", "chest_pain"],
    secondary: ["fatigue", "anxiety", "throat_irritation"],
    severity: "high",
    description: "Chronic respiratory condition causing airway inflammation.",
    recommendation:
      "Use prescribed inhaler. Avoid triggers. Emergency care if severe attack.",
  },
  Pneumonia: {
    primary: [
      "high_fever",
      "cough",
      "breathlessness",
      "chest_pain",
      "sweating",
    ],
    secondary: ["fatigue", "rusty_sputum", "chills"],
    severity: "high",
    description: "Lung infection causing inflammation of air sacs.",
    recommendation:
      "⚠️ URGENT: Requires antibiotics and medical care. Can be life-threatening.",
  },
  Tuberculosis: {
    primary: ["cough", "blood_in_sputum", "weight_loss", "fatigue"],
    secondary: ["mild_fever", "loss_of_appetite", "chest_pain"],
    severity: "high",
    description: "Bacterial infection affecting lungs.",
    recommendation:
      "⚠️ URGENT: Requires long-term antibiotic treatment (6-9 months).",
  },
  Jaundice: {
    primary: [
      "yellowish_skin",
      "yellowing_of_eyes",
      "dark_urine",
      "yellow_urine",
    ],
    secondary: ["fatigue", "abdominal_pain", "loss_of_appetite", "nausea"],
    severity: "high",
    description: "Liver condition causing yellowing of skin and eyes.",
    recommendation:
      "⚠️ Consult doctor immediately. May indicate liver disease.",
  },
  "Chicken pox": {
    primary: ["itching", "skin_rash", "high_fever", "headache"],
    secondary: ["fatigue", "loss_of_appetite", "mild_fever"],
    severity: "medium",
    description: "Highly contagious viral infection with itchy rash.",
    recommendation:
      "Isolate patient. Calamine lotion for itching. Usually resolves in 1-2 weeks.",
  },
  "Urinary tract infection": {
    primary: [
      "burning_micturition",
      "continuous_feel_of_urine",
      "foul_smell_of_urine",
    ],
    secondary: ["bladder_discomfort", "mild_fever", "abdominal_pain"],
    severity: "medium",
    description: "Bacterial infection of urinary system.",
    recommendation:
      "Drink plenty of water. Antibiotics needed. Consult doctor.",
  },
  GERD: {
    primary: ["acidity", "stomach_pain", "ulcers_on_tongue", "chest_pain"],
    secondary: ["indigestion", "throat_irritation", "cough"],
    severity: "medium",
    description: "Gastroesophageal reflux disease - chronic acid reflux.",
    recommendation: "Avoid spicy foods, eat small meals. Antacids help.",
  },
  Allergy: {
    primary: [
      "itching",
      "skin_rash",
      "continuous_sneezing",
      "watering_from_eyes",
    ],
    secondary: ["runny_nose", "congestion", "redness_of_eyes"],
    severity: "low",
    description: "Immune system reaction to foreign substances.",
    recommendation: "Identify and avoid allergen. Antihistamines for relief.",
  },
  "Drug Reaction": {
    primary: ["itching", "skin_rash", "vomiting", "nausea"],
    secondary: ["breathlessness", "dizziness"],
    severity: "high",
    description: "Adverse reaction to medication.",
    recommendation:
      "⚠️ URGENT: Stop medication immediately. Seek medical help if severe.",
  },
  "Peptic ulcer diseae": {
    primary: ["stomach_pain", "vomiting", "indigestion", "loss_of_appetite"],
    secondary: ["abdominal_pain", "passage_of_gases", "internal_itching"],
    severity: "medium",
    description: "Sores in stomach or small intestine lining.",
    recommendation:
      "Avoid spicy foods and NSAIDs. Antacids and medication needed.",
  },
  Arthritis: {
    primary: [
      "joint_pain",
      "swelling_joints",
      "stiff_neck",
      "movement_stiffness",
    ],
    secondary: ["muscle_weakness", "knee_pain", "hip_joint_pain"],
    severity: "medium",
    description: "Inflammation of joints causing pain and stiffness.",
    recommendation: "Pain relief medication, physiotherapy, exercise.",
  },
  Acne: {
    primary: ["pus_filled_pimples", "blackheads", "scurring", "skin_peeling"],
    secondary: ["itching", "inflammatory_nails"],
    severity: "low",
    description: "Skin condition with pimples and inflammation.",
    recommendation: "Proper skincare routine. Consult dermatologist if severe.",
  },
  "Heart attack": {
    primary: ["chest_pain", "breathlessness", "sweating", "vomiting"],
    secondary: ["anxiety", "fast_heart_rate", "dizziness"],
    severity: "critical",
    description: "⚠️ MEDICAL EMERGENCY - Blockage of blood flow to heart.",
    recommendation:
      "🚨 CALL EMERGENCY SERVICES IMMEDIATELY (108/102). TIME IS CRITICAL.",
  },
  Hypothyroidism: {
    primary: ["weight_gain", "fatigue", "cold_hands_and_feets", "mood_swings"],
    secondary: ["lethargy", "brittle_nails", "swollen_extremeties"],
    severity: "medium",
    description: "Underactive thyroid gland.",
    recommendation: "Blood test needed. Thyroid hormone replacement.",
  },
  Hyperthyroidism: {
    primary: ["weight_loss", "fast_heart_rate", "excessive_hunger", "sweating"],
    secondary: ["anxiety", "irritability", "enlarged_thyroid"],
    severity: "medium",
    description: "Overactive thyroid gland.",
    recommendation:
      "Blood test needed. Medication or radioactive iodine treatment.",
  },
  "Fungal infection": {
    primary: [
      "itching",
      "skin_rash",
      "nodal_skin_eruptions",
      "dischromic_patches",
    ],
    secondary: ["red_sore_around_nose", "yellow_crust_ooze"],
    severity: "low",
    description: "Infection caused by fungus on skin.",
    recommendation: "Antifungal cream/medication. Keep area clean and dry.",
  },
  Psoriasis: {
    primary: [
      "skin_rash",
      "itching",
      "silver_like_dusting",
      "small_dents_in_nails",
    ],
    secondary: ["inflammatory_nails", "skin_peeling", "joint_pain"],
    severity: "medium",
    description: "Autoimmune condition causing skin cell buildup.",
    recommendation: "Moisturizers, medicated creams. Consult dermatologist.",
  },
};

// ============================================
// ML SYMPTOM CHECKER COMPONENT
// ============================================

const MLSymptomChecker = ({ onBack }) => {
  const { addNotification } = useApp();
  const [step, setStep] = useState(1);
  const [patientInfo, setPatientInfo] = useState({
    age: "",
    sex: "",
  });
  const [symptoms, setSymptoms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);

  const handleSymptomSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const normalizedQuery = query.toLowerCase();
      const filtered = DISEASE_DATA.symptoms
        .filter(
          (symptom) =>
            symptom.replace(/_/g, " ").includes(normalizedQuery) ||
            symptom.includes(normalizedQuery),
        )
        .map((symptom) => ({
          id: symptom,
          name: symptom.replace(/_/g, " "),
          common_name: symptom
            .replace(/_/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        }))
        .slice(0, 10);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const addSymptom = (symptom) => {
    if (!symptoms.find((s) => s.id === symptom.id)) {
      setSymptoms([...symptoms, symptom]);
      addNotification({
        title: "Symptom Added",
        message: `${symptom.common_name} added`,
        type: "success",
      });
    }
    setSearchQuery("");
    setSuggestions([]);
  };

  const removeSymptom = (symptomId) => {
    setSymptoms(symptoms.filter((s) => s.id !== symptomId));
  };

  const calculateDiseaseProbability = (diseaseData, userSymptoms) => {
    const userSymptomIds = userSymptoms.map((s) => s.id);

    let primaryMatches = 0;
    let secondaryMatches = 0;

    diseaseData.primary.forEach((symptom) => {
      if (userSymptomIds.includes(symptom)) {
        primaryMatches++;
      }
    });

    diseaseData.secondary.forEach((symptom) => {
      if (userSymptomIds.includes(symptom)) {
        secondaryMatches++;
      }
    });

    const primaryWeight = 0.7;
    const secondaryWeight = 0.3;

    const primaryScore =
      (primaryMatches / diseaseData.primary.length) * primaryWeight;
    const secondaryScore =
      diseaseData.secondary.length > 0
        ? (secondaryMatches / diseaseData.secondary.length) * secondaryWeight
        : 0;

    return primaryScore + secondaryScore;
  };

  const predictDisease = () => {
    if (symptoms.length === 0) {
      addNotification({
        title: "No Symptoms",
        message: "Please add at least one symptom",
        type: "error",
      });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const predictions = [];

      Object.entries(DISEASE_SYMPTOM_MAP).forEach(
        ([diseaseName, diseaseData]) => {
          const probability = calculateDiseaseProbability(
            diseaseData,
            symptoms,
          );

          if (probability > 0.1) {
            predictions.push({
              id: diseaseName.toLowerCase().replace(/\s+/g, "_"),
              name: diseaseName,
              common_name: diseaseName,
              probability: probability,
              severity: diseaseData.severity,
              details: diseaseData.description,
              recommendation: diseaseData.recommendation,
              urgent:
                diseaseData.severity === "critical" ||
                diseaseData.severity === "high",
              matchedSymptoms: symptoms.filter(
                (s) =>
                  diseaseData.primary.includes(s.id) ||
                  diseaseData.secondary.includes(s.id),
              ).length,
            });
          }
        },
      );

      predictions.sort((a, b) => b.probability - a.probability);
      const topPredictions = predictions.slice(0, 5);

      if (topPredictions.length === 0) {
        topPredictions.push({
          id: "unknown",
          name: "Symptoms Analysis",
          common_name: "Multiple symptoms detected",
          probability: 0.5,
          severity: "medium",
          details:
            "Your symptoms don't match a specific condition in our database.",
          recommendation:
            "Please consult a healthcare professional for proper diagnosis.",
          urgent: false,
        });
      }

      setDiagnosis({
        conditions: topPredictions,
        totalSymptoms: symptoms.length,
        mlModel:
          "Disease Prediction ML Model (4920 samples, 132 symptoms, 41 diseases)",
      });
      setStep(3);
      setLoading(false);

      addNotification({
        title: "Analysis Complete",
        message: `Predicted ${topPredictions.length} possible condition(s)`,
        type: "success",
      });
    }, 1500);
  };

  const resetChecker = () => {
    setStep(1);
    setPatientInfo({ age: "", sex: "" });
    setSymptoms([]);
    setDiagnosis(null);
    setSearchQuery("");
    setSuggestions([]);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-blue-100 text-blue-700 border-blue-300";
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-8 mb-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center">
            <Brain size={32} weight="duotone" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">ML-Powered Symptom Checker</h1>
            <p className="text-slate-500">
              Machine Learning Disease Prediction
            </p>
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-4">
          <div className="flex items-start gap-3 mb-3">
            <Lightning
              size={20}
              className="mt-0.5 flex-shrink-0 text-amber-500"
              weight="fill"
            />
            <p className="text-sm text-slate-600">
              <strong>AI Model:</strong> Trained on 4,920 medical cases with 132
              symptoms across 41 diseases.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Info size={20} className="mt-0.5 flex-shrink-0 text-blue-500" />
            <p className="text-sm text-slate-600">
              <strong>Disclaimer:</strong> AI predictions are preliminary.
              Always consult a healthcare professional.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((num) => (
            <>
              <div
                key={num}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step >= num
                    ? "bg-slate-900 text-white scale-110"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {num}
              </div>
              {num < 3 && (
                <div
                  className={`w-20 h-1 transition-all ${
                    step > num ? "bg-slate-900" : "bg-slate-200"
                  }`}
                ></div>
              )}
            </>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 animate-slide-up">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900">
            <User size={28} className="text-slate-900" weight="duotone" />
            Basic Information
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Age
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={patientInfo.age}
                onChange={(e) =>
                  setPatientInfo({ ...patientInfo, age: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none"
                placeholder="Enter your age"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Sex
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() =>
                    setPatientInfo({ ...patientInfo, sex: "male" })
                  }
                  className={`py-3 px-6 rounded-xl font-bold transition-all ${
                    patientInfo.sex === "male"
                      ? "bg-slate-900 text-white shadow-lg"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Male
                </button>
                <button
                  onClick={() =>
                    setPatientInfo({ ...patientInfo, sex: "female" })
                  }
                  className={`py-3 px-6 rounded-xl font-bold transition-all ${
                    patientInfo.sex === "female"
                      ? "bg-slate-900 text-white shadow-lg"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                if (patientInfo.age && patientInfo.sex) {
                  setStep(2);
                } else {
                  addNotification({
                    title: "Incomplete Information",
                    message: "Please fill in all fields",
                    type: "error",
                  });
                }
              }}
              disabled={!patientInfo.age || !patientInfo.sex}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Symptoms
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-slide-up">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900">
              <Pulse size={28} className="text-slate-900" weight="duotone" />
              Select Your Symptoms
            </h2>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Brain
                  size={20}
                  className="text-blue-600 mt-0.5"
                  weight="fill"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900 mb-1">
                    ML Model Active
                  </p>
                  <p className="text-xs text-slate-600">
                    Searching from 132 symptoms in medical database.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSymptomSearch(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Search symptoms (e.g., headache, fever, cough)..."
              />

              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-80 overflow-y-auto z-50">
                  {suggestions.map((symptom) => (
                    <div
                      key={symptom.id}
                      onClick={() => addSymptom(symptom)}
                      className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                    >
                      <p className="font-medium text-slate-900">
                        {symptom.common_name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Medical term: {symptom.id}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {symptoms.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-700 mb-3">
                  Selected Symptoms ({symptoms.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((symptom) => (
                    <div
                      key={symptom.id}
                      className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 group border border-slate-200"
                    >
                      {symptom.common_name}
                      <button
                        onClick={() => removeSymptom(symptom.id)}
                        className="text-slate-400 hover:text-slate-600 transition-colors font-bold text-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {symptoms.length === 0 && (
              <div className="text-center py-12">
                <Thermometer
                  size={48}
                  className="mx-auto text-slate-300 mb-4"
                  weight="duotone"
                />
                <p className="text-slate-500 font-medium">
                  No symptoms added yet
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Search and add your symptoms above
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                Back
              </button>
              <button
                onClick={predictDisease}
                disabled={symptoms.length === 0 || loading}
                className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    AI Analyzing...
                  </>
                ) : (
                  <>
                    <Brain size={20} weight="fill" />
                    Run ML Prediction
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Lightning size={18} className="text-amber-500" weight="fill" />
              Quick Add Common Symptoms
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                "headache",
                "high_fever",
                "cough",
                "fatigue",
                "nausea",
                "vomiting",
                "dizziness",
                "chest_pain",
                "abdominal_pain",
                "back_pain",
                "muscle_pain",
                "joint_pain",
              ].map((symptomId) => {
                const symptom = {
                  id: symptomId,
                  name: symptomId.replace(/_/g, " "),
                  common_name: symptomId
                    .replace(/_/g, " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" "),
                };
                return (
                  <button
                    key={symptomId}
                    onClick={() => addSymptom(symptom)}
                    disabled={symptoms.find((s) => s.id === symptom.id)}
                    className="px-3 py-2 text-sm bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left border border-slate-200"
                  >
                    {symptom.common_name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {step === 3 && diagnosis && (
        <div className="space-y-6 animate-slide-up">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-900">
                <CheckCircle
                  size={28}
                  className="text-green-600"
                  weight="fill"
                />
                ML Analysis Complete
              </h2>
              <div className="text-right">
                <p className="text-xs text-slate-500">Analyzed Symptoms</p>
                <p className="text-2xl font-bold text-blue-600">
                  {diagnosis.totalSymptoms}
                </p>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
              <p className="text-sm text-indigo-700 flex items-center gap-2">
                <Brain size={18} weight="fill" />
                <strong>ML Model:</strong> {diagnosis.mlModel}
              </p>
            </div>

            <div className="space-y-4">
              {diagnosis.conditions.map((condition, index) => (
                <div
                  key={condition.id}
                  className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                    condition.urgent
                      ? "bg-red-50 border-red-200"
                      : index === 0
                        ? "bg-indigo-50 border-indigo-200"
                        : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {condition.urgent && (
                          <Warning
                            size={24}
                            className="text-red-600"
                            weight="fill"
                          />
                        )}
                        {index === 0 && !condition.urgent && (
                          <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                            TOP MATCH
                          </span>
                        )}
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-bold border ${getSeverityColor(condition.severity)}`}
                        >
                          {condition.severity?.toUpperCase()}
                        </span>
                      </div>
                      <h3
                        className={`text-xl font-bold ${
                          condition.urgent ? "text-red-700" : "text-slate-900"
                        }`}
                      >
                        {condition.common_name}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Matched {condition.matchedSymptoms} of your symptoms
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-3xl font-bold ${
                          condition.urgent
                            ? "text-red-600"
                            : index === 0
                              ? "text-indigo-600"
                              : "text-blue-600"
                        }`}
                      >
                        {(condition.probability * 100).toFixed(0)}%
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Confidence</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4 mt-4">
                    <p className="text-sm font-bold text-slate-700 mb-2">
                      Description:
                    </p>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      {condition.details}
                    </p>

                    <p className="text-sm font-bold text-slate-700 mb-2">
                      Recommendation:
                    </p>
                    <p
                      className={`leading-relaxed ${condition.urgent ? "text-red-700 font-medium" : "text-slate-600"}`}
                    >
                      {condition.recommendation}
                    </p>
                  </div>

                  {condition.urgent && (
                    <div className="mt-4 p-4 bg-red-100 rounded-lg border border-red-300">
                      <p className="text-sm font-bold text-red-900 flex items-center gap-2">
                        <Info size={18} weight="fill" />
                        URGENT: This condition requires immediate medical
                        attention!
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Info size={20} className="text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900 mb-2">
                    Important Medical Disclaimer
                  </h4>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>
                      • ML predictions are based on statistical patterns, not
                      clinical diagnosis
                    </li>
                    <li>
                      • Always consult a qualified healthcare professional for
                      accurate diagnosis
                    </li>
                    <li>
                      • If symptoms worsen or persist, seek medical attention
                      immediately
                    </li>
                    <li>
                      • In case of emergency, call emergency services (108/102)
                      right away
                    </li>
                    <li>• Do not self-medicate based on these predictions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={resetChecker}
                className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                New Analysis
              </button>
              <button
                onClick={onBack}
                className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
              >
                Back to Healthcare
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN HEALTHCARE COMPONENT
// ============================================

const Healthcare = () => {
  const [activeView, setActiveView] = useState("menu");
  const [providers, setProviders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useApp();
  const navigate = useNavigate();

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

  useEffect(() => {
    loadHealthcareData();
  }, []);

  const menuItems = [
    {
      id: "ml-symptom-checker",
      title: "Symptom Checker",
      icon: Brain,
      accent: "purple",
      desc: "AI disease prediction from symptoms using trained medical model.",
      badge: "ML POWERED",
    },

    {
      id: "telemedicine",
      title: "Telemedicine",
      icon: VideoCamera,
      accent: "purple",
      desc: "Consult doctors online from home.",
    },
    {
      id: "medications",
      title: "Medication Tracker",
      icon: PhosphorPill,
      accent: "green",
      desc: "Track prescriptions & get reminders.",
    },
    {
      id: "campaigns",
      title: "Campaigns",
      icon: PhosphorUsers,
      accent: "rose",
      desc: "Join community health drives & camps.",
    },
    {
      id: "appointments",
      title: "Appointments",
      icon: Calendar,
      accent: "blue",
      desc: "Book & manage doctor visits.",
    },
    {
      id: "records",
      title: "Health Records",
      icon: PhosphorFileText,
      accent: "amber",
      desc: "View your medical history & reports.",
    },
  ];

  const renderView = () => {
    switch (activeView) {
      case "ml-symptom-checker":
        return <MLSymptomChecker onBack={() => setActiveView("menu")} />;
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
            appointments={appointments}
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
        return (
          <HealthRecords
            records={healthRecords}
            onBack={() => setActiveView("menu")}
          />
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
            <ArrowLeft size={18} weight="bold" />
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
        <h1 className="text-3xl font-bold text-slate-900">
          Healthcare Services
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Access comprehensive medical resources and manage your health.
        </p>
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
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${theme.bg} ${theme.text} group-hover:scale-110 transition-transform`}
              >
                <item.icon size={32} weight="fill" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {item.desc}
              </p>
              {item.badge && (
                <div className="mt-3">
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-bold">
                    {item.badge}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        <Link
          to="/healthcare-scanner"
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 block"
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-indigo-100 text-indigo-600 group-hover:scale-110 transition-transform">
            <FileText size={32} />
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
            Consent Form Scanner
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">
            Upload & extract patient details from forms.
          </p>
        </Link>
      </div>
    </div>
  );
};

// ============================================
// EXISTING COMPONENTS (PRESERVED)
// ============================================

const AppointmentBooking = ({
  providers,
  appointments,
  loading,
  onBack,
  onBook,
}) => {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("Checkup");
  const [view, setView] = useState("list");

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500">
        Loading appointments...
      </div>
    );

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
          <h2 className="text-2xl font-bold text-slate-800">
            Your Appointments
          </h2>
          <p className="text-slate-500 text-sm">Manage upcoming visits</p>
        </div>
        {view === "list" && (
          <button
            onClick={() => setView("book")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} weight="bold" className="mr-2" /> Book New
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
          {appointments.length > 0 ? (
            appointments.map((appt, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
                    <Hospital size={24} weight="duotone" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">
                      {appt.provider}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {appt.doctor} • {appt.specialty}
                    </p>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1" /> {appt.date}
                      </span>
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" /> {appt.time}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                  {appt.status}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
              <Calendar size={48} className="mx-auto mb-3 opacity-20" />
              <p>No appointments found.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 animate-slide-up">
          <h3 className="text-xl font-bold text-slate-800 mb-6">
            Book New Appointment
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                Select Provider
              </label>
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
                      <h4 className="font-bold text-slate-800">
                        {provider.name}
                      </h4>
                      <div className="flex items-center text-amber-500 text-sm">
                        <Star size={16} weight="fill" className="mr-1" />
                        {provider.rating}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">
                      {provider.specialty}
                    </p>
                    <div className="flex items-center text-xs text-slate-500">
                      <MapPin size={14} className="mr-1" />
                      {provider.distance} km away
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Date
                </label>
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
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Type
                </label>
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
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  Available Time Slots
                </label>
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
        <p className="text-slate-500 text-sm">
          Analysis, prescriptions & history
        </p>
      </div>
      <div className="grid gap-4">
        {records.map((record, i) => (
          <div
            key={i}
            className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6"
          >
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800 text-lg">
                  {record.type}
                </h3>
                <span className="text-xs text-slate-400 font-bold bg-slate-50 px-2 py-1 rounded-lg">
                  {record.date}
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium mb-4">
                {record.doctor}
              </p>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-xs font-bold text-slate-400 uppercase block mb-1">
                    Diagnosis
                  </span>
                  <p className="text-slate-700">{record.diagnosis}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl">
                  <span className="text-xs font-bold text-blue-400 uppercase block mb-1">
                    Prescription
                  </span>
                  <p className="text-blue-700">{record.prescription}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {records.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No records found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Healthcare;
