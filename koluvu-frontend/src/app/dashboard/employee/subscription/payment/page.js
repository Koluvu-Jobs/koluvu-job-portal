// src/app/main/dashboard/employee/subscription/payment/page.js

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ArrowLeft } from "lucide-react";

export default function PaymentPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  // Payment details state
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("");

  useEffect(() => {
    const planData = sessionStorage.getItem('selectedPlan');
    const userData = sessionStorage.getItem('userInfo');
    if (planData && userData) {
      setSelectedPlan(JSON.parse(planData));
      setUserInfo(JSON.parse(userData));
    } else {
      router.push('/main/dashboard/employee/subscription');
    }
  }, [router]);

  // Validation functions
  const validateCardNumber = (num) => /^\d{16}$/.test(num.replace(/\s+/g, ""));
  const validateExpiry = (exp) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(exp);
  const validateCVV = (cvv) => /^\d{3}$/.test(cvv);
  const validateCardName = (name) => /^[A-Za-z ]{2,}$/.test(name);
  const validateUpi = (id) => /^[\w.-]+@[\w.-]+$/.test(id);

  const handlePayment = () => {
    setError("");
    if (paymentMethod === "card") {
      if (
        !validateCardNumber(cardDetails.number) ||
        !validateExpiry(cardDetails.expiry) ||
        !validateCVV(cardDetails.cvv) ||
        !validateCardName(cardDetails.name)
      ) {
        setError("Please enter valid card details.");
        return;
      }
    }
    if (paymentMethod === "upi") {
      if (!validateUpi(upiId)) {
        setError("Please enter a valid UPI ID.");
        return;
      }
    }
    if (paymentMethod === "netbanking") {
      if (!bank || bank === "Select Your Bank") {
        setError("Please select your bank.");
        return;
      }
    }
    setIsProcessing(true);
    setTimeout(() => {
      const invoiceId = `INV-${Date.now()}`;
      sessionStorage.setItem('invoiceId', invoiceId);
      sessionStorage.setItem('paymentComplete', 'true');
      router.push('/main/dashboard/employee/subscription/success');
    }, 2000);
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">1</div>
        <div className="w-8 h-0.5 bg-blue-600" />
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">2</div>
        <div className="w-8 h-0.5 bg-blue-600" />
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">3</div>
        <div className="w-8 h-0.5 bg-blue-600" />
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">4</div>
        <div className="w-8 h-0.5 bg-gray-300" />
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-gray-600">5</div>
      </div>
    </div>
  );

  if (!selectedPlan || !userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
      <div className="max-w-6xl mx-auto">
        {renderStepIndicator()}
        
        <div className="mb-4">
          <h1 className="text-center text-xl font-semibold text-gray-600">Payment</h1>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <CreditCard className="mr-2" /> Payment
          </h2>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="radio" 
                  value="card" 
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <span>Credit/Debit Card</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="radio" 
                  value="upi" 
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <span>UPI</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="radio" 
                  value="netbanking" 
                  checked={paymentMethod === 'netbanking'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <span>Net Banking</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Card Number (16 digits)" 
                  value={cardDetails.number}
                  onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  maxLength={16}
                />
                <div className="flex space-x-4">
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    value={cardDetails.expiry}
                    onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    maxLength={5}
                  />
                  <input 
                    type="text" 
                    placeholder="CVV" 
                    value={cardDetails.cvv}
                    onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    maxLength={3}
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Cardholder Name" 
                  value={cardDetails.name}
                  onChange={e => setCardDetails({ ...cardDetails, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
            )}
            {paymentMethod === 'upi' && (
              <div>
                <input 
                  type="text" 
                  placeholder="UPI ID" 
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
            )}
            {paymentMethod === 'netbanking' && (
              <div>
                <select 
                  value={bank}
                  onChange={e => setBank(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Select Your Bank</option>
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                </select>
              </div>
            )}
            {error && (
              <p className="text-red-600 font-semibold mt-2">{error}</p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total to Pay:</span>
              <span>₹{selectedPlan.price}/-</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={() => router.push('/main/dashboard/employee/subscription/review')}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isProcessing}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Review
            </button>
            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex items-center flex-1 justify-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : `Pay Now ₹${selectedPlan.price}/-`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}