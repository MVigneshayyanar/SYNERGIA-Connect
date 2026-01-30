import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize, Heart, MapPin } from 'lucide-react';

const PropertyCard = ({ property, viewMode = 'grid' }) => {
    const isGridView = viewMode === 'grid';

    return (
        <Link
            to={`/marketplace/property/${property.id}`}
            className={`block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-200 overflow-hidden group ${isGridView ? '' : 'flex'
                }`}
        >
            {/* Image */}
            <div className={`relative overflow-hidden ${isGridView ? 'h-48' : 'w-64 h-full'}`}>
                <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                    <Heart size={18} className="text-gray-600" />
                </button>
                <div className="absolute bottom-3 left-3 px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                    {property.type}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {property.title}
                    </h3>
                    <span className="text-xl font-bold text-blue-600 whitespace-nowrap ml-2">
                        {property.price}
                    </span>
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-3">
                    <MapPin size={16} className="mr-1" />
                    {property.location}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-700 mb-3">
                    <div className="flex items-center gap-1">
                        <Bed size={16} />
                        <span>{property.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Bath size={16} />
                        <span>{property.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Maximize size={16} />
                        <span>{property.area}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {property.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                            {amenity}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
};

export default PropertyCard;
