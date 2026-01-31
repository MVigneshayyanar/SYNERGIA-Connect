import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db, storage } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { User, Calendar, Envelope, Lock, Phone, Briefcase, FileText, ArrowRight, ShieldCheck, CheckCircle } from '@phosphor-icons/react';
import AccessibilityPopup from '../components/AccessibilityPopup';
import VoiceAssistant from '../components/VoiceAssistant';
import VoiceAssistantToggle from '../components/VoiceAssistantToggle';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: 'select',
        phone: '',
        age: '',
        profession: '',
        experience: '',
    });

    const [documentFile, setDocumentFile] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setDocumentFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        if (formData.password.length < 6) {
            return setError("Password must be at least 6 characters");
        }

        try {
            setError('');
            setLoading(true);

            // 1. Create Authentication User FIRST
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // 2. Upload Document if provided (optional now)
            let docUrl = "";
            if (documentFile) {
                try {
                    const storageRef = ref(storage, `profession_docs/${user.uid}_${documentFile.name}`);
                    await uploadBytes(storageRef, documentFile);
                    docUrl = await getDownloadURL(storageRef);
                } catch (uploadError) {
                    console.error("Document upload failed:", uploadError);
                }
            }

            // 3. Determine verification status
            const experience = parseInt(formData.experience) || 0;
            const verificationStatus = experience >= 2 ? "verified" : "pending";

            // 4. Create User Profile Data in Firestore
            const userProfile = {
                uid: user.uid,
                email: formData.email,
                name: formData.name || formData.email.split('@')[0],
                dob: formData.dob || "",
                gender: formData.gender !== 'select' ? formData.gender : "",
                phone: formData.phone || "",
                age: formData.age || "",
                profession: formData.profession || "Not specified",
                experience: formData.experience || "",
                photoUrl: "",
                professionDocUrl: docUrl,
                verificationStatus: verificationStatus,
                createdAt: new Date().toISOString(),
                roles: {
                    education: true,
                    healthcare: true,
                    transport: true,
                    housing: true
                }
            };

            try {
                await setDoc(doc(db, "users", user.uid), userProfile);
                console.log("Profile created successfully");
            } catch (firestoreError) {
                console.error("Firestore write failed:", firestoreError);
            }

            navigate("/");
        } catch (err) {
            console.error("Signup error:", err);
            if (err.code === 'auth/email-already-in-use') {
                setError("This email is already registered. Please login instead.");
            } else if (err.code === 'auth/weak-password') {
                setError("Password is too weak. Please use a stronger password.");
            } else if (err.code === 'auth/invalid-email') {
                setError("Invalid email address.");
            } else {
                setError("Failed to create account: " + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (step === 1) {
            if (!formData.email || !formData.password || !formData.confirmPassword) {
                setError("Please fill in all required fields");
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError("Passwords do not match");
                return;
            }
            if (formData.password.length < 6) {
                setError("Password must be at least 6 characters");
                return;
            }
        }
        setError('');
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    return (
        <>
            {/* Accessibility Components */}
            <AccessibilityPopup />
            <VoiceAssistant />

            {/* Header with accessibility controls */}
            <header className="fixed top-0 right-0 z-50 p-4 flex items-center gap-3">
                <VoiceAssistantToggle />
                <LanguageSwitcher />
            </header>

            <div className="min-h-screen flex">
                {/* Left Side - Branding Panel */}
                <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-[#FF6347] via-[#FF7F5E] to-[#FF8C69] relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10 flex flex-col justify-center px-12 text-white">
                        {/* Logo */}
                        <div className="flex items-center mb-10">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-2xl">
                                <span className="font-bold text-[#FF6347] text-2xl">S</span>
                            </div>
                            <span className="ml-3 text-2xl font-bold tracking-tight">SYNERGIA</span>
                        </div>

                        <h1 className="text-4xl font-bold leading-tight mb-4">
                            Join Our<br />Community
                        </h1>

                        <p className="text-lg text-white/80 mb-10">
                            Create your account and unlock access to all services.
                        </p>

                        {/* Steps */}
                        <div className="space-y-4">
                            {[
                                { num: 1, title: "Account Details", desc: "Email & Password" },
                                { num: 2, title: "Personal Info", desc: "Your basic details" },
                                { num: 3, title: "Professional", desc: "Optional verification" },
                            ].map((s) => (
                                <div key={s.num} className={`flex items-center gap-4 p-3 rounded-xl transition-all ${step >= s.num ? 'bg-white/15' : 'bg-transparent'}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${step > s.num ? 'bg-white text-[#FF6347]' : step === s.num ? 'bg-white text-[#FF6347]' : 'bg-white/20 text-white/60'}`}>
                                        {step > s.num ? <CheckCircle weight="bold" size={20} /> : s.num}
                                    </div>
                                    <div>
                                        <div className={`font-semibold ${step >= s.num ? 'text-white' : 'text-white/60'}`}>{s.title}</div>
                                        <div className={`text-sm ${step >= s.num ? 'text-white/80' : 'text-white/40'}`}>{s.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Trust Badge */}
                        <div className="mt-12 flex items-center gap-3 text-white/70">
                            <ShieldCheck size={20} weight="fill" />
                            <span className="text-sm">Your data is secure & encrypted</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Signup Form */}
                <div className="flex-1 flex items-center justify-center bg-white px-6 py-10 overflow-y-auto">
                    <div className="w-full max-w-xl">
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#FF6347] to-[#FF8C69] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF6347]/20 mx-auto mb-3">
                                <span className="font-bold text-white text-2xl">S</span>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">SYNERGIA</h2>
                        </div>

                        {/* Progress Bar (Mobile) */}
                        <div className="lg:hidden mb-6">
                            <div className="flex gap-2">
                                {[1, 2, 3].map((s) => (
                                    <div key={s} className={`flex-1 h-1.5 rounded-full ${step >= s ? 'bg-[#FF6347]' : 'bg-slate-200'}`} />
                                ))}
                            </div>
                            <div className="text-center mt-2 text-sm text-slate-500">Step {step} of 3</div>
                        </div>

                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-slate-900">
                                {step === 1 && "Create Your Account"}
                                {step === 2 && "Personal Information"}
                                {step === 3 && "Professional Details"}
                            </h1>
                            <p className="text-slate-500 mt-1">
                                {step === 1 && "Start with your email and password"}
                                {step === 2 && "Tell us a bit about yourself"}
                                {step === 3 && "Optional: Add your work details"}
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* Step 1: Account Details */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address *</label>
                                        <div className="relative">
                                            <Envelope className="absolute left-4 top-3.5 text-slate-400" size={20} />
                                            <input
                                                name="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="pl-12 w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF6347]/20 focus:border-[#FF6347] transition-all outline-none"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password *</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                                            <input
                                                name="password"
                                                type="password"
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="pl-12 w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF6347]/20 focus:border-[#FF6347] transition-all outline-none"
                                                placeholder="Min 6 characters"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password *</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                                            <input
                                                name="confirmPassword"
                                                type="password"
                                                required
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className="pl-12 w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF6347]/20 focus:border-[#FF6347] transition-all outline-none"
                                                placeholder="Repeat your password"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="w-full flex justify-center items-center py-4 px-4 rounded-xl text-base font-bold text-white bg-[#FF6347] hover:bg-[#E55A3C] transition-all shadow-lg shadow-[#FF6347]/25 mt-6"
                                    >
                                        Continue
                                        <ArrowRight className="ml-2" size={20} weight="bold" />
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Personal Info */}
                            {step === 2 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-3.5 text-slate-400" size={20} />
                                                <input
                                                    name="name"
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="pl-12 w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF6347]/20 focus:border-[#FF6347] transition-all outline-none"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date of Birth</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-3.5 text-slate-400" size={20} />
                                                <input
                                                    name="dob"
                                                    type="date"
                                                    value={formData.dob}
                                                    onChange={handleChange}
                                                    className="pl-12 w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF6347]/20 focus:border-[#FF6347] transition-all outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF6347]/20 focus:border-[#FF6347] transition-all outline-none text-slate-700"
                                            >
                                                <option value="select">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-3.5 text-slate-400" size={20} />
                                                <input
                                                    name="phone"
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="pl-12 w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF6347]/20 focus:border-[#FF6347] transition-all outline-none"
                                                    placeholder="+91 98765 43210"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="flex-1 py-3.5 px-4 rounded-xl text-base font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="flex-1 flex justify-center items-center py-3.5 px-4 rounded-xl text-base font-bold text-white bg-[#FF6347] hover:bg-[#E55A3C] transition-all shadow-lg shadow-[#FF6347]/25"
                                        >
                                            Continue
                                            <ArrowRight className="ml-2" size={20} weight="bold" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Professional Details */}
                            {step === 3 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Profession</label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-4 top-3.5 text-slate-400" size={20} />
                                                <input
                                                    name="profession"
                                                    type="text"
                                                    value={formData.profession}
                                                    onChange={handleChange}
                                                    className="pl-12 w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF6347]/20 focus:border-[#FF6347] transition-all outline-none"
                                                    placeholder="Software Engineer"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Experience (Years)</label>
                                            <input
                                                name="experience"
                                                type="number"
                                                value={formData.experience}
                                                onChange={handleChange}
                                                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF6347]/20 focus:border-[#FF6347] transition-all outline-none"
                                                placeholder="2+ years for verification"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Upload Document (Optional)</label>
                                        <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 hover:bg-slate-50 transition-colors text-center cursor-pointer group">
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                            />
                                            <div className="w-12 h-12 bg-[#FF6347]/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-[#FF6347]/20 transition-colors">
                                                <FileText className="text-[#FF6347]" size={24} />
                                            </div>
                                            <p className="text-sm font-medium text-slate-700">
                                                {documentFile ? documentFile.name : "Click or drag to upload"}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">PDF, JPG or PNG (Max 5MB)</p>
                                        </div>
                                    </div>

                                    <div className="bg-[#FF6347]/5 border border-[#FF6347]/20 rounded-xl p-4 flex items-start gap-3">
                                        <ShieldCheck className="text-[#FF6347] flex-shrink-0 mt-0.5" size={20} weight="fill" />
                                        <div className="text-sm">
                                            <div className="font-semibold text-slate-900">Get Verified Status</div>
                                            <div className="text-slate-600">Users with 2+ years of experience and valid documents get verified badges.</div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="flex-1 py-3.5 px-4 rounded-xl text-base font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 flex justify-center items-center py-3.5 px-4 rounded-xl text-base font-bold text-white bg-[#FF6347] hover:bg-[#E55A3C] transition-all shadow-lg shadow-[#FF6347]/25 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <span className="flex items-center gap-2">
                                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Creating...
                                                </span>
                                            ) : (
                                                <>
                                                    Create Account
                                                    <ArrowRight className="ml-2" size={20} weight="bold" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>

                        <div className="mt-6 text-center text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link to="/login" className="font-semibold text-[#FF6347] hover:text-[#E55A3C] transition-colors">
                                Sign in here
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;

