import React, { useState, useEffect } from 'react';
import { MapPin, Crosshair, X, MagnifyingGlass, Warning, CheckCircle } from '@phosphor-icons/react';

const LocationModal = ({ isOpen, onClose, onLocationSet }) => {
    const [location, setLocation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    // Popular cities for quick selection
    const popularCities = [
        'Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad',
        'Pune', 'Kolkata', 'Ahmedabad', 'Coimbatore', 'Madurai'
    ];

    // Handle geolocation
    const handleGetCurrentLocation = () => {
        setIsLoading(true);
        setError('');

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    // Reverse geocoding using OpenStreetMap Nominatim API
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();

                    // Extract city/town from address
                    const city = data.address?.city ||
                        data.address?.town ||
                        data.address?.village ||
                        data.address?.suburb ||
                        data.address?.county ||
                        'Unknown Location';

                    setLocation(city);
                    setIsLoading(false);
                } catch (err) {
                    setError('Failed to get location details. Please enter manually.');
                    setIsLoading(false);
                }
            },
            (err) => {
                setError('Unable to retrieve your location. Please enter manually.');
                setIsLoading(false);
            },
            { timeout: 10000 }
        );
    };

    // Handle location submission
    const handleSubmit = () => {
        if (location.trim()) {
            // Save to localStorage
            localStorage.setItem('userLocation', location.trim());
            onLocationSet(location.trim());
            onClose();
        }
    };

    // Handle city quick select
    const handleCitySelect = (city) => {
        setLocation(city);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#FF6347] to-[#FF8C69] p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <MapPin size={28} weight="fill" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Set Your Location</h2>
                                <p className="text-white/80 text-sm">Find services near you</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Current Location Button */}
                    <button
                        onClick={handleGetCurrentLocation}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl text-blue-600 font-semibold transition-all mb-4 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                <span>Detecting location...</span>
                            </>
                        ) : (
                            <>
                                <Crosshair size={22} weight="bold" />
                                <span>Use Current Location</span>
                            </>
                        )}
                    </button>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-4">
                            <Warning size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1 h-px bg-slate-200"></div>
                        <span className="text-slate-400 text-sm">or enter manually</span>
                        <div className="flex-1 h-px bg-slate-200"></div>
                    </div>

                    {/* Search Input */}
                    <div className="relative mb-4">
                        <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter your city or area..."
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF6347]/20 focus:border-[#FF6347] transition-all outline-none text-lg"
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        />
                    </div>

                    {/* Popular Cities */}
                    <div className="mb-6">
                        <p className="text-slate-500 text-sm mb-3 font-medium">Popular Cities</p>
                        <div className="flex flex-wrap gap-2">
                            {popularCities.map((city) => (
                                <button
                                    key={city}
                                    onClick={() => handleCitySelect(city)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${location === city
                                            ? 'bg-[#FF6347] text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!location.trim()}
                        className="w-full py-4 bg-[#FF6347] hover:bg-[#E55A3C] text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={22} weight="bold" />
                        <span>Continue with {location || 'this location'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LocationModal;
