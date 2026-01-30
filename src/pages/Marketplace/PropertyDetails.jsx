import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Heart, Share2, Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react';

const PropertyDetails = () => {
    const { id } = useParams();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Mock property data
    const property = {
        id: 1,
        title: "Modern 3BHK Apartment",
        price: "₹45,000/month",
        location: "Koramangala, Bangalore",
        bedrooms: 3,
        bathrooms: 2,
        area: "1450 sq ft",
        type: "Apartment",
        description: "Beautiful modern apartment with spacious rooms, natural lighting, and premium amenities. Located in the heart of Koramangala with easy access to restaurants, shopping centers, and metro station.",
        images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200",
            "https://images.unsplash.com/photo-1502672260066-6bc35f0a1f7c?w=1200",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200"
        ],
        amenities: ["Parking", "Gym", "Swimming Pool", "Security", "Power Backup", "Elevator", "Garden"],
        features: {
            "Furnishing": "Semi-Furnished",
            "Floor": "5th Floor",
            "Facing": "East",
            "Age": "2 Years",
            "Deposit": "₹90,000"
        },
        virtualTour: "https://www.example.com/virtual-tour"
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    };

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link
                to="/marketplace"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
                <ChevronLeft size={20} />
                Back to Search
            </Link>

            {/* Image Gallery */}
            <div className="relative h-[500px] rounded-2xl overflow-hidden bg-gray-900">
                <img
                    src={property.images[currentImageIndex]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                    <ChevronRight size={24} />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 text-white rounded-full text-sm">
                    {currentImageIndex + 1} / {property.images.length}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <button className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors">
                        <Heart size={20} />
                    </button>
                    <button className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {property.images.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex ? 'border-blue-600' : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                    >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title and Price */}
                    <div>
                        <div className="flex items-start justify-between mb-2">
                            <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                            <span className="text-3xl font-bold text-blue-600">{property.price}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <MapPin size={18} className="mr-1" />
                            {property.location}
                        </div>
                    </div>

                    {/* Key Features */}
                    <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2">
                            <Bed size={24} className="text-gray-600" />
                            <div>
                                <div className="text-sm text-gray-600">Bedrooms</div>
                                <div className="font-semibold">{property.bedrooms}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Bath size={24} className="text-gray-600" />
                            <div>
                                <div className="text-sm text-gray-600">Bathrooms</div>
                                <div className="font-semibold">{property.bathrooms}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Maximize size={24} className="text-gray-600" />
                            <div>
                                <div className="text-sm text-gray-600">Area</div>
                                <div className="font-semibold">{property.area}</div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                        <p className="text-gray-700 leading-relaxed">{property.description}</p>
                    </div>

                    {/* Features */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Property Features</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(property.features).map(([key, value]) => (
                                <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">{key}</span>
                                    <span className="font-semibold text-gray-900">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {property.amenities.map((amenity, index) => (
                                <div key={index} className="flex items-center gap-2 text-gray-700">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    {amenity}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3D Virtual Tour */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">3D Virtual Tour</h2>
                        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-gray-600 mb-3">Virtual tour integration placeholder</p>
                                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    Launch Virtual Tour
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Contact Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Agent</h3>

                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="I'm interested in this property..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Send Inquiry
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                            <button className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <Phone size={18} />
                                Call Now
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <Mail size={18} />
                                Email Agent
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;
