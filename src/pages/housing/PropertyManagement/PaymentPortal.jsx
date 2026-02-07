import React, { useState } from 'react';
import { CreditCard, Buildings, Calendar, CheckCircle, Clock, Receipt } from '@phosphor-icons/react';
import BackButton from '../../../components/BackButton';
import { useAuth } from '../../../context/AuthContext';

const PaymentPortal = () => {
    const { userProfile } = useAuth();
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [showSuccess, setShowSuccess] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
        }, 2000);
    };

    const paymentHistory = [
        { id: 1, month: "January 2026", amount: "₹45,000", date: "Jan 3, 2026", status: "Completed", receipt: "#REC001" },
        { id: 2, month: "December 2025", amount: "₹45,000", date: "Dec 2, 2025", status: "Completed", receipt: "#REC002" },
        { id: 3, month: "November 2025", amount: "₹45,000", date: "Nov 4, 2025", status: "Completed", receipt: "#REC003" },
        { id: 4, month: "October 2025", amount: "₹45,000", date: "Oct 1, 2025", status: "Completed", receipt: "#REC004" }
    ];

    return (
        <div className="min-h-full">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <BackButton to="/property-management/tenant" label="Dashboard" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Payment Portal</h1>
                <p className="text-slate-500 mt-1">Pay your monthly rent securely</p>
            </div>

            {/* Success Message */}
            {showSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-green-600" size={24} weight="bold" />
                    </div>
                    <div>
                        <div className="font-bold text-green-900">Payment Successful!</div>
                        <div className="text-sm text-green-700">Your rent payment of ₹45,000 has been processed.</div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Payment Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Make a Payment</h2>

                        {/* Property Info */}
                        <div className="bg-[#FF6347]/5 border border-[#FF6347]/20 rounded-xl p-4 mb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-[#FF6347]/10 rounded-xl flex items-center justify-center">
                                    <Buildings className="text-[#FF6347]" size={20} weight="duotone" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">Modern 3BHK Apartment</div>
                                    <div className="text-sm text-slate-500">Koramangala, Bangalore</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#FF6347]/20">
                                <span className="text-slate-600">Monthly Rent</span>
                                <span className="text-2xl font-bold text-[#FF6347]">₹45,000</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Payment Method Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                    Payment Method
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('card')}
                                        className={`p-4 border-2 rounded-xl transition-all ${paymentMethod === 'card'
                                            ? 'border-[#FF6347] bg-[#FF6347]/5'
                                            : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <CreditCard className={`mx-auto mb-2 ${paymentMethod === 'card' ? 'text-[#FF6347]' : 'text-slate-500'}`} size={24} weight="duotone" />
                                        <div className={`text-sm font-semibold ${paymentMethod === 'card' ? 'text-[#FF6347]' : 'text-slate-700'}`}>Card</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('upi')}
                                        className={`p-4 border-2 rounded-xl transition-all ${paymentMethod === 'upi'
                                            ? 'border-[#FF6347] bg-[#FF6347]/5'
                                            : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="text-2xl mb-2">📱</div>
                                        <div className={`text-sm font-semibold ${paymentMethod === 'upi' ? 'text-[#FF6347]' : 'text-slate-700'}`}>UPI</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('bank')}
                                        className={`p-4 border-2 rounded-xl transition-all ${paymentMethod === 'bank'
                                            ? 'border-[#FF6347] bg-[#FF6347]/5'
                                            : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="text-2xl mb-2">🏦</div>
                                        <div className={`text-sm font-semibold ${paymentMethod === 'bank' ? 'text-[#FF6347]' : 'text-slate-700'}`}>Bank</div>
                                    </button>
                                </div>
                            </div>

                            {/* Card Payment Form */}
                            {paymentMethod === 'card' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Card Number
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="1234 5678 9012 3456"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF6347]/20 focus:border-[#FF6347] transition-all outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Expiry Date
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF6347]/20 focus:border-[#FF6347] transition-all outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                CVV
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF6347]/20 focus:border-[#FF6347] transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Cardholder Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF6347]/20 focus:border-[#FF6347] transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* UPI Payment */}
                            {paymentMethod === 'upi' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        UPI ID
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="yourname@upi"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF6347]/20 focus:border-[#FF6347] transition-all outline-none"
                                    />
                                </div>
                            )}

                            {/* Bank Transfer */}
                            {paymentMethod === 'bank' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Account Number
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter account number"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF6347]/20 focus:border-[#FF6347] transition-all outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            IFSC Code
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter IFSC code"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF6347]/20 focus:border-[#FF6347] transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-4 bg-[#FF6347] text-white font-bold rounded-xl hover:bg-[#E55A3C] transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#FF6347]/20"
                            >
                                {processing ? 'Processing...' : 'Pay ₹45,000'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Payment Summary & History */}
                <div className="space-y-6">
                    {/* Payment Summary */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Payment Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Rent Amount</span>
                                <span className="font-semibold text-slate-900">₹45,000</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Processing Fee</span>
                                <span className="font-semibold text-green-600">FREE</span>
                            </div>
                            <div className="pt-3 border-t border-slate-200 flex justify-between">
                                <span className="font-bold text-slate-900">Total</span>
                                <span className="font-bold text-[#FF6347] text-xl">₹45,000</span>
                            </div>
                        </div>
                    </div>

                    {/* Next Payment Due */}
                    <div className="bg-gradient-to-r from-[#FF6347] to-[#FF8C69] rounded-2xl p-6 text-white shadow-lg shadow-[#FF6347]/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar size={20} weight="bold" />
                            <span className="text-sm font-medium text-white/80">Next Payment Due</span>
                        </div>
                        <div className="text-2xl font-bold">Feb 5, 2026</div>
                        <div className="text-white/80 text-sm mt-1 flex items-center gap-1">
                            <Clock size={14} />
                            In 10 days
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mt-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Payment History</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Month</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Amount</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentHistory.map((payment) => (
                                <tr key={payment.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="py-3 px-4 text-slate-900 font-medium">{payment.month}</td>
                                    <td className="py-3 px-4 font-bold text-slate-900">{payment.amount}</td>
                                    <td className="py-3 px-4 text-slate-500">{payment.date}</td>
                                    <td className="py-3 px-4">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                            <CheckCircle size={12} weight="bold" />
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button className="inline-flex items-center gap-1 text-[#FF6347] hover:text-[#E55A3C] font-semibold text-sm">
                                            <Receipt size={14} />
                                            Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentPortal;
