import React, { useState } from 'react';
import { CreditCard, Building2, Calendar, CheckCircle } from 'lucide-react';

const PaymentPortal = () => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const paymentHistory = [
        { id: 1, month: "January 2026", amount: "₹45,000", date: "Jan 3, 2026", status: "Completed", receipt: "#REC001" },
        { id: 2, month: "December 2025", amount: "₹45,000", date: "Dec 2, 2025", status: "Completed", receipt: "#REC002" },
        { id: 3, month: "November 2025", amount: "₹45,000", date: "Nov 4, 2025", status: "Completed", receipt: "#REC003" },
        { id: 4, month: "October 2025", amount: "₹45,000", date: "Oct 1, 2025", status: "Completed", receipt: "#REC004" }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Payment Portal</h1>
                <p className="text-gray-600 mt-1">Manage your rent payments</p>
            </div>

            {/* Success Message */}
            {showSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle className="text-green-600" size={24} />
                    <div>
                        <div className="font-semibold text-green-900">Payment Successful!</div>
                        <div className="text-sm text-green-700">Your rent payment has been processed.</div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Payment Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Make a Payment</h2>

                        {/* Property Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Building2 className="text-blue-600" size={24} />
                                <div>
                                    <div className="font-semibold text-gray-900">Modern 3BHK Apartment</div>
                                    <div className="text-sm text-gray-600">Koramangala, Bangalore</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-200">
                                <span className="text-gray-700">Monthly Rent</span>
                                <span className="text-2xl font-bold text-blue-600">₹45,000</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Payment Method Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Payment Method
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('card')}
                                        className={`p-4 border-2 rounded-lg transition-all ${paymentMethod === 'card'
                                                ? 'border-blue-600 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <CreditCard className="mx-auto mb-2" size={24} />
                                        <div className="text-sm font-medium">Card</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('upi')}
                                        className={`p-4 border-2 rounded-lg transition-all ${paymentMethod === 'upi'
                                                ? 'border-blue-600 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="text-2xl mb-2">📱</div>
                                        <div className="text-sm font-medium">UPI</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('bank')}
                                        className={`p-4 border-2 rounded-lg transition-all ${paymentMethod === 'bank'
                                                ? 'border-blue-600 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="text-2xl mb-2">🏦</div>
                                        <div className="text-sm font-medium">Bank</div>
                                    </button>
                                </div>
                            </div>

                            {/* Card Payment Form */}
                            {paymentMethod === 'card' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Card Number
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="1234 5678 9012 3456"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Expiry Date
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                CVV
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Cardholder Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* UPI Payment */}
                            {paymentMethod === 'upi' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        UPI ID
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="yourname@upi"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            )}

                            {/* Bank Transfer */}
                            {paymentMethod === 'bank' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Account Number
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter account number"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            IFSC Code
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter IFSC code"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg"
                            >
                                Pay ₹45,000
                            </button>
                        </form>
                    </div>
                </div>

                {/* Payment Summary & History */}
                <div className="space-y-6">
                    {/* Payment Summary */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Rent Amount</span>
                                <span className="font-semibold">₹45,000</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Processing Fee</span>
                                <span className="font-semibold">₹0</span>
                            </div>
                            <div className="pt-3 border-t border-gray-200 flex justify-between">
                                <span className="font-bold text-gray-900">Total</span>
                                <span className="font-bold text-blue-600 text-xl">₹45,000</span>
                            </div>
                        </div>
                    </div>

                    {/* Next Payment Due */}
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar size={20} />
                            <span className="text-sm font-medium">Next Payment Due</span>
                        </div>
                        <div className="text-2xl font-bold">Feb 5, 2026</div>
                        <div className="text-purple-100 text-sm mt-1">In 10 days</div>
                    </div>
                </div>
            </div>

            {/* Payment History */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment History</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Month</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentHistory.map((payment) => (
                                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-900">{payment.month}</td>
                                    <td className="py-3 px-4 font-semibold text-gray-900">{payment.amount}</td>
                                    <td className="py-3 px-4 text-gray-600">{payment.date}</td>
                                    <td className="py-3 px-4">
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
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
