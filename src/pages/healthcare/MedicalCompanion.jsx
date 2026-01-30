import { useState } from "react";
import {
  ArrowLeft,
  MagnifyingGlass,
  Hospital,
  ShieldCheck,
  FirstAid,
  Heartbeat, // ✅ Use this for symptoms/activity
  NewspaperClipping,
  Sparkle,
  MapPin,
  Phone,
  Star,
  Money,
  Calendar,
  BookOpen,
  TrendUp,
  CheckCircle, // ✅ Add if missing
  Clock,
} from "@phosphor-icons/react";
import { useApp } from "../../context/AppContext";

const MedicalCompanion = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("find-provider");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useApp();

  const tabs = [
    {
      id: "find-provider",
      name: "Find a Provider",
      icon: Hospital,
      color: "blue",
    },
    {
      id: "insurance",
      name: "Health Insurance",
      icon: ShieldCheck,
      color: "green",
    },
    {
      id: "conditions",
      name: "Conditions & Treatments",
      icon: FirstAid,
      color: "red",
    },
    {
      id: "wellness",
      name: "Wellness & Prevention",
      icon: Heartbeat,
      color: "purple",
    },
    {
      id: "industry",
      name: "Healthcare Industry",
      icon: NewspaperClipping,
      color: "amber",
    },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    // Simulate AI search
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock results based on active tab
    const mockResults = generateMockResults(activeTab, searchQuery);
    setSearchResults(mockResults);
    setLoading(false);

    addNotification({
      title: "Search Complete",
      message: `Found ${mockResults.items?.length || 0} results`,
      type: "success",
    });
  };

  const generateMockResults = (tab, query) => {
    switch (tab) {
      case "find-provider":
        return {
          type: "providers",
          items: [
            {
              id: 1,
              name: "Dr. Sarah Johnson",
              specialty: "Cardiology",
              hospital: "City General Hospital",
              rating: 4.9,
              distance: "2.3 miles",
              available: true,
              phone: "(555) 123-4567",
              address: "123 Medical Plaza, Suite 200",
              acceptingNew: true,
            },
            {
              id: 2,
              name: "Dr. Michael Chen",
              specialty: "Cardiology",
              hospital: "Metro Heart Center",
              rating: 4.8,
              distance: "3.1 miles",
              available: true,
              phone: "(555) 987-6543",
              address: "456 Health Ave, Floor 3",
              acceptingNew: true,
            },
          ],
        };

      case "insurance":
        return {
          type: "insurance",
          explanation: {
            deductible:
              "The amount you pay before insurance covers costs. Example: $1,500/year",
            copay: "Fixed amount per visit. Example: $25 for primary care",
            coinsurance:
              "Percentage you pay after deductible. Example: 20% of costs",
            outOfPocket: "Maximum you pay yearly. Example: $8,000 max",
          },
          plans: [
            {
              id: 1,
              name: "Basic Health Plan",
              provider: "BlueCross BlueShield",
              monthly: 250,
              deductible: 2000,
              coverage: "80%",
              network: "Large",
            },
            {
              id: 2,
              name: "Premium Care Plan",
              provider: "United Healthcare",
              monthly: 450,
              deductible: 500,
              coverage: "90%",
              network: "Extra Large",
            },
          ],
        };

      case "conditions":
        return {
          type: "conditions",
          condition: "Hypertension (High Blood Pressure)",
          symptoms: [
            "Headaches",
            "Shortness of breath",
            "Nosebleeds",
            "Often no symptoms (silent killer)",
          ],
          treatments: [
            {
              category: "Lifestyle Changes",
              options: [
                "Reduce sodium intake",
                "Regular exercise",
                "Limit alcohol",
                "Quit smoking",
              ],
            },
            {
              category: "Medications",
              options: [
                "ACE inhibitors",
                "Beta blockers",
                "Diuretics",
                "Calcium channel blockers",
              ],
            },
          ],
          prevention:
            "Regular checkups, healthy diet, exercise 30 min/day, maintain healthy weight",
        };

      case "wellness":
        return {
          type: "wellness",
          recommendations: [
            {
              category: "Diet",
              icon: "🥗",
              tips: [
                "Eat 5 servings of fruits/vegetables daily",
                "Choose whole grains",
                "Limit processed foods",
                "Stay hydrated (8 glasses/day)",
              ],
            },
            {
              category: "Exercise",
              icon: "🏃",
              tips: [
                "150 minutes moderate activity/week",
                "Include strength training 2x/week",
                "Take 10,000 steps daily",
                "Stretch regularly",
              ],
            },
            {
              category: "Screenings",
              icon: "🔬",
              tips: [
                "Annual physical exam",
                "Blood pressure check",
                "Cholesterol test every 5 years",
                "Age-appropriate cancer screenings",
              ],
            },
          ],
        };

      case "industry":
        return {
          type: "industry",
          news: [
            {
              id: 1,
              title: "Telemedicine Adoption Reaches Record High",
              source: "Healthcare Today",
              date: "2 days ago",
              summary:
                "Virtual healthcare visits increased 38% this year as providers expand digital services.",
            },
            {
              id: 2,
              title: "New AI Tool Improves Early Cancer Detection",
              source: "Medical Innovation Weekly",
              date: "5 days ago",
              summary:
                "Machine learning algorithm shows 95% accuracy in identifying early-stage cancers.",
            },
          ],
          trends: [
            { name: "Personalized Medicine", growth: "+45%" },
            { name: "Remote Patient Monitoring", growth: "+62%" },
            { name: "AI Diagnostics", growth: "+38%" },
          ],
        };

      default:
        return null;
    }
  };

  const ActiveIcon = tabs.find((t) => t.id === activeTab)?.icon || Hospital;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center text-slate-600 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Healthcare
        </button>
        <div className="flex items-center gap-3 mb-2">
          <Sparkle size={32} weight="duotone" className="text-teal-600" />
          <h1 className="text-3xl font-bold text-slate-800">
            AI Medical Companion
          </h1>
        </div>
        <p className="text-slate-600">Your comprehensive healthcare guide</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchResults(null);
                  setSearchQuery("");
                }}
                className={`p-4 rounded-xl text-center transition-all ${
                  isActive
                    ? `bg-${tab.color}-50 border-2 border-${tab.color}-500`
                    : "bg-white hover:bg-slate-50 border-2 border-transparent"
                }`}
              >
                <Icon
                  size={24}
                  weight="duotone"
                  className={`mx-auto mb-2 ${
                    isActive ? `text-${tab.color}-600` : "text-slate-400"
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    isActive ? `text-${tab.color}-700` : "text-slate-600"
                  }`}
                >
                  {tab.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <ActiveIcon size={32} weight="duotone" />
          <h2 className="text-xl font-bold">
            {tabs.find((t) => t.id === activeTab)?.name}
          </h2>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder={getPlaceholder(activeTab)}
            className="flex-1 px-4 py-3 rounded-xl text-slate-800 focus:ring-2 focus:ring-white"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-white text-teal-600 px-6 py-3 rounded-xl font-bold hover:bg-teal-50 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
            ) : (
              <MagnifyingGlass size={20} weight="bold" />
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {searchResults && (
        <div className="space-y-6">
          {renderResults(searchResults, activeTab)}
        </div>
      )}

      {/* Quick Tips */}
      {!searchResults && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4">💡 Quick Tips</h3>
          {getQuickTips(activeTab)}
        </div>
      )}
    </div>
  );
};

