import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Wrench, FileText, House, Calendar, CurrencyDollar, CheckCircle, Clock, Receipt } from '@phosphor-icons/react';
import BackButton from '../../../components/BackButton';
import { useAuth } from '../../../context/AuthContext';

const TenantDashboard = () => {
    const { userProfile } = useAuth();

    const tenantData = {
        name: userProfile?.name || "Tenant",
        property: "Modern 3BHK Apartment, Koramangala",
        rent: "₹45,000",
        dueDate: "5th Feb 2026",
        leaseEnd: "Dec 31, 2026",
        nextPaymentStatus: "pending", // pending, paid, overdue
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
        <div className="min-h-full">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <BackButton to="/housing" label="Housing Hub" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Property Management</h1>
                <p className="text-slate-500 mt-1">Welcome back, {tenantData.name}</p>
            </div>

            {/* Rent Due Card - Prominent */}
            <div className="bg-gradient-to-r from-[#FF6347] to-[#FF8C69] rounded-2xl p-6 mb-6 text-white shadow-lg shadow-[#FF6347]/20">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="text-white/80 text-sm font-medium mb-1">Next Rent Due</p>
                        <p className="text-3xl font-bold">{tenantData.rent}</p>
                        <p className="text-white/80 mt-1">Due on {tenantData.dueDate}</p>
                    </div>
                    <Link
                        to="/property-management/payment"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#FF6347] font-bold rounded-xl hover:bg-slate-50 transition-all shadow-lg"
                    >
                        <CreditCard size={20} weight="bold" />
                        Pay Now
                    </Link>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#FF6347]/10 rounded-xl flex items-center justify-center">
                            <House size={20} className="text-[#FF6347]" weight="duotone" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{tenantData.rent}</div>
                    <div className="text-slate-500 text-sm">Monthly Rent</div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                            <Calendar size={20} className="text-green-600" weight="duotone" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{tenantData.dueDate}</div>
                    <div className="text-slate-500 text-sm">Next Due Date</div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Wrench size={20} className="text-purple-600" weight="duotone" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{tenantData.maintenanceRequests.filter(r => r.status !== 'Resolved').length}</div>
                    <div className="text-slate-500 text-sm">Active Requests</div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                            <FileText size={20} className="text-amber-600" weight="duotone" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{tenantData.leaseEnd}</div>
                    <div className="text-slate-500 text-sm">Lease Ends</div>
                </div>
            </div>

            {/* Current Property */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Current Property</h2>
                <div className="flex flex-col md:flex-row items-start gap-4">
                    <img
                        src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"
                        alt="Property"
                        className="w-full md:w-40 h-32 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900">{tenantData.property}</h3>
                        <p className="text-slate-500 mt-1">Lease Period: Jan 1, 2025 - {tenantData.leaseEnd}</p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <Link
                                to="/property-management/payment"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6347] text-white font-semibold rounded-xl hover:bg-[#E55A3C] transition-colors"
                            >
                                <CreditCard size={18} weight="bold" />
                                Pay Rent
                            </Link>
                            <button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium">
                                View Lease
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment History */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-900">Payment History</h2>
                        <Link to="/property-management/payment" className="text-[#FF6347] hover:text-[#E55A3C] text-sm font-semibold">
                            View All →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {tenantData.paymentHistory.map((payment, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div>
                                    <div className="font-semibold text-slate-900">{payment.month}</div>
                                    <div className="text-sm text-slate-500">{payment.date}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-slate-900">{payment.amount}</div>
                                    <div className="flex items-center gap-1 text-sm text-green-600">
                                        <CheckCircle size={14} weight="bold" />
                                        {payment.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Maintenance Requests */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-900">Maintenance Requests</h2>
                        <Link
                            to="/property-management/maintenance"
                            className="text-[#FF6347] hover:text-[#E55A3C] text-sm font-semibold"
                        >
                            New Request →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {tenantData.maintenanceRequests.map((request) => (
                            <div key={request.id} className="p-4 bg-slate-50 rounded-xl">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="font-semibold text-slate-900">{request.issue}</div>
                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${request.status === 'Resolved'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {request.status}
                                    </span>
                                </div>
                                <div className="text-sm text-slate-500">{request.date}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mt-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        to="/property-management/payment"
                        className="p-5 border border-slate-200 rounded-2xl hover:border-[#FF6347] hover:bg-[#FF6347]/5 transition-all text-center group"
                    >
                        <CreditCard className="mx-auto mb-2 text-[#FF6347]" size={28} weight="duotone" />
                        <div className="font-semibold text-slate-900 group-hover:text-[#FF6347]">Pay Rent</div>
                    </Link>
                    <Link
                        to="/property-management/maintenance"
                        className="p-5 border border-slate-200 rounded-2xl hover:border-[#FF6347] hover:bg-[#FF6347]/5 transition-all text-center group"
                    >
                        <Wrench className="mx-auto mb-2 text-[#FF6347]" size={28} weight="duotone" />
                        <div className="font-semibold text-slate-900 group-hover:text-[#FF6347]">Maintenance</div>
                    </Link>
                    <button className="p-5 border border-slate-200 rounded-2xl hover:border-[#FF6347] hover:bg-[#FF6347]/5 transition-all text-center group">
                        <FileText className="mx-auto mb-2 text-[#FF6347]" size={28} weight="duotone" />
                        <div className="font-semibold text-slate-900 group-hover:text-[#FF6347]">Documents</div>
                    </button>
                    <button className="p-5 border border-slate-200 rounded-2xl hover:border-[#FF6347] hover:bg-[#FF6347]/5 transition-all text-center group">
                        <Receipt className="mx-auto mb-2 text-[#FF6347]" size={28} weight="duotone" />
                        <div className="font-semibold text-slate-900 group-hover:text-[#FF6347]">Receipts</div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TenantDashboard;
