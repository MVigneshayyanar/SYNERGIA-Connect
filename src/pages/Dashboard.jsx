import {
    Student,
    Heartbeat,
    Bus,
    House,
    TrendUp,
    WarningCircle,
    CheckCircle,
    UserCircle,
    Briefcase,
    Bell,
    Clock
} from "@phosphor-icons/react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { userProfile, notifications, userStats } = useAuth();

    // Default values if no user profile is loaded yet
    const userData = userProfile || {
        name: "Guest",
        profession: "Unknown",
        verificationStatus: "unverified"
    };

    // Use real-time stats or defaults
    const stats = userStats || {
        education: { enrolled: false, course: "None" },
        healthcare: { active: false, nextCheckup: null },
        transport: { valid: false, expiryDate: null },
        housing: { eligible: false, status: "Not Applied" }
    };

    const statCards = [
        {
            title: "Education Status",
            value: stats.education?.enrolled ? "Enrolled" : "Not Enrolled",
            subtext: stats.education?.course || "No active course",
            icon: Student,
            color: "bg-blue-500",
            lightColor: "bg-blue-500/10",
            textColor: "text-blue-600",
        },
        {
            title: "Healthcare",
            value: stats.healthcare?.active ? "Active" : "Pending",
            subtext: stats.healthcare?.nextCheckup
                ? `Next checkup: ${new Date(stats.healthcare.nextCheckup).toLocaleDateString()}`
                : "Schedule a checkup",
            icon: Heartbeat,
            color: "bg-rose-500",
            lightColor: "bg-rose-500/10",
            textColor: "text-rose-600",
        },
        {
            title: "Transport Pass",
            value: stats.transport?.valid ? "Valid" : "Expired",
            subtext: stats.transport?.expiryDate
                ? `Expires: ${new Date(stats.transport.expiryDate).toLocaleDateString()}`
                : "No active pass",
            icon: Bus,
            color: "bg-amber-500",
            lightColor: "bg-amber-500/10",
            textColor: "text-amber-600",
        },
        {
            title: "Housing Support",
            value: stats.housing?.eligible ? "Eligible" : "In Review",
            subtext: stats.housing?.status || "Check eligibility",
            icon: House,
            color: "bg-emerald-500",
            lightColor: "bg-emerald-500/10",
            textColor: "text-emerald-600",
        },
    ];

    // Format notification time
    const formatTime = (timestamp) => {
        if (!timestamp) return "Just now";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000 / 60); // minutes
        if (diff < 1) return "Just now";
        if (diff < 60) return `${diff} min ago`;
        if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                    {userData.photoUrl && (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white shadow-md shrink-0">
                            <img src={userData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">Welcome, {userData.name}</h1>
                        <div className="flex flex-wrap items-center gap-2 text-slate-500 mt-1 text-sm">
                            <Briefcase size={16} />
                            <span>{userData.profession}</span>
                            <span className="hidden sm:inline mx-1">•</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${userData.verificationStatus === 'verified' ? 'bg-green-100 text-green-700' :
                                userData.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                {userData.verificationStatus}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-left sm:text-right">
                    <p className="text-sm text-slate-400 font-medium">Last synced</p>
                    <p className="text-slate-600 font-bold">Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
                    >
                        <div className="flex items-start justify-between mb-3 md:mb-4">
                            <div
                                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${stat.lightColor} ${stat.textColor} transition-transform group-hover:scale-110`}
                            >
                                <stat.icon size={22} weight="fill" />
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stat.lightColor} ${stat.textColor}`}>
                                Live <span className="inline-block w-2 h-2 bg-current rounded-full ml-1 animate-pulse"></span>
                            </span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.title}</h3>
                        <div className="text-xl md:text-2xl font-bold text-slate-800 mb-1">{stat.value}</div>
                        <p className="text-xs text-slate-400 truncate">{stat.subtext}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity / Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6">
                        <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-4">Recommended Services</h2>
                        <div className="space-y-3 md:space-y-4">
                            <div className="p-3 md:p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3 md:mr-4 shrink-0">
                                        <Student size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800 text-sm md:text-base">Vocational Training Program</h3>
                                        <p className="text-xs md:text-sm text-slate-500">Free certification for eligible {userData.profession}s.</p>
                                    </div>
                                </div>
                                <button className="w-full sm:w-auto px-4 py-2 bg-white text-slate-700 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50">Apply Now</button>
                            </div>

                            <div className="p-3 md:p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3 md:mr-4 shrink-0">
                                        <Heartbeat size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800 text-sm md:text-base">Annual Health Checkup</h3>
                                        <p className="text-xs md:text-sm text-slate-500">Schedule your free preventive screening.</p>
                                    </div>
                                </div>
                                <button className="w-full sm:w-auto px-4 py-2 bg-white text-slate-700 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50">View Details</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Notifications */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-800">Notifications</h2>
                            <Bell size={20} className="text-slate-400" />
                        </div>
                        <div className="space-y-4">
                            {notifications.length > 0 ? (
                                notifications.slice(0, 5).map((notif) => (
                                    <div key={notif.id} className="flex gap-3">
                                        <div className={`mt-1 ${notif.type === 'success' ? 'text-emerald-500' : notif.type === 'warning' ? 'text-amber-500' : 'text-blue-500'}`}>
                                            {notif.type === 'success' ? <CheckCircle size={20} weight="fill" /> :
                                                notif.type === 'warning' ? <WarningCircle size={20} weight="fill" /> :
                                                    <Bell size={20} weight="fill" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-slate-800 truncate">{notif.title}</h4>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{notif.message}</p>
                                            <span className="text-[10px] text-slate-400 mt-1 block font-medium uppercase flex items-center gap-1">
                                                <Clock size={10} /> {formatTime(notif.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-slate-400">
                                    <Bell size={32} className="mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No notifications yet</p>
                                </div>
                            )}
                        </div>
                        {notifications.length > 0 && (
                            <button className="w-full mt-4 md:mt-6 py-2 text-sm text-teal-600 font-medium hover:bg-teal-50 rounded-lg transition-colors">
                                View All Notifications
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

