import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bathtub, Ruler, House, CheckCircle } from '@phosphor-icons/react';
import BackButton from '../../components/BackButton';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const PostProperty = () => {
    const navigate = useNavigate();
    const { currentUser, userProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'apartment',
        price: '',
        period: 'month',
        location: '',
        address: '',
        bedrooms: '1',
        bathrooms: '1',
        area: '',
        amenities: [],
        images: []
    });

    const propertyTypes = [
        { value: 'apartment', label: 'Apartment' },
        { value: 'villa', label: 'Villa' },
        { value: 'studio', label: 'Studio' },
        { value: 'house', label: 'House' },
        { value: 'pg', label: 'PG/Hostel' }
    ];

    const amenityOptions = [
        'Parking', 'Gym', 'Swimming Pool', 'Garden', 'Security',
        'Power Backup', 'Lift', 'WiFi', 'AC', 'Furnished'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleAmenity = (amenity) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.price || !formData.location) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Create property document in Firestore
            const propertyData = {
                ...formData,
                price: parseInt(formData.price),
                bedrooms: parseInt(formData.bedrooms),
                bathrooms: parseInt(formData.bathrooms),
                area: parseInt(formData.area) || 0,
                ownerId: currentUser.uid,
                ownerName: userProfile?.name || 'Property Owner',
                ownerEmail: currentUser.email,
                status: 'active',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                views: 0,
                inquiries: 0
            };

            await addDoc(collection(db, 'properties'), propertyData);

            setSuccess(true);
            setTimeout(() => {
                navigate('/marketplace');
            }, 2000);
        } catch (err) {
            console.error('Error posting property:', err);
            setError('Failed to post property. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <div className="bg-white rounded-2xl p-8 text-center max-w-md shadow-lg">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-green-600" weight="bold" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Property Posted!</h2>
                    <p className="text-slate-500">Your property listing has been submitted successfully.</p>
                    <p className="text-sm text-slate-400 mt-2">Redirecting to marketplace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <BackButton to="/marketplace" label="Marketplace" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Post Your Property</h1>
                <p className="text-slate-500 mt-1">List your property for rent or sale</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                        {error}
                    </div>
                )}

                {/* Basic Info */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <House size={24} className="text-blue-600" weight="duotone" />
                        Basic Information
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Property Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Modern 3BHK Apartment in Koramangala"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Describe your property..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Property Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                >
                                    {propertyTypes.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Rent/Price *
                                </label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-4 text-slate-500 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl">₹</span>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="45000"
                                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                        required
                                    />
                                    <select
                                        name="period"
                                        value={formData.period}
                                        onChange={handleChange}
                                        className="px-3 bg-slate-50 border border-l-0 border-slate-200 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                    >
                                        <option value="month">/month</option>
                                        <option value="year">/year</option>
                                        <option value="sale">Sale</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <MapPin size={24} className="text-blue-600" weight="duotone" />
                        Location
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Area/Locality *
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g., Koramangala, Bangalore"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Full Address
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="2"
                                placeholder="Enter complete address"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Property Details */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Property Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                                <Bed size={16} /> Bedrooms
                            </label>
                            <select
                                name="bedrooms"
                                value={formData.bedrooms}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            >
                                {[1, 2, 3, 4, 5, '6+'].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                                <Bathtub size={16} /> Bathrooms
                            </label>
                            <select
                                name="bathrooms"
                                value={formData.bathrooms}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            >
                                {[1, 2, 3, 4, '5+'].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                                <Ruler size={16} /> Area (sq ft)
                            </label>
                            <input
                                type="number"
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                                placeholder="e.g., 1200"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Amenities */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Amenities</h2>
                    <div className="flex flex-wrap gap-2">
                        {amenityOptions.map(amenity => (
                            <button
                                key={amenity}
                                type="button"
                                onClick={() => toggleAmenity(amenity)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.amenities.includes(amenity)
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {amenity}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                    >
                        {loading ? 'Posting...' : 'Post Property'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostProperty;
