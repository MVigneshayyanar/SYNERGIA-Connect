import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Briefcase, CheckCircle, WarningCircle, Envelope, Phone, FileText, House, Plus, MapPin, Bed, Eye } from '@phosphor-icons/react';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

const Profile = () => {
    const { userProfile, logout, currentUser } = useAuth();
    const [myProperties, setMyProperties] = useState([]);
    const [loadingProperties, setLoadingProperties] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (userProfile && !isEditing) {
            setEditFormData({
                name: userProfile.name || '',
                profession: userProfile.profession || '',
                experience: userProfile.experience || '',
                dob: userProfile.dob || '',
                gender: userProfile.gender || '',
                phone: userProfile.phone || '',
                age: userProfile.age || ''
            });
        }
    }, [userProfile, isEditing]);

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
                setMyProperties([]);
            } finally {
                setLoadingProperties(false);
            }
        };

        fetchMyProperties();
    }, [currentUser]);

    const handleEditClick = () => {
        setEditFormData({
            name: userProfile.name || '',
            profession: userProfile.profession || '',
            experience: userProfile.experience || '',
            dob: userProfile.dob || '',
            gender: userProfile.gender || '',
            phone: userProfile.phone || '',
            age: userProfile.age || ''
        });
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveClick = async () => {
        if (!currentUser) return;
        setSaving(true);
        try {
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, editFormData);
            
            // We assume the context/auth provider will listen to real-time updates 
            // and auto-update 'userProfile'. If not, we might need to manually trigger a refresh.
            // For now, let's flip off editing mode.
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (!userProfile) {
        return <div className="p-8">Loading profile...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSaveClick}
                                disabled={saving}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                onClick={handleCancelClick}
                                disabled={saving}
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleEditClick}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                        >
                            Edit Profile
                        </button>
                    )}
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                    >
                        Sign Out
                    </button>
                </div>
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

                <div className="flex-1 text-center md:text-left w-full">
                    {isEditing ? (
                        <div className="space-y-3 max-w-md mx-auto md:mx-0">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editFormData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg text-slate-900"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Profession</label>
                                    <input
                                        type="text"
                                        name="profession"
                                        value={editFormData.profession}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        placeholder="e.g. Student"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Experience (Yrs)</label>
                                    <input
                                        type="number"
                                        name="experience"
                                        value={editFormData.experience}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        placeholder="e.g. 2"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
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
                        </>
                    )}

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
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-slate-500">Date of Birth</span>
                            {isEditing ? (
                                <input
                                    type="date"
                                    name="dob"
                                    value={editFormData.dob}
                                    onChange={handleInputChange}
                                    className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm w-48 text-right"
                                />
                            ) : (
                                <span className="font-medium text-slate-900">{userProfile.dob || 'Not provided'}</span>
                            )}
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-slate-500">Gender</span>
                            {isEditing ? (
                                <select
                                    name="gender"
                                    value={editFormData.gender}
                                    onChange={handleInputChange}
                                    className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm w-32"
                                >
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            ) : (
                                <span className="font-medium text-slate-900 capitalize">{userProfile.gender || 'Not provided'}</span>
                            )}
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-slate-500">Age</span>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="age"
                                    value={editFormData.age}
                                    onChange={handleInputChange}
                                    className="w-24 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm text-right"
                                />
                            ) : (
                                <span className="font-medium text-slate-900">{userProfile.age || 'Not provided'}</span>
                            )}
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
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-slate-500 flex items-center gap-2"><Phone size={16} /> Phone</span>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="phone"
                                    value={editFormData.phone}
                                    onChange={handleInputChange}
                                    className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm w-48 text-right"
                                    placeholder="+91..."
                                />
                            ) : (
                                <span className="font-medium text-slate-900">{userProfile.phone || 'Not provided'}</span>
                            )}
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
