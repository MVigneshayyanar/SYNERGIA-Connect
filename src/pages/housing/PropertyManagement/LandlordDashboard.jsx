import React from 'react';
import { Link } from 'react-router-dom';
import { House, Users, Wrench, CurrencyDollar, ChartLineUp, Warning, CheckCircle, Clock, Plus } from '@phosphor-icons/react';
import BackButton from '../../../components/BackButton';
import { useAuth } from '../../../context/AuthContext';

const LandlordDashboard = () => {
    const { userProfile } = useAuth();

    const landlordData = {
        name: userProfile?.name || "Property Owner",
        properties: [
            {
                id: 1,
                name: "Modern 3BHK Apartment",
                location: "Koramangala",
                tenant: "John Doe",
                tenantEmail: "john@example.com",
                rent: "₹45,000",
                status: "Paid",
                paidDate: "Jan 3, 2026",
                image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"
            },
            {
                id: 2,
                name: "Luxury Villa",
                location: "Whitefield",
                tenant: "Jane Smith",
                tenantEmail: "jane@example.com",
                rent: "₹1,25,000",
                status: "Pending",
                dueDate: "Feb 5, 2026",
                image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400"
            },
            {
                id: 3,
                name: "Cozy 2BHK Flat",
                location: "Indiranagar",
                tenant: "Mike Johnson",
                tenantEmail: "mike@example.com",
                rent: "₹35,000",
                status: "Overdue",
                dueDate: "Jan 5, 2026",
                image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400"
            }
        ],
        monthlyRevenue: "₹2,05,000",
        occupancyRate: "100%",
        pendingRequests: 2
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Paid':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                        <CheckCircle size={14} weight="bold" />
                        Paid
                    </span>
                );
            case 'Pending':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-700 text-sm font-bold rounded-full">
                        <Clock size={14} weight="bold" />
                        Pending
                    </span>
                );
            case 'Overdue':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 text-sm font-bold rounded-full">
                        <Warning size={14} weight="bold" />
                        Overdue
                    </span>
                );
            default:
                return null;
        }
    };

    const maintenanceQueue = [
        { property: "3BHK Apartment", issue: "Leaking faucet", tenant: "John Doe", priority: "Medium", date: "Jan 15" },
        { property: "Luxury Villa", issue: "AC servicing", tenant: "Jane Smith", priority: "Low", date: "Jan 10" }
    ];

    return (
        <div className="min-h-full">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <BackButton to="/housing" label="Housing Hub" />
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Landlord Dashboard</h1>
                        <p className="text-slate-500 mt-1">Welcome back, {landlordData.name}</p>
                    </div>
                    <Link
                        to="/post-property"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF6347] text-white font-semibold rounded-xl hover:bg-[#E55A3C] transition-all shadow-lg shadow-[#FF6347]/20"
                    >
                        <Plus size={20} weight="bold" />
                        Add Property
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#FF6347]/10 rounded-xl flex items-center justify-center">
                            <House size={20} className="text-[#FF6347]" weight="duotone" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{landlordData.properties.length}</div>
                    <div className="text-slate-500 text-sm">Total Properties</div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                            <CurrencyDollar size={20} className="text-green-600" weight="duotone" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{landlordData.monthlyRevenue}</div>
                    <div className="text-slate-500 text-sm">Monthly Revenue</div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                            <ChartLineUp size={20} className="text-purple-600" weight="duotone" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{landlordData.occupancyRate}</div>
                    <div className="text-slate-500 text-sm">Occupancy Rate</div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Warning size={20} className="text-amber-600" weight="duotone" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{landlordData.pendingRequests}</div>
                    <div className="text-slate-500 text-sm">Pending Requests</div>
                </div>
            </div>

            {/* Property Portfolio with Payment Status */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Property Portfolio & Rent Status</h2>
                    <span className="text-sm text-slate-500">{landlordData.properties.length} properties</span>
                </div>
                <div className="space-y-4">
                    {landlordData.properties.map((property) => (
                        <div key={property.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                            <img
                                src={property.image}
                                alt={property.name}
                                className="w-full md:w-28 h-24 rounded-xl object-cover"
                            />
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900">{property.name}</h3>
                                <p className="text-sm text-slate-500">{property.location}</p>
                                <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                                    <Users size={14} />
                                    <span>{property.tenant}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-start md:items-end gap-2">
                                <div className="text-xl font-bold text-slate-900">{property.rent}</div>
                                <span className="text-sm text-slate-500">per month</span>
                            </div>
                            <div className="flex flex-col items-start md:items-end gap-2">
                                {getStatusBadge(property.status)}
                                <span className="text-xs text-slate-500">
                                    {property.status === 'Paid'
                                        ? `Paid on ${property.paidDate}`
                                        : `Due: ${property.dueDate}`}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Financial Summary */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Financial Summary</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-green-700 font-medium">Collected</div>
                                    <div className="text-2xl font-bold text-green-900">₹45,000</div>
                                </div>
                                <CheckCircle size={32} className="text-green-500" weight="duotone" />
                            </div>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-amber-700 font-medium">Pending</div>
                                    <div className="text-2xl font-bold text-amber-900">₹1,25,000</div>
                                </div>
                                <Clock size={32} className="text-amber-500" weight="duotone" />
                            </div>
                        </div>
                        <div className="p-4 bg-red-50 rounded-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-red-700 font-medium">Overdue</div>
                                    <div className="text-2xl font-bold text-red-900">₹35,000</div>
                                </div>
                                <Warning size={32} className="text-red-500" weight="duotone" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Maintenance Queue */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-900">Maintenance Queue</h2>
                        <Link
                            to="/property-management/maintenance"
                            className="text-[#FF6347] hover:text-[#E55A3C] text-sm font-semibold"
                        >
                            Manage →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {maintenanceQueue.map((request, index) => (
                            <div key={index} className="p-4 bg-slate-50 rounded-xl">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <div className="font-semibold text-slate-900">{request.issue}</div>
                                        <div className="text-sm text-slate-500">{request.property}</div>
                                    </div>
                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${request.priority === 'High' ? 'bg-red-100 text-red-700' :
                                        request.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                        {request.priority}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-slate-500">
                                    <span>Tenant: {request.tenant}</span>
                                    <span>{request.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandlordDashboard;
