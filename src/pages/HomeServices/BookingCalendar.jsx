import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Clock, CheckCircle, User, MapPin } from 'lucide-react';

const BookingCalendar = () => {
    const { providerId } = useParams();
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [duration, setDuration] = useState(2);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const provider = {
        name: "Rajesh Kumar",
        profession: "Professional Plumber",
        hourlyRate: 500,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
    };

    const availableSlots = [
        "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
        "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
    ];

    const handleBooking = () => {
        setShowConfirmation(true);
    };

    const totalCost = provider.hourlyRate * duration;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Book Service</h1>
                <p className="text-gray-600 mt-1">Select your preferred date and time</p>
            </div>

            {showConfirmation ? (
                /* Confirmation Screen */
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32} className="text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                        <p className="text-gray-600 mb-6">Your service has been successfully booked.</p>

                        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                            <h3 className="font-bold text-gray-900 mb-4">Booking Details</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Provider</span>
                                    <span className="font-semibold">{provider.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Service</span>
                                    <span className="font-semibold">{provider.profession}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Date</span>
                                    <span className="font-semibold">{selectedDate.toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Time</span>
                                    <span className="font-semibold">{selectedTime}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Duration</span>
                                    <span className="font-semibold">{duration} hours</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-gray-200">
                                    <span className="font-bold text-gray-900">Total Cost</span>
                                    <span className="font-bold text-blue-600 text-xl">₹{totalCost}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/home-services')}
                                className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Browse More Services
                            </button>
                            <button
                                onClick={() => navigate('/property-management/tenant')}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                            >
                                View My Bookings
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar & Time Selection */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Provider Info */}
                        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                            <img
                                src={provider.image}
                                alt={provider.name}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900">{provider.name}</h3>
                                <p className="text-sm text-gray-600">{provider.profession}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-600">Hourly Rate</div>
                                <div className="text-xl font-bold text-blue-600">₹{provider.hourlyRate}</div>
                            </div>
                        </div>

                        {/* Calendar */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Date</h2>
                            <div className="calendar-container">
                                <Calendar
                                    onChange={setSelectedDate}
                                    value={selectedDate}
                                    minDate={new Date()}
                                    className="w-full border-0"
                                />
                            </div>
                        </div>

                        {/* Time Slots */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Time Slot</h2>
                            <div className="grid grid-cols-4 gap-3">
                                {availableSlots.map((slot) => (
                                    <button
                                        key={slot}
                                        onClick={() => setSelectedTime(slot)}
                                        className={`p-3 rounded-lg border-2 transition-all ${selectedTime === slot
                                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <Clock size={16} className="mx-auto mb-1" />
                                        <div className="text-sm font-medium">{slot}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Service Duration</h2>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setDuration(Math.max(1, duration - 1))}
                                    className="w-12 h-12 border border-gray-300 rounded-lg hover:bg-gray-50 font-bold text-xl"
                                >
                                    -
                                </button>
                                <div className="flex-1 text-center">
                                    <div className="text-3xl font-bold text-gray-900">{duration}</div>
                                    <div className="text-sm text-gray-600">hours</div>
                                </div>
                                <button
                                    onClick={() => setDuration(duration + 1)}
                                    className="w-12 h-12 border border-gray-300 rounded-lg hover:bg-gray-50 font-bold text-xl"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Service Address */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Service Address</h2>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Street Address"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="City"
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Pincode"
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <textarea
                                    rows="2"
                                    placeholder="Additional instructions (optional)"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Date</span>
                                    <span className="font-semibold">
                                        {selectedDate.toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Time</span>
                                    <span className="font-semibold">{selectedTime || 'Not selected'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Duration</span>
                                    <span className="font-semibold">{duration} hours</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Rate</span>
                                    <span className="font-semibold">₹{provider.hourlyRate}/hr</span>
                                </div>
                                <div className="pt-3 border-t border-gray-200 flex justify-between">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="font-bold text-blue-600 text-2xl">₹{totalCost}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleBooking}
                                disabled={!selectedTime}
                                className={`w-full py-3 rounded-lg font-semibold transition-colors ${selectedTime
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Confirm Booking
                            </button>

                            <p className="text-xs text-gray-500 mt-3 text-center">
                                You will be charged after service completion
                            </p>
                        </div>

                        {/* Safety Info */}
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <h4 className="font-semibold text-green-900 mb-2">Safety First</h4>
                            <ul className="text-sm text-green-700 space-y-1">
                                <li>✓ All providers are verified</li>
                                <li>✓ Background checked</li>
                                <li>✓ Insured professionals</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Calendar Styles */}
            <style jsx>{`
        .calendar-container :global(.react-calendar) {
          border: none;
          font-family: inherit;
        }
        .calendar-container :global(.react-calendar__tile--active) {
          background: #2563eb;
          color: white;
        }
        .calendar-container :global(.react-calendar__tile--now) {
          background: #dbeafe;
        }
      `}</style>
        </div>
    );
};

export default BookingCalendar;
