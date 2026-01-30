import { Trophy, Lightning, ChartLineUp, Medal } from "@phosphor-icons/react";

const SkillDevelopment = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                     <h2 className="text-2xl font-bold text-slate-800">Skill Development</h2>
                     <p className="text-slate-500">Track and improve your professional capabilities.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center shrink-0">
                         <Lightning size={32} weight="fill" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-slate-800">14</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Skills Acquired</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                         <Trophy size={32} weight="fill" />
                    </div>
                    <div>
                         <h3 className="text-3xl font-bold text-slate-800">5</h3>
                         <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Certifications</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center shrink-0">
                         <ChartLineUp size={32} weight="fill" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-slate-800">Top 10%</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Class Rank</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity / Paths */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                    <h3 className="font-bold text-xl text-slate-800 mb-6">Recommended Paths</h3>
                    <div className="space-y-4">
                        {['Public Speaking', 'Financial Literacy', 'Critical Thinking', 'Python Programming'].map((skill, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/50 transition-all cursor-pointer group">
                                 <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-colors">
                                        <Medal size={20} weight="duotone"/>
                                    </div>
                                    <span className="font-bold text-slate-700 group-hover:text-teal-900">{skill}</span>
                                 </div>
                                 <button className="text-sm bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-lg font-bold group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600 transition-all">Start</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gamification / Chart placeholder */}
                <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <h3 className="font-bold text-xl mb-2">Level Up!</h3>
                        <p className="text-slate-400">Complete 2 more modules to reach Standard II.</p>
                        <div className="w-full bg-slate-700/50 rounded-full h-3 mt-6 mb-2">
                             <div className="w-3/4 bg-gradient-to-r from-teal-400 to-blue-500 h-full rounded-full shadow-[0_0_15px_rgba(45,212,191,0.5)]"></div>
                        </div>
                        <div className="flex justify-between text-xs font-mono text-slate-400">
                             <span>1,240 XP</span>
                             <span>2,000 XP</span>
                        </div>
                    </div>
                    {/* Abstract bg */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px]"></div>
                </div>
            </div>
        </div>
    );
};

export default SkillDevelopment;
