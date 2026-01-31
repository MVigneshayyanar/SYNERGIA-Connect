import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Briefcase, CheckCircle, WarningCircle, Envelope, Phone, FileText, House, Plus, MapPin, Bed, Eye } from '@phosphor-icons/react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Profile = () => {
    const { userProfile, logout, currentUser } = useAuth();
    const [myProperties, setMyProperties] = useState([]);
    const [loadingProperties, setLoadingProperties] = useState(true);

    useEffect(() => {
        const fetchMyProperties = async () => {
            if (!currentUser) {
                setLoadingProperties(false);
                return;
            }

            try {
                const q = query(
                    collection(db, 'properties'),
                    where('ownerId', '==', currentUser.uid)
                );
                const querySnapshot = await getDocs(q);
                const properties = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setMyProperties(properties);
            } catch (error) {
                console.error('Error fetching properties:', error);
                // Don't crash the page, just show empty properties
                setMyProperties([]);
            } finally {
                setLoadingProperties(false);
            }
        };

        fetchMyProperties();
    }, [currentUser]);

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
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-100 flex items-center justify-center">
                        {userProfile.photoUrl ? (
                            <img src={userProfile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={48} className="text-slate-400" />
                        )}
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
                    <h2 className="text-2xl font-bold text-slate-900">{userProfile.name || 'User'}</h2>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 mt-2 font-medium">
                        <Briefcase size={18} weight="duotone" />
                        <span>{userProfile.profession || 'Not specified'}</span>
                        {userProfile.experience && (
                            <>
                                <span>•</span>
                                <span>{userProfile.experience} Years Exp.</span>
                            </>
                        )}
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

            {/* My Properties Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <House size={20} className="text-[#FF6347]" weight="duotone" />
                        My Properties
                    </h3>
                    <Link
                        to="/post-property"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF6347] text-white text-sm font-semibold rounded-lg hover:bg-[#E55A3C] transition-colors"
                    >
                        <Plus size={16} weight="bold" />
                        Post Property
                    </Link>
                </div>

                {loadingProperties ? (
                    <div className="text-center py-8 text-slate-500">Loading properties...</div>
                ) : myProperties.length === 0 ? (
                    <div className="text-center py-8">
                        <House size={48} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-500">You haven't posted any properties yet.</p>
                        <Link
                            to="/post-property"
                            className="inline-flex items-center gap-2 mt-4 px-4 py-2 text-[#FF6347] font-medium hover:underline"
                        >
                            <Plus size={16} />
                            Post your first property
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {myProperties.map((property) => (
                            <div key={property.id} className="flex flex-col md:flex-row items-start gap-4 p-4 bg-slate-50 rounded-xl">
                                <div className="w-full md:w-24 h-20 bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
                                    {property.images && property.images[0] ? (
                                        <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <House size={24} className="text-slate-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900">{property.title}</h4>
                                    <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
                                        <MapPin size={14} />
                                        <span>{property.location}</span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                                        <span className="flex items-center gap-1">
                                            <Bed size={14} />
                                            {property.bedrooms} BHK
                                        </span>
                                        <span className="font-bold text-[#FF6347]">
                                            ₹{property.price?.toLocaleString()}/{property.period || 'month'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${property.status === 'active'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-slate-200 text-slate-600'
                                        }`}>
                                        {property.status === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <Eye size={12} />
                                        {property.views || 0} views
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
                            <span className="font-medium text-slate-900">{userProfile.dob || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-50">
                            <span className="text-slate-500">Gender</span>
                            <span className="font-medium text-slate-900 capitalize">{userProfile.gender || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-50">
                            <span className="text-slate-500">Age</span>
                            <span className="font-medium text-slate-900">{userProfile.age || 'Not provided'}</span>
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
                            <span className="font-medium text-slate-900">{userProfile.phone || 'Not provided'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Documents Section - Only show if document exists */}
            {userProfile.professionDocUrl && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Verification Documents</h3>
                    <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200 text-slate-500">
                                <FileText size={20} weight="duotone" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">Professional Certificate</p>
                                <p className="text-xs text-slate-500">Uploaded on {userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Unknown'}</p>
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
            )}
        </div>
    );
};

export default Profile;
