import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, MapPin, Clock, DollarSign } from 'lucide-react';

const ServiceBrowse = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = [
        { name: 'All', icon: '🏠', count: 45 },
        { name: 'Plumbing', icon: '🔧', count: 12 },
        { name: 'Electrical', icon: '⚡', count: 8 },
        { name: 'Cleaning', icon: '🧹', count: 15 },
        { name: 'Painting', icon: '🎨', count: 6 },
        { name: 'Carpentry', icon: '🪚', count: 4 }
    ];

    const providers = [
        {
            id: 1,
            name: "Rajesh Kumar",
            profession: "Plumber",
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
            profession: "Electrician",
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
            profession: "Painter",
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
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Home Services</h1>
                <p className="text-gray-600 mt-1">Find verified professionals for your home</p>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search for services or professionals..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Categories */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Service Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                    {categories.map((category) => (
                        <button
                            key={category.name}
                            onClick={() => setSelectedCategory(category.name)}
                            className={`p-4 rounded-lg border-2 transition-all text-center ${selectedCategory === category.name
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="text-3xl mb-2">{category.icon}</div>
                            <div className="font-medium text-gray-900">{category.name}</div>
                            <div className="text-xs text-gray-500">{category.count} providers</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Providers Grid */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        {selectedCategory === 'All' ? 'All Professionals' : `${selectedCategory} Professionals`}
                    </h2>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option>Sort by: Recommended</option>
                        <option>Highest Rated</option>
                        <option>Lowest Price</option>
                        <option>Most Reviews</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProviders.map((provider) => (
                        <Link
                            key={provider.id}
                            to={`/home-services/provider/${provider.id}`}
                            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
                        >
                            {/* Provider Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={provider.image}
                                    alt={provider.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                {provider.verified && (
                                    <div className="absolute top-3 right-3 px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                        ✓ Verified
                                    </div>
                                )}
                                <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium">
                                    {provider.profession}
                                </div>
                            </div>

                            {/* Provider Info */}
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                    {provider.name}
                                </h3>

                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Star size={16} className="fill-yellow-400 text-yellow-400" />
                                        <span className="font-semibold text-gray-900">{provider.rating}</span>
                                    </div>
                                    <span className="text-sm text-gray-600">({provider.reviews} reviews)</span>
                                </div>

                                <div className="flex items-center text-gray-600 text-sm mb-2">
                                    <MapPin size={14} className="mr-1" />
                                    {provider.location}
                                </div>

                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center text-sm">
                                        <Clock size={14} className="mr-1 text-green-600" />
                                        <span className="text-green-600 font-medium">{provider.availability}</span>
                                    </div>
                                    <div className="flex items-center font-bold text-blue-600">
                                        <DollarSign size={16} />
                                        <span>{provider.hourlyRate}/hr</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1 mb-3">
                                    {provider.skills.slice(0, 3).map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <button className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
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
