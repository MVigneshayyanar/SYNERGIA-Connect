import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, DollarSign, Award, CheckCircle, Calendar } from 'lucide-react';

const ProviderProfile = () => {
    const { id } = useParams();

    const provider = {
        id: 1,
        name: "Rajesh Kumar",
        profession: "Professional Plumber",
        rating: 4.8,
        reviews: 127,
        hourlyRate: "₹500",
        location: "Koramangala, Bangalore",
        experience: "8 years",
        verified: true,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
        bio: "Experienced plumber with 8+ years in residential and commercial plumbing. Specialized in pipe repairs, installations, and emergency services. Available 24/7 for urgent issues.",
        skills: ["Pipe Repair", "Installation", "Emergency Service", "Water Heater", "Drainage", "Bathroom Fitting"],
        availability: {
            monday: "9:00 AM - 6:00 PM",
            tuesday: "9:00 AM - 6:00 PM",
            wednesday: "9:00 AM - 6:00 PM",
            thursday: "9:00 AM - 6:00 PM",
            friday: "9:00 AM - 6:00 PM",
            saturday: "10:00 AM - 4:00 PM",
            sunday: "Closed"
        },
        certifications: ["Licensed Plumber", "Safety Certified", "Background Verified"],
        completedJobs: 450
    };

    const reviews = [
        {
            id: 1,
            name: "Priya Sharma",
            rating: 5,
            date: "2 days ago",
            comment: "Excellent service! Fixed my leaking pipe quickly and professionally. Highly recommend!",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
        },
        {
            id: 2,
            name: "Amit Patel",
            rating: 4,
            date: "1 week ago",
            comment: "Good work. Arrived on time and completed the job efficiently.",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100"
        },
        {
            id: 3,
            name: "Sneha Reddy",
            rating: 5,
            date: "2 weeks ago",
            comment: "Very professional and knowledgeable. Will definitely hire again!",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100"
        }
    ];

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link
                to="/home-services"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
                ← Back to Browse
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Provider Header */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex gap-6">
                            <img
                                src={provider.image}
                                alt={provider.name}
                                className="w-32 h-32 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">{provider.name}</h1>
                                        <p className="text-gray-600">{provider.profession}</p>
                                    </div>
                                    {provider.verified && (
                                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-1">
                                            <CheckCircle size={16} />
                                            Verified
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Star size={20} className="fill-yellow-400 text-yellow-400" />
                                        <span className="font-bold text-gray-900">{provider.rating}</span>
                                        <span className="text-gray-600">({provider.reviews} reviews)</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <MapPin size={16} className="mr-1" />
                                        {provider.location}
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 text-sm text-gray-700">
                                    <div className="flex items-center gap-1">
                                        <Award size={16} />
                                        <span>{provider.experience} experience</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CheckCircle size={16} />
                                        <span>{provider.completedJobs} jobs completed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
                        <p className="text-gray-700 leading-relaxed">{provider.bio}</p>
                    </div>

                    {/* Skills & Services */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Skills & Services</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {provider.skills.map((skill, index) => (
                                <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                                    <CheckCircle size={16} className="text-blue-600" />
                                    <span className="text-gray-900">{skill}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Certifications */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Certifications</h2>
                        <div className="flex flex-wrap gap-3">
                            {provider.certifications.map((cert, index) => (
                                <div key={index} className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                                    <Award size={16} className="text-green-600" />
                                    <span className="text-green-900 font-medium">{cert}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews ({provider.reviews})</h2>
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                                    <div className="flex items-start gap-3">
                                        <img
                                            src={review.avatar}
                                            alt={review.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-semibold text-gray-900">{review.name}</h4>
                                                <span className="text-sm text-gray-500">{review.date}</span>
                                            </div>
                                            <div className="flex items-center gap-1 mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-gray-700">{review.comment}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Pricing & Booking */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <div className="text-sm text-gray-600">Hourly Rate</div>
                                <div className="text-3xl font-bold text-blue-600">{provider.hourlyRate}</div>
                            </div>
                            <DollarSign size={32} className="text-blue-600" />
                        </div>

                        <Link
                            to={`/home-services/booking/${provider.id}`}
                            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-3"
                        >
                            <Calendar size={20} />
                            Book Now
                        </Link>

                        <button className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                            Send Message
                        </button>
                    </div>

                    {/* Availability */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Availability</h3>
                        <div className="space-y-2">
                            {Object.entries(provider.availability).map(([day, hours]) => (
                                <div key={day} className="flex justify-between text-sm">
                                    <span className="font-medium text-gray-900 capitalize">{day}</span>
                                    <span className={hours === 'Closed' ? 'text-red-600' : 'text-green-600'}>
                                        {hours}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Response Time */}
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock size={20} />
                            <span className="text-sm font-medium">Response Time</span>
                        </div>
                        <div className="text-2xl font-bold">Within 1 hour</div>
                        <div className="text-green-100 text-sm mt-1">Typically responds quickly</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderProfile;
