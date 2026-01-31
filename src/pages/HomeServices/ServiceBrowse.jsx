import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlass, Star, MapPin, Clock, CurrencyDollar, CheckCircle, Wrench, Lightning, Broom, PaintBrush, Hammer } from '@phosphor-icons/react';
import BackButton from '../../components/BackButton';

const ServiceBrowse = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { name: 'All', icon: '🏠', count: 45, IconComponent: null },
        { name: 'Plumbing', icon: '🔧', count: 12, IconComponent: Wrench },
        { name: 'Electrical', icon: '⚡', count: 8, IconComponent: Lightning },
        { name: 'Cleaning', icon: '🧹', count: 15, IconComponent: Broom },
        { name: 'Painting', icon: '🎨', count: 6, IconComponent: PaintBrush },
        { name: 'Carpentry', icon: '🪚', count: 4, IconComponent: Hammer }
    ];

    const providers = [
        {
            id: 1,
            name: "Rajesh Kumar",
            profession: "Plumbing",
            rating: 4.8,
            reviews: 127,
            hourlyRate: "₹500",
            location: "Koramangala",
            availability: "Available Today",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
            verified: true,
            skills: ["Pipe Repair", "Installation", "Emergency Service"]
        },
        {
            id: 2,
            name: "Priya Sharma",
            profession: "Electrical",
            rating: 4.9,
            reviews: 203,
            hourlyRate: "₹600",
            location: "Indiranagar",
            availability: "Available Tomorrow",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
            verified: true,
            skills: ["Wiring", "Appliance Repair", "Installation"]
        },
        {
            id: 3,
            name: "Amit Patel",
            profession: "Cleaning",
            rating: 4.7,
            reviews: 89,
            hourlyRate: "₹400",
            location: "Whitefield",
            availability: "Available Today",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
            verified: true,
            skills: ["Deep Cleaning", "Sanitization", "Move-in/out"]
        },
        {
            id: 4,
            name: "Sneha Reddy",
            profession: "Painting",
            rating: 4.6,
            reviews: 64,
            hourlyRate: "₹550",
            location: "HSR Layout",
            availability: "Available in 2 days",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
            verified: true,
            skills: ["Interior", "Exterior", "Texture"]
        }
    ];

    const filteredProviders = selectedCategory === 'All'
        ? providers
        : providers.filter(p => p.profession === selectedCategory);

    return (
        <div className="min-h-full">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <BackButton to="/housing" label="Housing Hub" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Home Services</h1>
                <p className="text-slate-500 mt-1">Find verified professionals for your home</p>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
                <div className="relative">
                    <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for services or professionals..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF6347]/20 focus:border-[#FF6347] transition-all outline-none"
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Service Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {categories.map((category) => (
                        <button
                            key={category.name}
                            onClick={() => setSelectedCategory(category.name)}
                            className={`p-4 rounded-xl border-2 transition-all text-center ${selectedCategory === category.name
                                ? 'border-[#FF6347] bg-[#FF6347]/5'
                                : 'border-slate-200 hover:border-[#FF6347]/50'
                                }`}
                        >
                            <div className="text-3xl mb-2">{category.icon}</div>
                            <div className={`font-semibold ${selectedCategory === category.name ? 'text-[#FF6347]' : 'text-slate-900'}`}>
                                {category.name}
                            </div>
                            <div className="text-xs text-slate-500">{category.count} providers</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Providers Grid */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">
                        {selectedCategory === 'All' ? 'All Professionals' : `${selectedCategory} Professionals`}
                    </h2>
                    <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF6347]/20 focus:border-[#FF6347] outline-none">
                        <option>Sort by: Recommended</option>
                        <option>Highest Rated</option>
                        <option>Lowest Price</option>
                        <option>Most Reviews</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProviders.map((provider) => (
                        <Link
                            key={provider.id}
                            to={`/home-services/provider/${provider.id}`}
                            className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-[#FF6347]/20 transition-all duration-300 group"
                        >
                            {/* Provider Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={provider.image}
                                    alt={provider.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                {provider.verified && (
                                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                                        <CheckCircle size={12} weight="bold" />
                                        Verified
                                    </div>
                                )}
                                <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-sm font-semibold text-slate-700">
                                    {provider.profession}
                                </div>
                            </div>

                            {/* Provider Info */}
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#FF6347] transition-colors">
                                    {provider.name}
                                </h3>

                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Star size={16} weight="fill" className="text-amber-400" />
                                        <span className="font-bold text-slate-900">{provider.rating}</span>
                                    </div>
                                    <span className="text-sm text-slate-500">({provider.reviews} reviews)</span>
                                </div>

                                <div className="flex items-center text-slate-500 text-sm mb-2">
                                    <MapPin size={14} className="mr-1" />
                                    {provider.location}
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center text-sm">
                                        <Clock size={14} className="mr-1 text-green-500" />
                                        <span className="text-green-600 font-medium">{provider.availability}</span>
                                    </div>
                                    <div className="flex items-center font-bold text-[#FF6347]">
                                        <span>{provider.hourlyRate}/hr</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {provider.skills.slice(0, 3).map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <button className="w-full py-2.5 bg-[#FF6347] text-white font-semibold rounded-xl hover:bg-[#E55A3C] transition-colors">
                                    View Profile
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServiceBrowse;
