import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlass, MapPin, Funnel, SquaresFour, List, Plus, Bed, Bathtub, Ruler } from '@phosphor-icons/react';
import BackButton from '../../components/BackButton';

const PropertySearch = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Mock property data
    const properties = [
        {
            id: 1,
            title: "Modern 3BHK Apartment",
            price: "₹45,000",
            period: "month",
            location: "Koramangala, Bangalore",
            bedrooms: 3,
            bathrooms: 2,
            area: "1450",
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
            type: "Apartment",
            isNew: true
        },
        {
            id: 2,
            title: "Luxury Villa with Garden",
            price: "₹1,25,000",
            period: "month",
            location: "Whitefield, Bangalore",
            bedrooms: 4,
            bathrooms: 3,
            area: "2800",
            image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
            type: "Villa",
            isNew: false
        },
        {
            id: 3,
            title: "Cozy 2BHK Near Metro",
            price: "₹28,000",
            period: "month",
            location: "Indiranagar, Bangalore",
            bedrooms: 2,
            bathrooms: 2,
            area: "950",
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
            type: "Apartment",
            isNew: true
        },
        {
            id: 4,
            title: "Spacious Studio Apartment",
            price: "₹18,000",
            period: "month",
            location: "HSR Layout, Bangalore",
            bedrooms: 1,
            bathrooms: 1,
            area: "550",
            image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
            type: "Studio",
            isNew: false
        }
    ];

    const filterOptions = [
        { label: "All", value: "all" },
        { label: "Apartment", value: "apartment" },
        { label: "Villa", value: "villa" },
        { label: "Studio", value: "studio" }
    ];

    const [activeFilter, setActiveFilter] = useState('all');

    const filteredProperties = properties.filter(p =>
        activeFilter === 'all' || p.type.toLowerCase() === activeFilter
    );

    return (
        <div className="min-h-full">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <BackButton to="/housing" label="Housing Hub" />
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Property Marketplace</h1>
                        <p className="text-slate-500 mt-1">Find your perfect home from verified listings</p>
                    </div>
                    <Link
                        to="/post-property"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF6347] text-white font-semibold rounded-xl hover:bg-[#E55A3C] transition-all shadow-lg shadow-[#FF6347]/20 hover:shadow-xl hover:shadow-[#FF6347]/30"
                    >
                        <Plus size={20} weight="bold" />
                        Post Property
                    </Link>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by location, property name..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF6347]/20 focus:border-[#FF6347] transition-all outline-none"
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
                </div>

                {/* Filter Pills */}
                {showFilters && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                        {filterOptions.map(filter => (
                            <button
                                key={filter.value}
                                onClick={() => setActiveFilter(filter.value)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === filter.value
                                        ? 'bg-[#FF6347] text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-slate-600">
                    <span className="font-semibold text-slate-900">{filteredProperties.length}</span> properties found
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

            {/* Property Grid */}
            <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }>
                {filteredProperties.map(property => (
                    <Link
                        key={property.id}
                        to={`/marketplace/property/${property.id}`}
                        className={`group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-[#FF6347]/20 transition-all duration-300 ${viewMode === 'list' ? 'flex' : ''
                            }`}
                    >
                        {/* Image */}
                        <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-64 h-48' : 'h-48'}`}>
                            <img
                                src={property.image}
                                alt={property.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {property.isNew && (
                                <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#FF6347] text-white text-xs font-bold rounded-full">
                                    NEW
                                </span>
                            )}
                            <span className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-medium rounded-full">
                                {property.type}
                            </span>
                        </div>

                        {/* Content */}
                        <div className={`p-5 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                            <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-[#FF6347] transition-colors">
                                {property.title}
                            </h3>
                            <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-4">
                                <MapPin size={14} />
                                <span>{property.location}</span>
                            </div>

                            {/* Features */}
                            <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                                <div className="flex items-center gap-1">
                                    <Bed size={16} className="text-slate-400" />
                                    <span>{property.bedrooms}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Bathtub size={16} className="text-slate-400" />
                                    <span>{property.bathrooms}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Ruler size={16} className="text-slate-400" />
                                    <span>{property.area} sqft</span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-[#FF6347]">{property.price}</span>
                                <span className="text-slate-400 text-sm">/{property.period}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PropertySearch;
