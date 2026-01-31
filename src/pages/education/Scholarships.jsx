import { useState, useEffect } from "react";
import { Student, Bank, ArrowRight, X, GraduationCap, CheckCircle, Warning, Buildings, HandHeart, Spinner } from "@phosphor-icons/react";
import { api } from "../../services/api";

const Scholarships = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [showFoundationPopup, setShowFoundationPopup] = useState(false);
    const [eligibilityResult, setEligibilityResult] = useState(null);
    const [foundations, setFoundations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch foundations on mount
    const fetchFoundations = async () => {
        try {
            setLoading(true);
            const data = await api.getFoundations();
            setFoundations(data);
        } catch (error) {
            console.error("Failed to load foundations", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoundations();
    }, []);

    const closePopup = () => {
        setShowPopup(false);
        setEligibilityResult(null);
    };

    // Callback when a new foundation is successfully registered
    const handleRegistrationSuccess = () => {
        fetchFoundations(); // Refresh the list
    };

    return (
        <div className="h-full flex flex-col space-y-8 animate-fade-in relative">
            {/* Header with Register Foundation Button */}
             <div className="flex justify-between items-center">
                <div>
                     <h1 className="text-2xl font-bold text-slate-800">Scholarship Portal</h1>
                     <p className="text-slate-500 text-sm">Find financial aid and grants</p>
                </div>
                <button 
                    onClick={() => setShowFoundationPopup(true)}
                    className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                >
                    <Buildings size={18} weight="duotone" className="text-slate-500" />
                    <span>Register as Foundation</span>
                </button>
            </div>

            {/* Hero Card */}
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl shadow-yellow-500/20">
                <div className="relative z-10 w-full md:w-3/4">
                    <span className="bg-white/20 backdrop-blur-sm text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Financial Aid</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Unlock Your Potential with Scholarships</h2>
                    <p className="text-slate-900/80 font-medium mb-8 max-w-xl">
                        Browse financial aid opportunities from our registered foundation partners. We've matched over $2M in funds to students like you.
                    </p>
                    <button 
                        onClick={() => setShowPopup(true)}
                        className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 hover:shadow-lg transition-all flex items-center"
                    >
                        Check Eligibility <ArrowRight className="ml-2" weight="bold"/>
                    </button>
                </div>
                {/* Decorative & Icon */}
                <div className="absolute right-0 bottom-0 opacity-10">
                    <Student size={300} weight="fill" className="text-white transform translate-x-12 translate-y-12" />
                </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 px-1">Registered Foundations & Grants</h3>
            
            {loading ? (
                <div className="flex justify-center py-12">
                    <Spinner size={32} className="text-slate-400 animate-spin" />
                </div>
            ) : foundations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {foundations.map((foundation, i) => (
                        <div key={foundation.id || i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-amber-200 transition-all group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center border border-amber-100">
                                        <Bank size={24} weight="duotone"/>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-slate-400">NGO Partner</span>
                                        <span className="block text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full w-fit mt-1">Verified</span>
                                    </div>
                                </div>
                            </div>
                            <h4 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-amber-600 transition-colors">{foundation.name}</h4>
                            <p className="text-xs text-slate-500 mb-4">Reg ID: {foundation.regNumber}</p>
                            
                            <div className="grid grid-cols-2 gap-4 mt-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div>
                                    <span className="block text-xs text-slate-500 uppercase tracking-wide">Grant Amount</span>
                                    <span className="block font-bold text-slate-800 text-lg">Variable</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xs text-slate-500 uppercase tracking-wide">Status</span>
                                    <span className="block font-bold text-slate-800 text-lg">Active</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 flex items-center">
                                <Buildings size={14} className="mr-1"/>
                                {foundation.address || "Location not specified"}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                    <Buildings size={48} className="text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700">No Foundations Registered Yet</h3>
                    <p className="text-slate-500 mt-1 max-w-sm mx-auto">Be the first to register your NGO and support students.</p>
                    <button 
                        onClick={() => setShowFoundationPopup(true)}
                        className="mt-6 text-indigo-600 font-bold hover:text-indigo-700 hover:underline"
                    >
                        Register Now
                    </button>
                </div>
            )}

            {/* Eligibility Popup */}
            {showPopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Check Eligibility</h3>
                                <p className="text-xs text-slate-500 mt-1">Verify for Free Seat Program</p>
                            </div>
                            <button onClick={closePopup} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
                                <X size={20} weight="bold" />
                            </button>
                        </div>

                        <div className="p-6">
                            {!eligibilityResult ? (
                                <EligibilityForm onSubmit={(result) => setEligibilityResult(result)} />
                            ) : (
                                <EligibilityResult status={eligibilityResult} onRetry={() => setEligibilityResult(null)} onClose={closePopup} />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Foundation Registration Popup */}
            {showFoundationPopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                    <HandHeart size={24} weight="fill" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Register Foundation</h3>
                                    <p className="text-xs text-slate-500 mt-1">Join our network of NGOs</p>
                                </div>
                            </div>
                            <button onClick={() => setShowFoundationPopup(false)} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
                                <X size={20} weight="bold" />
                            </button>
                        </div>

                        <div className="p-6">
                            <FoundationForm 
                                onClose={() => setShowFoundationPopup(false)} 
                                onSuccess={handleRegistrationSuccess}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ... Existing Eligibility Components ...

const EligibilityForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        gpa: "",
        income: "",
        category: "General"
    });

    const isEligible = () => {
        // Simple mock logic
        const gpa = parseFloat(formData.gpa);
        const income = parseFloat(formData.income);
        
        // Example criteria: GPA > 7.5 and Income < 800000
        if (gpa >= 7.5 && income < 800000) return 'eligible';
        return 'not-eligible';
    };

    const check = (e) => {
        e.preventDefault();
        // Simulate checking
        setTimeout(() => {
            const result = isEligible();
            onSubmit(result);
        }, 800);
    };

    return (
        <form onSubmit={check} className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                <div className="flex items-start">
                    <GraduationCap size={24} className="text-blue-600 mr-3 mt-0.5" weight="duotone"/>
                    <div>
                        <h4 className="font-bold text-blue-800 text-sm">Free Seat Eligibility Check</h4>
                        <p className="text-blue-600 text-xs mt-1">Enter your academic details to instantly verify if you qualify for a 100% tuition waiver.</p>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">CGPA / Percentage</label>
                <input 
                    type="number" 
                    step="0.01" 
                    placeholder="e.g. 8.5" 
                    required 
                    value={formData.gpa}
                    onChange={(e) => setFormData({...formData, gpa: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all font-medium"
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Annual Family Income (₹)</label>
                <input 
                    type="number" 
                    placeholder="e.g. 500000" 
                    required 
                    value={formData.income}
                    onChange={(e) => setFormData({...formData, income: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all font-medium"
                />
            </div>
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all font-medium"
                >
                    <option>General</option>
                    <option>OBC</option>
                    <option>SC/ST</option>
                    <option>EWS</option>
                </select>
            </div>

            <button type="submit" className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 hover:shadow-lg transition-all mt-4">
                Check My Eligibility
            </button>
        </form>
    );
};

const EligibilityResult = ({ status, onRetry, onClose }) => {
    if (status === 'eligible') {
        return (
            <div className="text-center space-y-4 animate-scale-in">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={40} weight="fill" className="text-green-600" />
                </div>
                <div>
                    <h4 className="text-2xl font-bold text-slate-800">You are Eligible!</h4>
                    <p className="text-slate-500 mt-2">Congratulations! Based on your profile, you qualify for the <span className="font-bold text-green-600">Free Seat Program</span>.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-sm text-green-800 font-medium">
                    Next Step: Submit your official transcript for verification.
                </div>
                <button onClick={onClose} className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all">
                    Proceed to Apply
                </button>
            </div>
        );
    }

    return (
        <div className="text-center space-y-4 animate-scale-in">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Warning size={40} weight="fill" className="text-amber-600" />
            </div>
            <div>
                <h4 className="text-2xl font-bold text-slate-800">Partially Eligible</h4>
                <p className="text-slate-500 mt-2">You might not qualify for the full free seat, but you are eligible for a <span className="font-bold text-amber-600">50% Tuition Waiver</span>.</p>
            </div>
            <button onClick={onRetry} className="text-slate-500 hover:text-slate-800 font-medium text-sm underline">
                Check details again
            </button>
            <button onClick={onClose} className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all">
                View Partial Waiver
            </button>
        </div>
    );
};

// New Foundation Form Component
const FoundationForm = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        regNumber: "",
        email: "",
        phone: "",
        address: "",
        confirmed: false
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.registerFoundation(formData);
            setSubmitted(true);
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(err);
            setError("Failed to register. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="text-center space-y-6 animate-scale-in py-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                    <CheckCircle size={48} weight="fill" className="text-green-600" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-900">Registration Submitted!</h3>
                    <p className="text-slate-500 mt-2 max-w-xs mx-auto">Thank you for registering. Your details have been recorded and are now visible.</p>
                </div>
                <button 
                    onClick={onClose}
                    className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
                >
                    Done
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium flex items-center">
                    <Warning className="mr-2" size={16} /> {error}
                </div>
            )}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Foundation / NGO Name</label>
                <input 
                    type="text" 
                    required 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                    placeholder="e.g. Hope Foundation"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                />
            </div>
            
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Registration Number (ID)</label>
                <input 
                    type="text" 
                    required 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                    placeholder="e.g. NGO-2024-X89"
                    value={formData.regNumber}
                    onChange={e => setFormData({...formData, regNumber: e.target.value})}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                    <input 
                        type="email" 
                        required 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                        placeholder="contact@org.com"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                    <input 
                        type="tel" 
                        required 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                        placeholder="+91 98765..."
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Address</label>
                <textarea 
                    rows="2"
                    required 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium resize-none"
                    placeholder="Registered Office Address"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                ></textarea>
            </div>

            <div className="flex items-start gap-3 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <input 
                    type="checkbox" 
                    id="confirm"
                    required
                    checked={formData.confirmed}
                    onChange={e => setFormData({...formData, confirmed: e.target.checked})}
                    className="mt-1 w-5 h-5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="confirm" className="text-sm text-indigo-900 cursor-pointer">
                    I confirm that this is a government-registered foundation/NGO and I am authorized to register on its behalf.
                </label>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 mt-2 flex justify-center items-center"
            >
                {loading ? <Spinner size={24} className="animate-spin text-white" /> : "Submit Registration"}
            </button>
        </form>
    );
};

export default Scholarships;
