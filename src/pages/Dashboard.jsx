import {
    Student,
    Heartbeat,
    Bus,
    House,
    TrendUp,
    WarningCircle,
    CheckCircle,
    UserCircle,
    Briefcase
} from "@phosphor-icons/react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { userProfile } = useAuth();

    // Default values if no user profile is loaded yet
    const userData = userProfile || {
        name: "Guest",
        profession: "Unknown",
        verificationStatus: "unverified",
        roles: {}
    };

    const stats = [
        {
            title: "Education Status",
            value: userData.roles?.education ? "Enrolled" : "Not Enrolled",
            subtext: "Advanced React Course",
            icon: Student,
            color: "bg-blue-500",
            lightColor: "bg-blue-500/10",
            textColor: "text-blue-600",
        },
        {
            title: "Healthcare",
            value: userData.roles?.healthcare ? "Active" : "Pending",
            subtext: "Next checkup in 14 days",
            icon: Heartbeat,
            color: "bg-rose-500",
            lightColor: "bg-rose-500/10",
            textColor: "text-rose-600",
        },
        {
            title: "Transport Pass",
            value: userData.roles?.transport ? "Valid" : "Expired",
            subtext: "Expires: Dec 2026",
            icon: Bus,
            color: "bg-amber-500",
            lightColor: "bg-amber-500/10",
            textColor: "text-amber-600",
        },
        {
            title: "Housing Support",
            value: userData.roles?.housing ? "Eligible" : "In Review",
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
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {userData.photoUrl && (
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                            <img src={userData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Welcome, {userData.name}</h1>
                        <div className="flex items-center gap-2 text-slate-500 mt-1">
                            <Briefcase size={16} />
                            <span>{userData.profession}</span>
                            <span className="mx-1">•</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${userData.verificationStatus === 'verified' ? 'bg-green-100 text-green-700' :
                                    userData.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-gray-100 text-gray-700'
                                }`}>
                                {userData.verificationStatus}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-sm text-slate-400 font-medium">Last synced</p>
                    <p className="text-slate-600 font-bold">Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
                                        <p className="text-sm text-slate-500">Free certification for eligible {userData.profession}s.</p>
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
