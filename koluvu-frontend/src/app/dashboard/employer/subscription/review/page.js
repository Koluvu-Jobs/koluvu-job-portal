'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const ReviewPage = () => {
  const router = useRouter();

  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    company: '',
    address: '',
  });
  const [plan, setPlan] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem('selectedPlan');
    if (stored) {
      setPlan(JSON.parse(stored));
    } else {
      router.push('/dashboard/employer/subscription/cart');
    }
  }, [router]);

  const validateForm = () => {
    const newErrors = {};
    if (!userDetails.name.trim()) newErrors.name = 'Name is required';
    if (!userDetails.email.trim()) newErrors.email = 'Email is required';
    if (!userDetails.company.trim()) newErrors.company = 'Company is required';
    if (!userDetails.address.trim()) newErrors.address = 'Address is required';
    if (userDetails.email && !/\S+@\S+\.\S+/.test(userDetails.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setUserDetails(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const goToPayment = () => {
    if (validateForm()) {
      localStorage.setItem('selectedPlan', JSON.stringify(plan));
      localStorage.setItem('billingDetails', JSON.stringify(userDetails));
      router.push('/dashboard/employer/subscription/payment');
    }
  };

  const goBackToCart = () => {
    router.push('/dashboard/employer/subscription/cart');
  };

  const calculateTotal = () => (plan ? plan.price : 0);

  if (!plan) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Review Your Order</h1>
          <p className="text-gray-600">Please review your details and subscription before payment.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
              <div className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">{plan.title} Plan</h4>
                    <p className="text-sm text-gray-600">
                      {plan.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} billing
                    </p>
                  </div>
                  <span className="font-semibold">₹{plan.price - 49}+49</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-blue-600">₹{calculateTotal() - 49}+49</span>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Details Form */}
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Billing Details</h3>
              <div className="space-y-4">
                {['name', 'email', 'company', 'address'].map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field === 'name' ? 'Full Name' :
                       field === 'email' ? 'Email Address' :
                       field === 'company' ? 'Company Name' : 'Billing Address'} *
                    </label>
                    {field === 'address' ? (
                      <textarea
                        rows={3}
                        value={userDetails[field]}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[field] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={`Enter ${field}`}
                      />
                    ) : (
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        value={userDetails[field]}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[field] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={`Enter ${field}`}
                      />
                    )}
                    {errors[field] && (
                      <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={goBackToCart}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Back to Cart
          </button>
          <button
            onClick={goToPayment}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
