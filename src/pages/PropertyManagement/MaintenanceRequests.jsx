import React, { useState } from 'react';
import { Upload, Camera, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const MaintenanceRequests = () => {
    const [showForm, setShowForm] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);

    const requests = [
        {
            id: 1,
            title: "Leaking faucet in kitchen",
            description: "The kitchen sink faucet has been leaking for 2 days",
            status: "In Progress",
            priority: "Medium",
            date: "Jan 15, 2026",
            images: ["https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400"]
        },
        {
            id: 2,
            title: "AC not cooling properly",
            description: "Living room AC is not cooling effectively",
            status: "Resolved",
            priority: "High",
            date: "Dec 20, 2025",
            images: []
        },
        {
            id: 3,
            title: "Broken door lock",
            description: "Bedroom door lock needs replacement",
            status: "Pending",
            priority: "Low",
            date: "Jan 10, 2026",
            images: []
        }
    ];

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(prev => [...prev, ...files]);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Maintenance Requests</h1>
                    <p className="text-gray-600 mt-1">Submit and track maintenance issues</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {showForm ? 'Cancel' : '+ New Request'}
                </button>
            </div>

            {/* New Request Form */}
            {showForm && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Submit New Request</h2>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Issue Title
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Leaking faucet"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                rows="4"
                                placeholder="Describe the issue in detail..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Priority
                            </label>
                            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                                <option>Emergency</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Photos
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload" className="cursor-pointer">
                                    <Camera className="mx-auto mb-3 text-gray-400" size={48} />
                                    <div className="text-gray-600 mb-1">Click to upload photos</div>
                                    <div className="text-sm text-gray-500">PNG, JPG up to 10MB</div>
                                </label>
                            </div>
                            {selectedImages.length > 0 && (
                                <div className="mt-3 flex gap-2 flex-wrap">
                                    {selectedImages.map((img, index) => (
                                        <div key={index} className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <span className="text-xs text-gray-600">{img.name.substring(0, 10)}...</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Submit Request
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-gray-900">3</div>
                            <div className="text-sm text-gray-600">Total Requests</div>
                        </div>
                        <AlertCircle className="text-blue-600" size={32} />
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-yellow-600">1</div>
                            <div className="text-sm text-gray-600">Pending</div>
                        </div>
                        <Clock className="text-yellow-600" size={32} />
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-blue-600">1</div>
                            <div className="text-sm text-gray-600">In Progress</div>
                        </div>
                        <Clock className="text-blue-600" size={32} />
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-green-600">1</div>
                            <div className="text-sm text-gray-600">Resolved</div>
                        </div>
                        <CheckCircle className="text-green-600" size={32} />
                    </div>
                </div>
            </div>

            {/* Requests List */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Your Requests</h2>
                <div className="space-y-4">
                    {requests.map((request) => (
                        <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                                request.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {request.status}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.priority === 'High' ? 'bg-red-100 text-red-700' :
                                                request.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {request.priority} Priority
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-2">{request.description}</p>
                                    <div className="text-sm text-gray-500">Submitted on {request.date}</div>
                                </div>
                            </div>

                            {request.images.length > 0 && (
                                <div className="flex gap-2 mt-3">
                                    {request.images.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt="Issue"
                                            className="w-24 h-24 rounded-lg object-cover"
                                        />
                                    ))}
                                </div>
                            )}

                            {request.status !== 'Resolved' && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                                        View Details →
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MaintenanceRequests;
