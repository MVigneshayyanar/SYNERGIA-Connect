import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlass, Star, MapPin, Clock, CheckCircle, Phone, WhatsappLogo, MapPinLine, Spinner, Warning, Globe, SquaresFour, List, Funnel } from '@phosphor-icons/react';
import BackButton from '../../components/BackButton';
import LocationModal from '../../components/LocationModal';
import { loadGoogleMaps } from '../../utils/googleMaps';

const ServiceBrowse = () => {
    const [selectedCategory, setSelectedCategory] = useState('plumber');
    const [searchQuery, setSearchQuery] = useState('');
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [userLocation, setUserLocation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [services, setServices] = useState([]);
    const [error, setError] = useState('');
    const [mapsLoaded, setMapsLoaded] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const mapRef = useRef(null);
    const mapElementRef = useRef(null);
    const placesServiceRef = useRef(null);

    // Service categories
    const categories = [
        { name: 'All', icon: '🏠', searchTerm: 'all' },
        { name: 'Plumbing', icon: '🔧', searchTerm: 'plumber' },
        { name: 'Electrical', icon: '⚡', searchTerm: 'electrician' },
        { name: 'Cleaning', icon: '🧹', searchTerm: 'house cleaning service' },
        { name: 'Painting', icon: '🎨', searchTerm: 'painter' },
        { name: 'Carpentry', icon: '🪚', searchTerm: 'carpenter' },
        { name: 'AC Repair', icon: '❄️', searchTerm: 'AC repair service' },
        { name: 'Pest Control', icon: '🐜', searchTerm: 'pest control' },
        { name: 'Appliance', icon: '🔌', searchTerm: 'appliance repair' },
        { name: 'Movers', icon: '📦', searchTerm: 'packers and movers' },
    ];

    // Get all service search terms (excluding 'all')
    const allServiceTerms = categories.filter(c => c.searchTerm !== 'all').map(c => c.searchTerm);

    // Initialize Google Maps
    useEffect(() => {
        const initMaps = async () => {
            const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
            if (!apiKey) {
                setError('Google Maps API key not found');
                return;
            }

            try {
                const googleMaps = await loadGoogleMaps(apiKey);

                if (mapElementRef.current && !mapRef.current) {
                    mapRef.current = new googleMaps.Map(mapElementRef.current, {
                        center: { lat: 13.0827, lng: 80.2707 },
                        zoom: 12
                    });
                    placesServiceRef.current = new googleMaps.places.PlacesService(mapRef.current);
                    setMapsLoaded(true);
                }
            } catch (err) {
                console.error('Failed to load Google Maps:', err);
                setError('Failed to load Google Maps');
            }
        };

        initMaps();
    }, []);

    // Check for saved location
    useEffect(() => {
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) {
            setUserLocation(savedLocation);
        } else {
            setShowLocationModal(true);
        }
    }, []);

    // Fetch services when location changes and maps is loaded
    useEffect(() => {
        if (userLocation && mapsLoaded) {
            fetchServices(userLocation, selectedCategory);
        }
    }, [userLocation, mapsLoaded]);

    // Fetch services using Google Places API
    const fetchServices = async (city, serviceType) => {
        if (!placesServiceRef.current) {
            setError('Google Places not initialized. Please refresh.');
            return;
        }

        setIsLoading(true);
        setError('');
        setServices([]);

        // If "all" is selected, fetch from all categories
        if (serviceType === 'all') {
            await fetchAllServices(city);
            return;
        }

        const query = `${serviceType} in ${city}`;

        try {
            placesServiceRef.current.textSearch(
                { query: query },
                async (results, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                        const detailedServices = [];

                        for (let i = 0; i < Math.min(results.length, 12); i++) {
                            const place = results[i];

                            try {
                                const details = await getPlaceDetails(place.place_id);
                                detailedServices.push({
                                    id: place.place_id,
                                    name: details.name || place.name,
                                    rating: details.rating || place.rating || 0,
                                    reviews: details.user_ratings_total || place.user_ratings_total || 0,
                                    phone: details.formatted_phone_number || details.international_phone_number || '',
                                    address: details.formatted_address || place.formatted_address || city,
                                    verified: (details.rating || 0) >= 4.0,
                                    timing: details.opening_hours?.isOpen?.() ? 'Open Now' : (details.opening_hours ? 'Closed' : 'Hours N/A'),
                                    website: details.website || '',
                                    placeId: place.place_id,
                                    category: serviceType
                                });
                            } catch (err) {
                                detailedServices.push({
                                    id: place.place_id,
                                    name: place.name,
                                    rating: place.rating || 0,
                                    reviews: place.user_ratings_total || 0,
                                    phone: '',
                                    address: place.formatted_address || city,
                                    verified: (place.rating || 0) >= 4.0,
                                    timing: 'Hours N/A',
                                    placeId: place.place_id,
                                    category: serviceType
                                });
                            }
                        }

                        setServices(detailedServices);
                        setIsLoading(false);
                    } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                        setError(`No ${serviceType} services found in ${city}`);
                        setIsLoading(false);
                    } else {
                        setError('Failed to search for services. Please try again.');
                        setIsLoading(false);
                    }
                }
            );
        } catch (err) {
            console.error('Search error:', err);
            setError('Search failed. Please try again.');
            setIsLoading(false);
        }
    };

    // Fetch services from all categories
    const fetchAllServices = async (city) => {
        const allResults = [];
        const seenIds = new Set();

        const searchCategory = (searchTerm) => {
            return new Promise((resolve) => {
                const query = `${searchTerm} in ${city}`;
                placesServiceRef.current.textSearch(
                    { query: query },
                    async (results, status) => {
                        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                            const categoryResults = [];
                            // Get top 3 from each category to balance results
                            for (let i = 0; i < Math.min(results.length, 3); i++) {
                                const place = results[i];
                                if (seenIds.has(place.place_id)) continue;
                                seenIds.add(place.place_id);

                                try {
                                    const details = await getPlaceDetails(place.place_id);
                                    categoryResults.push({
                                        id: place.place_id,
                                        name: details.name || place.name,
                                        rating: details.rating || place.rating || 0,
                                        reviews: details.user_ratings_total || place.user_ratings_total || 0,
                                        phone: details.formatted_phone_number || details.international_phone_number || '',
                                        address: details.formatted_address || place.formatted_address || city,
                                        verified: (details.rating || 0) >= 4.0,
                                        timing: details.opening_hours?.isOpen?.() ? 'Open Now' : (details.opening_hours ? 'Closed' : 'Hours N/A'),
                                        website: details.website || '',
                                        placeId: place.place_id,
                                        category: searchTerm
                                    });
                                } catch (err) {
                                    categoryResults.push({
                                        id: place.place_id,
                                        name: place.name,
                                        rating: place.rating || 0,
                                        reviews: place.user_ratings_total || 0,
                                        phone: '',
                                        address: place.formatted_address || city,
                                        verified: (place.rating || 0) >= 4.0,
                                        timing: 'Hours N/A',
                                        placeId: place.place_id,
                                        category: searchTerm
                                    });
                                }
                            }
                            resolve(categoryResults);
                        } else {
                            resolve([]);
                        }
                    }
                );
            });
        };

        try {
            // Fetch from all categories in parallel
            const categoryPromises = allServiceTerms.map(term => searchCategory(term));
            const results = await Promise.all(categoryPromises);

            results.forEach(categoryResults => {
                allResults.push(...categoryResults);
            });

            // Sort by rating
            allResults.sort((a, b) => b.rating - a.rating);

            if (allResults.length === 0) {
                setError(`No services found in ${city}`);
            } else {
                setServices(allResults);
            }
            setIsLoading(false);
        } catch (err) {
            console.error('Search error:', err);
            setError('Search failed. Please try again.');
            setIsLoading(false);
        }
    };

    const getPlaceDetails = (placeId) => {
        return new Promise((resolve, reject) => {
            placesServiceRef.current.getDetails(
                {
                    placeId: placeId,
                    fields: ['name', 'formatted_phone_number', 'international_phone_number', 'formatted_address', 'rating', 'user_ratings_total', 'opening_hours', 'website']
                },
                (result, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        resolve(result);
                    } else {
                        reject(new Error('Failed to get details'));
                    }
                }
            );
        });
    };

    const handleLocationSet = (location) => {
        setUserLocation(location);
        if (mapsLoaded) {
            fetchServices(location, selectedCategory);
        }
    };

    const handleCategoryChange = (searchTerm) => {
        setSelectedCategory(searchTerm);
        if (userLocation && mapsLoaded) {
            fetchServices(userLocation, searchTerm);
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim() && userLocation && mapsLoaded) {
            setSelectedCategory(searchQuery.trim());
            fetchServices(userLocation, searchQuery.trim());
        }
    };

    const formatPhone = (phone) => {
        if (!phone) return '';
        return phone;
    };

    const getCleanPhone = (phone) => {
        if (!phone) return '';
        return phone.replace(/[\s\-\(\)]/g, '').replace('+', '');
    };

    return (
        <div className="min-h-full">
            {/* Hidden map element */}
            <div ref={mapElementRef} style={{ display: 'none', width: '1px', height: '1px' }}></div>

            {/* Location Modal */}
            <LocationModal
                isOpen={showLocationModal}
                onClose={() => setShowLocationModal(false)}
                onLocationSet={handleLocationSet}
            />

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <BackButton to="/housing" label="Housing Hub" />
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Home Services</h1>
                        <p className="text-slate-500 mt-1">Real data from Google Places</p>
                    </div>
                    <button
                        onClick={() => setShowLocationModal(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF6347] text-white font-semibold rounded-xl hover:bg-[#E55A3C] transition-all shadow-lg shadow-[#FF6347]/20"
                    >
                        <MapPinLine size={20} weight="bold" />
                        {userLocation || 'Set Location'}
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for any service (e.g., plumber, electrician)..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF6347]/20 focus:border-[#FF6347] transition-all outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all font-medium ${showFilters
                            ? 'bg-[#FF6347] text-white border-[#FF6347]'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-[#FF6347] hover:text-[#FF6347]'
                            }`}
                    >
                        <Funnel size={18} />
                        Filters
                    </button>
                    <button
                        onClick={handleSearch}
                        disabled={!searchQuery.trim() || !userLocation || !mapsLoaded}
                        className="flex items-center gap-2 px-6 py-3 bg-[#FF6347] hover:bg-[#E55A3C] text-white font-semibold rounded-xl transition-all disabled:opacity-50"
                    >
                        <MagnifyingGlass size={18} weight="bold" />
                        Search
                    </button>
                </div>

                {/* Category Pills - Toggleable */}
                {showFilters && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                        {categories.map((category) => (
                            <button
                                key={category.name}
                                onClick={() => handleCategoryChange(category.searchTerm)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category.searchTerm
                                    ? 'bg-[#FF6347] text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                <span>{category.icon}</span>
                                <span>{category.name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-slate-600">
                    {userLocation && (
                        <>
                            <span className="font-semibold text-slate-900">{services.length}</span> services in {userLocation}
                        </>
                    )}
                </p>
                <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2.5 transition-all ${viewMode === 'grid' ? 'bg-[#FF6347] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <SquaresFour size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2.5 transition-all ${viewMode === 'list' ? 'bg-[#FF6347] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-100">
                    <Spinner size={48} className="text-[#FF6347] animate-spin mb-4" />
                    <p className="text-lg font-semibold text-slate-700">Finding service providers...</p>
                    <p className="text-sm text-slate-500 mt-1">Fetching from Google Places API</p>
                </div>
            )}

            {/* Error State */}
            {!isLoading && error && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 text-center">
                    <Warning size={48} className="text-amber-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-amber-800 mb-2">{error}</h3>
                    <p className="text-sm text-amber-600">Try selecting a different category or location</p>
                </div>
            )}

            {/* No Location State */}
            {!userLocation && !isLoading && (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                    <div className="text-6xl mb-4">📍</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Set your location</h3>
                    <p className="text-slate-500 mb-6">Please set your location to see available services</p>
                    <button
                        onClick={() => setShowLocationModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6347] hover:bg-[#E55A3C] text-white font-semibold rounded-xl transition-all"
                    >
                        <MapPinLine size={20} weight="bold" />
                        Set Location
                    </button>
                </div>
            )}

            {/* Services Grid/List */}
            {!isLoading && !error && services.length > 0 && (
                <div className={viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-4'
                }>
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className={`group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-[#FF6347]/20 transition-all duration-300 ${viewMode === 'list' ? 'flex' : ''
                                }`}
                        >
                            {/* Service Icon/Image Area */}
                            <div className={`relative bg-gradient-to-br from-[#FF6347]/10 to-[#FF8C69]/10 flex items-center justify-center ${viewMode === 'list' ? 'w-48 h-40' : 'h-32'
                                }`}>
                                <span className="text-5xl">
                                    {categories.find(c => c.searchTerm === selectedCategory)?.icon || '🔧'}
                                </span>
                                {service.verified && (
                                    <span className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                                        <CheckCircle size={12} weight="bold" />
                                        Verified
                                    </span>
                                )}
                                {service.timing === 'Open Now' && (
                                    <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm text-green-600 text-xs font-medium rounded-full">
                                        Open Now
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <div className={`p-5 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                                <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-[#FF6347] transition-colors line-clamp-1">
                                    {service.name}
                                </h3>

                                {/* Rating */}
                                {service.rating > 0 && (
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex items-center gap-1">
                                            <Star size={14} weight="fill" className="text-amber-400" />
                                            <span className="font-semibold text-slate-900">{service.rating.toFixed(1)}</span>
                                        </div>
                                        <span className="text-sm text-slate-500">({service.reviews} reviews)</span>
                                    </div>
                                )}

                                {/* Address */}
                                <div className="flex items-start gap-1.5 text-slate-500 text-sm mb-3">
                                    <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                                    <span className="line-clamp-2">{service.address}</span>
                                </div>

                                {/* Phone */}
                                {service.phone && (
                                    <div className="flex items-center gap-2 text-[#FF6347] font-semibold mb-4">
                                        <Phone size={16} weight="fill" />
                                        <span>{formatPhone(service.phone)}</span>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2">
                                    {service.phone ? (
                                        <>
                                            <a
                                                href={`tel:${service.phone}`}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#FF6347] hover:bg-[#E55A3C] text-white text-sm font-semibold rounded-xl transition-all"
                                            >
                                                <Phone size={16} weight="bold" />
                                                Call
                                            </a>
                                            <a
                                                href={`https://wa.me/${getCleanPhone(service.phone)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-all"
                                            >
                                                <WhatsappLogo size={16} weight="bold" />
                                                WhatsApp
                                            </a>
                                        </>
                                    ) : (
                                        <a
                                            href={`https://www.google.com/maps/place/?q=place_id:${service.placeId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-all"
                                        >
                                            <Globe size={16} />
                                            View on Maps
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ServiceBrowse;
