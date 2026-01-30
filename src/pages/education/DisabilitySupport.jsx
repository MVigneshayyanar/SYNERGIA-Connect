import { Wheelchair, Ear, Eye, HandWaving } from "@phosphor-icons/react";

const DisabilitySupport = () => {
    const features = [
        { title: "Screen Reader", icon: Ear, desc: "Serialized content for audio playback.", color: "text-indigo-600", bg: "bg-indigo-50" },
        { title: "High Contrast", icon: Eye, desc: "Enhanced visibility for visual impairments.", color: "text-pink-600", bg: "bg-pink-50" },
        { title: "Keyboard Nav", icon: Wheelchair, desc: "Full keyboard interactivity support.", color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Sign Language", icon: HandWaving, desc: "Video overlays with sign language.", color: "text-orange-600", bg: "bg-orange-50" },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-4xl font-bold mb-4">Inclusive Learning</h2>
                    <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
                        Education limited by nothing. Experience a platform that adapts to your unique needs, ensuring everyone has equal access to knowledge.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-sm">
                            Enable Accessibility Tools
                        </button>
                        <button className="bg-indigo-500/30 backdrop-blur-md text-white border border-indigo-400/30 px-6 py-3 rounded-xl font-medium hover:bg-indigo-500/40 transition-colors">
                            Configure Settings
                        </button>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl -ml-16 -mb-16"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 hover:shadow-xl transition-all group hover:-translate-y-1">
                        <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <item.icon size={32} weight="duotone" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DisabilitySupport;
