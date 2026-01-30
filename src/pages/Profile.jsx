import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Briefcase, Calendar, CheckCircle, WarningCircle, Envelope, Phone } from '@phosphor-icons/react';

const Profile = () => {
    const { userProfile, logout } = useAuth();

    if (!userProfile) {
        return <div className="p-8">Loading profile...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
                <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                >
                    Sign Out
                </button>
            </div>

            {/* Profile Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 shadow-inner">
                        <img src={userProfile.photoUrl || "https://via.placeholder.com/150"} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className={`absolute bottom-2 right-2 p-1.5 rounded-full border-2 border-white ${userProfile.verificationStatus === 'verified' ? 'bg-green-500' : 'bg-amber-500'
                        }`}>
                        {userProfile.verificationStatus === 'verified' ?
                            <CheckCircle size={16} className="text-white" weight="bold" /> :
                            <WarningCircle size={16} className="text-white" weight="bold" />
                        }
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-slate-900">{userProfile.name}</h2>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 mt-2 font-medium">
                        <Briefcase size={18} weight="duotone" />
                        <span>{userProfile.profession}</span>
                        <span>•</span>
                        <span>{userProfile.experience} Years Exp.</span>
                    </div>

                    <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${userProfile.verificationStatus === 'verified'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                            {userProfile.verificationStatus === 'verified' ? 'Verified Professional' : 'Verification Pending'}
                        </span>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            ID: {userProfile.uid?.slice(0, 8).toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <User size={20} className="text-teal-500" />
                        Personal Information
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between py-2 border-b border-slate-50">
                            <span className="text-slate-500">Date of Birth</span>
                            <span className="font-medium text-slate-900">{userProfile.dob}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-50">
                            <span className="text-slate-500">Gender</span>
                            <span className="font-medium text-slate-900 capitalize">{userProfile.gender}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-50">
                            <span className="text-slate-500">Age</span>
                            <span className="font-medium text-slate-900">{userProfile.age}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Envelope size={20} className="text-purple-500" />
                        Contact Details
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between py-2 border-b border-slate-50">
                            <span className="text-slate-500 flex items-center gap-2"><Envelope size={16} /> Email</span>
                            <span className="font-medium text-slate-900">{userProfile.email}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-50">
                            <span className="text-slate-500 flex items-center gap-2"><Phone size={16} /> Phone</span>
                            <span className="font-medium text-slate-900">{userProfile.phone}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Documents Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Verification Documents</h3>
                <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200 text-slate-500">
                            <FileText size={20} weight="duotone" />
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">Professional Certificate</p>
                            <p className="text-xs text-slate-500">Uploaded on {new Date(userProfile.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <a
                        href={userProfile.professionDocUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline"
                    >
                        View Document
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Profile;
