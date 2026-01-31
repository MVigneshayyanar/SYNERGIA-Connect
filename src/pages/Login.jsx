import { Envelope, Lock, ArrowRight, ShieldCheck, Buildings, GraduationCap, Heartbeat } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import AccessibilityPopup from "../components/AccessibilityPopup";
import VoiceAssistant from "../components/VoiceAssistant";
import VoiceAssistantToggle from "../components/VoiceAssistantToggle";
import LanguageSwitcher from "../components/LanguageSwitcher";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);
            const email = e.target.email.value;
            const password = e.target.password.value;

            await login(email, password);
            navigate("/");
        } catch (err) {
            setError("Failed to sign in. Please check your credentials.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: Buildings, label: "Housing & Property" },
        { icon: GraduationCap, label: "Education Hub" },
        { icon: Heartbeat, label: "Healthcare Access" },
    ];

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
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#FF6347] via-[#FF7F5E] to-[#FF8C69] relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full" />
                    </div>

                    <div className="relative z-10 flex flex-col justify-center px-16 text-white">
                        {/* Logo */}
                        <div className="flex items-center mb-12">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                                <span className="font-bold text-[#FF6347] text-3xl">S</span>
                            </div>
                            <div className="ml-4">
                                <span className="text-3xl font-bold tracking-tight block">SYNERGIA Connect</span>
                            </div>
                        </div>

                        <h1 className="text-4xl font-bold leading-tight mb-6">
                            Unified Digital Access to Essential Services
                        </h1>

                        <p className="text-xl text-white/80 mb-12 max-w-md">
                            Housing, education, healthcare, and transport - all in one platform.
                        </p>

                        {/* Feature Pills */}
                        <div className="flex flex-wrap gap-3">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/20">
                                    <feature.icon size={18} weight="bold" />
                                    <span className="text-sm font-medium">{feature.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Trust Badge - Updated */}
                        <div className="mt-16 flex items-center gap-3 text-white/70">
                            <ShieldCheck size={24} weight="fill" />
                            <span className="text-sm">Secure & Trusted Platform</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex-1 flex items-center justify-center bg-white px-6 py-12">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#FF6347] to-[#FF8C69] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FF6347]/20 mx-auto mb-4">
                                <span className="font-bold text-white text-3xl">S</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">SYNERGIA</h2>
                        </div>

                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
                            <p className="text-slate-500 mt-2">Sign in to access your dashboard</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Envelope size={20} className="text-slate-400" />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6347]/20 focus:border-[#FF6347] transition-all"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock size={20} className="text-slate-400" />
                                    </div>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6347]/20 focus:border-[#FF6347] transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-[#FF6347] focus:ring-[#FF6347] border-slate-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                                        Remember me
                                    </label>
                                </div>
                                <a href="#" className="text-sm font-semibold text-[#FF6347] hover:text-[#E55A3C] transition-colors">
                                    Forgot password?
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-4 px-4 rounded-xl text-base font-bold text-white bg-[#FF6347] hover:bg-[#E55A3C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6347] transition-all shadow-lg shadow-[#FF6347]/25 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="ml-2" size={20} weight="bold" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-slate-500">New to SYNERGIA?</span>
                                </div>
                            </div>

                            <Link
                                to="/signup"
                                className="mt-4 w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-base font-semibold text-[#FF6347] bg-[#FF6347]/5 border-2 border-[#FF6347]/20 hover:bg-[#FF6347]/10 hover:border-[#FF6347]/30 transition-all"
                            >
                                Create an Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;

