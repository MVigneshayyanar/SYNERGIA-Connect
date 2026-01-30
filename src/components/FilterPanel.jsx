import React, { useState } from 'react';
import { X } from 'lucide-react';

const FilterPanel = () => {
    const [priceRange, setPriceRange] = useState([0, 200000]);
    const [propertyType, setPropertyType] = useState([]);
    const [bedrooms, setBedrooms] = useState([]);

    const propertyTypes = ['Apartment', 'Villa', 'House', 'Studio'];
    const bedroomOptions = ['1', '2', '3', '4', '5+'];

    const toggleFilter = (value, currentFilters, setFilters) => {
        if (currentFilters.includes(value)) {
            setFilters(currentFilters.filter(item => item !== value));
        } else {
            setFilters([...currentFilters, value]);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                    Reset All
                </button>
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Price Range
                </label>
                <div className="space-y-3">
                    <input
                        type="range"
                        min="0"
                        max="200000"
                        step="5000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>₹0</span>
                        <span className="font-semibold text-gray-900">₹{priceRange[1].toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Property Type */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Property Type
                </label>
                <div className="space-y-2">
                    {propertyTypes.map(type => (
                        <label key={type} className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={propertyType.includes(type)}
                                onChange={() => toggleFilter(type, propertyType, setPropertyType)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Bedrooms */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Bedrooms
                </label>
                <div className="flex flex-wrap gap-2">
                    {bedroomOptions.map(option => (
                        <button
                            key={option}
                            onClick={() => toggleFilter(option, bedrooms, setBedrooms)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${bedrooms.includes(option)
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* Amenities */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Amenities
                </label>
                <div className="space-y-2">
                    {['Parking', 'Gym', 'Swimming Pool', 'Security', 'Power Backup'].map(amenity => (
                        <label key={amenity} className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Apply Button */}
            <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                Apply Filters
            </button>
        </div>
    );
};

export default FilterPanel;