const getPlaceholder = (tab) => {
  const placeholders = {
    "find-provider": "Search for cardiologist, dentist, hospital...",
    insurance: "Ask about deductibles, copays, or plan comparison...",
    conditions: "Search symptoms, treatments, or conditions...",
    wellness: "Ask about diet, exercise, or prevention...",
    industry: "Search healthcare news, trends, or statistics...",
  };
  return placeholders[tab];
};

const renderResults = (results, activeTab) => {
  switch (results.type) {
    case "providers":
      return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">
            Found {results.items.length} Providers
          </h3>
          <div className="space-y-4">
            {results.items.map((provider) => (
              <div
                key={provider.id}
                className="p-5 border border-slate-200 rounded-xl hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">
                      {provider.name}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {provider.specialty}
                    </p>
                    <p className="text-xs text-slate-500">
                      {provider.hospital}
                    </p>
                  </div>
                  <div className="flex items-center bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                    <Star size={14} weight="fill" className="mr-1" />
                    <span className="font-bold text-sm">{provider.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center text-slate-600">
                    <MapPin size={16} className="mr-2" />
                    {provider.distance}
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Phone size={16} className="mr-2" />
                    {provider.phone}
                  </div>
                </div>

                {provider.acceptingNew && (
                  <span className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    ✓ Accepting New Patients
                  </span>
                )}

                <button className="w-full mt-4 bg-teal-600 text-white py-2 rounded-lg font-bold hover:bg-teal-700 transition-colors">
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </div>
      );

    case "insurance":
      return (
        <>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Insurance Terms Simplified
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(results.explanation).map(
                ([term, explanation]) => (
                  <div key={term} className="p-4 bg-green-50 rounded-xl">
                    <h4 className="font-bold text-green-700 capitalize mb-1">
                      {term}
                    </h4>
                    <p className="text-sm text-slate-600">{explanation}</p>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Available Plans
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.plans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-5 border-2 border-slate-200 rounded-xl hover:border-green-500 transition-all"
                >
                  <h4 className="font-bold text-slate-800 mb-2">{plan.name}</h4>
                  <p className="text-sm text-slate-500 mb-4">{plan.provider}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Monthly Premium</span>
                      <span className="font-bold text-slate-800">
                        ${plan.monthly}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Deductible</span>
                      <span className="font-bold text-slate-800">
                        ${plan.deductible}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Coverage</span>
                      <span className="font-bold text-green-600">
                        {plan.coverage}
                      </span>
                    </div>
                  </div>

                  <button className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition-colors">
                    Select Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      );

    // Around line 370-420

    case "conditions":
      return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            {results.condition}
          </h3>

          <div className="space-y-6">
            {/* ✅ SYMPTOMS SECTION - FIXED */}
            <div>
              <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                <Heartbeat
                  size={20}
                  className="mr-2 text-red-600"
                  weight="duotone"
                />
                Common Symptoms
              </h4>
              <ul className="space-y-2">
                {results.symptoms.map((symptom, idx) => (
                  <li key={idx} className="flex items-center text-slate-600">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    {symptom}
                  </li>
                ))}
              </ul>
            </div>

            {/* TREATMENTS SECTION */}
            {results.treatments.map((treatment, idx) => (
              <div key={idx}>
                <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                  <FirstAid
                    size={20}
                    className="mr-2 text-blue-600"
                    weight="duotone"
                  />
                  {treatment.category}
                </h4>
                <ul className="space-y-2">
                  {treatment.options.map((option, optIdx) => (
                    <li
                      key={optIdx}
                      className="flex items-center text-slate-600"
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* PREVENTION SECTION */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <h4 className="font-bold text-purple-700 mb-2 flex items-center">
                <ShieldCheck size={20} className="mr-2" weight="duotone" />
                Prevention Tips
              </h4>
              <p className="text-slate-600 text-sm">{results.prevention}</p>
            </div>
          </div>
        </div>
      );

    case "wellness":
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {results.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <div className="text-4xl mb-3">{rec.icon}</div>
              <h3 className="font-bold text-slate-800 text-lg mb-4">
                {rec.category}
              </h3>
              <ul className="space-y-2">
                {rec.tips.map((tip, tipIdx) => (
                  <li
                    key={tipIdx}
                    className="flex items-start text-sm text-slate-600"
                  >
                    <Heartbeat
                      size={16}
                      className="mr-2 text-purple-500 flex-shrink-0 mt-0.5"
                    />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case "industry":
      return (
        <>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Latest Healthcare News
            </h3>
            <div className="space-y-4">
              {results.news.map((article) => (
                <div
                  key={article.id}
                  className="p-5 border border-slate-200 rounded-xl hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800">
                      {article.title}
                    </h4>
                    <span className="text-xs text-slate-500 whitespace-nowrap ml-3">
                      {article.date}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    {article.summary}
                  </p>
                  <span className="text-xs text-amber-600 font-medium">
                    {article.source}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Trending in Healthcare
            </h3>
            <div className="space-y-3">
              {results.trends.map((trend, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-amber-50 rounded-xl"
                >
                  <span className="font-medium text-slate-800">
                    {trend.name}
                  </span>
                  <div className="flex items-center text-green-600 font-bold">
                    <TrendUp size={18} className="mr-1" />
                    {trend.growth}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      );

    default:
      return null;
  }
};

const getQuickTips = (tab) => {
  const tips = {
    "find-provider": (
      <ul className="space-y-2 text-sm text-slate-600">
        <li>• Search by specialty (e.g., "cardiologist near me")</li>
        <li>• Filter by insurance accepted and patient ratings</li>
        <li>• Check availability for same-day appointments</li>
        <li>• Read patient reviews before booking</li>
      </ul>
    ),
    insurance: (
      <ul className="space-y-2 text-sm text-slate-600">
        <li>• Understand your deductible before choosing a plan</li>
        <li>• Compare in-network vs out-of-network costs</li>
        <li>• Check if your prescriptions are covered</li>
        <li>• Review annual out-of-pocket maximums</li>
      </ul>
    ),
    conditions: (
      <ul className="space-y-2 text-sm text-slate-600">
        <li>• Get evidence-based information on symptoms</li>
        <li>• Learn about treatment options and medications</li>
        <li>• Understand when to see a doctor vs self-care</li>
        <li>• Find prevention strategies for common conditions</li>
      </ul>
    ),
    wellness: (
      <ul className="space-y-2 text-sm text-slate-600">
        <li>• Get personalized diet and exercise recommendations</li>
        <li>• Schedule age-appropriate health screenings</li>
        <li>• Learn stress management techniques</li>
        <li>• Track your wellness goals and progress</li>
      </ul>
    ),
    industry: (
      <ul className="space-y-2 text-sm text-slate-600">
        <li>• Stay informed about healthcare policy changes</li>
        <li>• Learn about new medical breakthroughs</li>
        <li>• Understand healthcare cost trends</li>
        <li>• Access reports on system performance</li>
      </ul>
    ),
  };
  return tips[tab];
};

export default MedicalCompanion;
