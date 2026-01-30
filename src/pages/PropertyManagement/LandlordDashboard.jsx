import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, Wrench, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

const LandlordDashboard = () => {
    const landlordData = {
        name: "Sarah Johnson",
        properties: [
            {
                id: 1,
                name: "Modern 3BHK Apartment",
                location: "Koramangala",
                tenant: "John Doe",
                rent: "₹45,000",
                status: "Paid",
                image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"
            },
            {
                id: 2,
                name: "Luxury Villa",
                location: "Whitefield",
                tenant: "Jane Smith",
                rent: "₹1,25,000",
                status: "Pending",
                image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400"
            }
        ],
        monthlyRevenue: "₹1,70,000",
        occupancyRate: "100%",
        pendingRequests: 2
    };

    const recentTransactions = [
        { tenant: "John Doe", property: "3BHK Apartment", amount: "₹45,000", date: "Jan 3, 2026", status: "Completed" },
        { tenant: "Jane Smith", property: "Luxury Villa", amount: "₹1,25,000", date: "Jan 2, 2026", status: "Pending" }
    ];

    const maintenanceQueue = [
        { property: "3BHK Apartment", issue: "Leaking faucet", tenant: "John Doe", priority: "Medium", date: "Jan 15" },
        { property: "Luxury Villa", issue: "AC servicing", tenant: "Jane Smith", priority: "Low", date: "Jan 10" }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Landlord Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, {landlordData.name}</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <Home size={24} />
                    </div>
                    <div className="text-2xl font-bold">{landlordData.properties.length}</div>
                    <div className="text-blue-100 text-sm">Total Properties</div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <DollarSign size={24} />
                    </div>
                    <div className="text-2xl font-bold">{landlordData.monthlyRevenue}</div>
                    <div className="text-green-100 text-sm">Monthly Revenue</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp size={24} />
                    </div>
                    <div className="text-2xl font-bold">{landlordData.occupancyRate}</div>
                    <div className="text-purple-100 text-sm">Occupancy Rate</div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <AlertCircle size={24} />
                    </div>
                    <div className="text-2xl font-bold">{landlordData.pendingRequests}</div>
                    <div className="text-orange-100 text-sm">Pending Requests</div>
                </div>
            </div>

            {/* Properties Portfolio */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Property Portfolio</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {landlordData.properties.map((property) => (
                        <div key={property.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                            <div className="flex gap-4">
                                <img
                                    src={property.image}
                                    alt={property.name}
                                    className="w-24 h-24 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{property.name}</h3>
                                    <p className="text-sm text-gray-600">{property.location}</p>
                                    <div className="mt-2 flex items-center justify-between">
                                        <div>
                                            <div className="text-sm text-gray-600">Tenant: {property.tenant}</div>
                                            <div className="font-bold text-gray-900">{property.rent}/month</div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${property.status === 'Paid'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {property.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Transactions */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                        <Link to="/property-management/payment" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentTransactions.map((transaction, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="font-semibold text-gray-900">{transaction.tenant}</div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${transaction.status === 'Completed'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {transaction.status}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600">{transaction.property}</div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="font-bold text-gray-900">{transaction.amount}</span>
                                    <span className="text-sm text-gray-600">{transaction.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Maintenance Queue */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Maintenance Queue</h2>
                        <Link
                            to="/property-management/maintenance"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            Manage
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {maintenanceQueue.map((request, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <div className="font-semibold text-gray-900">{request.issue}</div>
                                        <div className="text-sm text-gray-600">{request.property}</div>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${request.priority === 'High' ? 'bg-red-100 text-red-700' :
                                            request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-blue-100 text-blue-700'
                                        }`}>
                                        {request.priority}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>Tenant: {request.tenant}</span>
                                    <span>{request.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Financial Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-sm text-green-700 mb-1">Total Collected</div>
                        <div className="text-2xl font-bold text-green-900">₹45,000</div>
                        <div className="text-xs text-green-600 mt-1">This month</div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                        <div className="text-sm text-yellow-700 mb-1">Pending</div>
                        <div className="text-2xl font-bold text-yellow-900">₹1,25,000</div>
                        <div className="text-xs text-yellow-600 mt-1">Due this month</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-sm text-blue-700 mb-1">Expected Revenue</div>
                        <div className="text-2xl font-bold text-blue-900">₹1,70,000</div>
                        <div className="text-xs text-blue-600 mt-1">Monthly total</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandlordDashboard;
