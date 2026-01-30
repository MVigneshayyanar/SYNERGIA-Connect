import {
    Student,
    Heartbeat,
    Bus,
    House,
    TrendUp,
    WarningCircle,
    CheckCircle,
} from "@phosphor-icons/react";

const Dashboard = () => {
    const stats = [
        {
            title: "Education Status",
            value: "Enrolled",
            subtext: "Advanced React Course",
            icon: Student,
            color: "bg-blue-500",
            lightColor: "bg-blue-500/10",
            textColor: "text-blue-600",
        },
        {
            title: "Healthcare",
            value: "Active",
            subtext: "Next checkup in 14 days",
            icon: Heartbeat,
            color: "bg-rose-500",
            lightColor: "bg-rose-500/10",
            textColor: "text-rose-600",
        },
        {
            title: "Transport Pass",
            value: "Valid",
            subtext: "Expires: Dec 2026",
            icon: Bus,
            color: "bg-amber-500",
            lightColor: "bg-amber-500/10",
            textColor: "text-amber-600",
        },
        {
            title: "Housing Support",
            value: "Eligible",
            subtext: "Application in review",
            icon: House,
            color: "bg-emerald-500",
            lightColor: "bg-emerald-500/10",
            textColor: "text-emerald-600",
        },
    ];

    const notifications = [
        {
            id: 1,
            title: "Housing Application Update",
            desc: "Your document verification is complete. Next step: Interview.",
            time: "2 hours ago",
            icon: CheckCircle,
            iconColor: "text-emerald-500",
        },
        {
            id: 2,
            title: "Transport Schedule Change",
            desc: "Bus Route 42 will have a delay of 10 mins today due to maintenance.",
            time: "5 hours ago",
            icon: WarningCircle,
            iconColor: "text-amber-500",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Overview</h1>
                    <p className="text-slate-500 mt-1">
                        Summary of your accessed services and current status.
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-slate-400 font-medium">Last synced</p>
                    <p className="text-slate-600 font-bold">Today, 7:00 PM</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.lightColor} ${stat.textColor} transition-transform group-hover:scale-110`}
                            >
                                <stat.icon size={24} weight="fill" />
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stat.lightColor} ${stat.textColor}`}>
                                +2.4% <TrendUp size={12} className="inline ml-1" />
                            </span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.title}</h3>
                        <div className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</div>
                        <p className="text-xs text-slate-400">{stat.subtext}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity / Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Recommended Services</h2>
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition-colors cursor-pointer flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
                                        <Student size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">Vocational Training Program</h3>
                                        <p className="text-sm text-slate-500">Free certification for eligible candidates.</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-white text-slate-700 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50">Apply Now</button>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition-colors cursor-pointer flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mr-4">
                                        <Heartbeat size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">Annual Health Checkup</h3>
                                        <p className="text-sm text-slate-500">Schedule your free preventive screening.</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-white text-slate-700 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50">View Details</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Notifications */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Notifications</h2>
                        <div className="space-y-4">
                            {notifications.map((notif) => (
                                <div key={notif.id} className="flex gap-3">
                                    <div className={`mt-1 ${notif.iconColor}`}>
                                        <notif.icon size={20} weight="fill" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-800">{notif.title}</h4>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notif.desc}</p>
                                        <span className="text-[10px] text-slate-400 mt-1 block font-medium uppercase">{notif.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2 text-sm text-teal-600 font-medium hover:bg-teal-50 rounded-lg transition-colors">
                            View All Notifications
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
