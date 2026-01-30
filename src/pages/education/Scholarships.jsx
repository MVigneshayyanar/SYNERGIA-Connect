import { Student, Bank, ArrowRight } from "@phosphor-icons/react";

const Scholarships = () => {
    return (
        <div className="h-full flex flex-col space-y-8 animate-fade-in">
            {/* Hero Card */}
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl shadow-yellow-500/20">
                <div className="relative z-10 w-full md:w-3/4">
                    <span className="bg-white/20 backdrop-blur-sm text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Financial Aid</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Unlock Your Potential with Scholarships</h2>
                    <p className="text-slate-900/80 font-medium mb-8 max-w-xl">
                        Browse over 1,500 financial aid opportunities tailored to your academic profile. We've matched over $2M in funds to students like you.
                    </p>
                    <button className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 hover:shadow-lg transition-all flex items-center">
                        Check Eligibility <ArrowRight className="ml-2" weight="bold"/>
                    </button>
                </div>
                {/* Decorative & Icon */}
                <div className="absolute right-0 bottom-0 opacity-10">
                    <Student size={300} weight="fill" className="text-white transform translate-x-12 translate-y-12" />
                </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 px-1">Featured Opportunities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-amber-200 transition-all group cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center border border-amber-100">
                                    <Bank size={24} weight="duotone"/>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-slate-400">Foundation {i}</span>
                                    <span className="block text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full w-fit mt-1">Accepting Applications</span>
                                </div>
                            </div>
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors">Global Excellence Award {2024+i}</h4>
                        
                        <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div>
                                <span className="block text-xs text-slate-500 uppercase tracking-wide">Amount</span>
                                <span className="block font-bold text-slate-800 text-lg">$5,000</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-xs text-slate-500 uppercase tracking-wide">Deadline</span>
                                <span className="block font-bold text-slate-800 text-lg">May 15</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Scholarships;
