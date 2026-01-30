import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Wrench, FileText, Home, Calendar, DollarSign } from 'lucide-react';

const TenantDashboard = () => {
    const tenantData = {
        name: "John Doe",
        property: "Modern 3BHK Apartment, Koramangala",
        rent: "₹45,000",
        dueDate: "5th of every month",
        leaseEnd: "Dec 31, 2026",
        paymentHistory: [
            { month: "January 2026", amount: "₹45,000", status: "Paid", date: "Jan 3, 2026" },
            { month: "December 2025", amount: "₹45,000", status: "Paid", date: "Dec 2, 2025" },
            { month: "November 2025", amount: "₹45,000", status: "Paid", date: "Nov 4, 2025" }
        ],
        maintenanceRequests: [
            { id: 1, issue: "Leaking faucet in kitchen", status: "In Progress", date: "Jan 15, 2026" },
            { id: 2, issue: "AC not cooling", status: "Resolved", date: "Dec 20, 2025" }
        ]
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Tenant Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, {tenantData.name}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <Home size={24} />
                    </div>
                    <div className="text-2xl font-bold">{tenantData.rent}</div>
                    <div className="text-blue-100 text-sm">Monthly Rent</div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <Calendar size={24} />
                    </div>
                    <div className="text-2xl font-bold">{tenantData.dueDate}</div>
                    <div className="text-green-100 text-sm">Payment Due</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <Wrench size={24} />
                    </div>
                    <div className="text-2xl font-bold">{tenantData.maintenanceRequests.filter(r => r.status !== 'Resolved').length}</div>
                    <div className="text-purple-100 text-sm">Active Requests</div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <FileText size={24} />
                    </div>
                    <div className="text-2xl font-bold">{tenantData.leaseEnd}</div>
                    <div className="text-orange-100 text-sm">Lease Ends</div>
                </div>
            </div>

            {/* Current Property */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Current Property</h2>
                <div className="flex items-start gap-4">
                    <img
                        src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"
                        alt="Property"
                        className="w-32 h-32 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{tenantData.property}</h3>
                        <p className="text-gray-600 mt-1">Lease Period: Jan 1, 2025 - {tenantData.leaseEnd}</p>
                        <div className="mt-4 flex gap-3">
                            <Link
                                to="/property-management/payment"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <CreditCard size={18} />
                                Pay Rent
                            </Link>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                View Lease
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment History */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
                        <Link to="/property-management/payment" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {tenantData.paymentHistory.map((payment, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <div className="font-semibold text-gray-900">{payment.month}</div>
                                    <div className="text-sm text-gray-600">{payment.date}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-gray-900">{payment.amount}</div>
                                    <div className="text-sm text-green-600">{payment.status}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Maintenance Requests */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Maintenance Requests</h2>
                        <Link
                            to="/property-management/maintenance"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            New Request
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {tenantData.maintenanceRequests.map((request) => (
                            <div key={request.id} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="font-semibold text-gray-900">{request.issue}</div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${request.status === 'Resolved'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {request.status}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600">{request.date}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        to="/property-management/payment"
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-center"
                    >
                        <CreditCard className="mx-auto mb-2 text-blue-600" size={24} />
                        <div className="font-medium text-gray-900">Pay Rent</div>
                    </Link>
                    <Link
                        to="/property-management/maintenance"
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-center"
                    >
                        <Wrench className="mx-auto mb-2 text-blue-600" size={24} />
                        <div className="font-medium text-gray-900">Maintenance</div>
                    </Link>
                    <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-center">
                        <FileText className="mx-auto mb-2 text-blue-600" size={24} />
                        <div className="font-medium text-gray-900">Documents</div>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-center">
                        <DollarSign className="mx-auto mb-2 text-blue-600" size={24} />
                        <div className="font-medium text-gray-900">Receipts</div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TenantDashboard;
