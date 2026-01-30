import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Grid, List, SlidersHorizontal } from 'lucide-react';
import PropertyCard from '../../components/PropertyCard';
import FilterPanel from '../../components/FilterPanel';

const PropertySearch = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(true);

    // Mock property data
    const properties = [
        {
            id: 1,
            title: "Modern 3BHK Apartment",
            price: "₹45,000/month",
            location: "Koramangala, Bangalore",
            bedrooms: 3,
            bathrooms: 2,
            area: "1450 sq ft",
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
            type: "Apartment",
            amenities: ["Parking", "Gym", "Swimming Pool"]
        },
        {
            id: 2,
            title: "Luxury Villa with Garden",
            price: "₹1,25,000/month",
            location: "Whitefield, Bangalore",
            bedrooms: 4,
            bathrooms: 3,
            area: "2800 sq ft",
            image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
            type: "Villa",
            amenities: ["Garden", "Parking", "Security"]
        },
        {
            id: 3,
            title: "Cozy 2BHK Near Metro",
            price: "₹28,000/month",
            location: "Indiranagar, Bangalore",
            bedrooms: 2,
            bathrooms: 2,
            area: "950 sq ft",
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
            type: "Apartment",
            amenities: ["Parking", "Power Backup"]
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Property Marketplace</h1>
                    <p className="text-gray-600 mt-1">Find your perfect home</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        <SlidersHorizontal size={18} />
                        Filters
                    </button>

                    <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by location, property name..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <div className="flex gap-6">
                {/* Filter Panel */}
                {showFilters && (
                    <div className="w-80 flex-shrink-0">
                        <FilterPanel />
                    </div>
                )}

                {/* Property Grid/List */}
                <div className="flex-1">
                    <div className="mb-4 text-sm text-gray-600">
                        Showing {properties.length} properties
                    </div>

                    <div className={viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        : 'space-y-4'
                    }>
                        {properties.map(property => (
                            <PropertyCard key={property.id} property={property} viewMode={viewMode} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertySearch;
